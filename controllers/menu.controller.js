const db = require("../models");

const menu = async (req, res) => {
  
  let isLoggedIn = false;
  let user = null;
  let isAdmin = false;
  const token = req.cookies.JWT;
  
  try {
    const menusRaw = await db.Menu.findAll({ order: [["menu_date", "DESC"]] });
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        isLoggedIn = true;
        user = await db.User.findByPk(decoded.user_id);
        if (decoded.is_admin) {
          isAdmin = true;
        }
      } catch (err) {
        console.log("Invalid or expired token:", err.message);
      }
    }
    const menus = menusRaw.map((m) => ({
      id: m.menu_id,
      name: m.food_name,
      description: m.description || "",
      price: m.price || 0,
      image: m.image_path,
      category: "all",
    }));

    res.render("pages/menu", { menus, isLoggedIn, isAdmin });
  } catch (err) {
    console.error("Failed to load menus:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Helper to format a Sequelize row for the view
function formatMenuRow(m) {
  return {
    menu_id: m.menu_id,
    menu_date: m.menu_date,
    food_name: m.food_name,
    items: m.food_name ? m.food_name.split(",").map((i) => i.trim()) : [],
    price: m.price ?? null,
    image_path: m.image_path ?? null,
  };
}

// LIST & Create form page (create-mode)
const getAllMenus = async (req, res) => {
  try {
    const menusRaw = await db.Menu.findAll({ order: [["menu_date", "DESC"]] });
    const menus = menusRaw.map(formatMenuRow);

    return res.render("pages/daily-menu", {
      menu: null,
      menus,
      isLoggedIn: true,
      isAdmin: true,
    });
  } catch (err) {
    console.error("Error fetching menus:", {
      message: err.message,
      stack: err.stack,
      sql: err.sql || "N/A",
    });
    return res.status(500).send("Internal Server Error");
  }
};

// Edit page (prefill single menu + list)
const getEditMenuPage = async (req, res) => {
  try {
    const id = req.params.id;
    const m = await db.Menu.findByPk(id);
    if (!m) return res.status(404).send("Menu not found");

    const menusRaw = await db.Menu.findAll({ order: [["menu_date", "DESC"]] });
    const menus = menusRaw.map(formatMenuRow);

    return res.render("pages/daily-menu", {
      menu: formatMenuRow(m),
      menus,
      isLoggedIn: true,
      isAdmin: true,
    });
  } catch (err) {
    console.error("Error fetching menu for edit:", {
      message: err.message,
      stack: err.stack,
      sql: err.sql || "N/A",
    });
    return res.status(500).send("Internal Server Error");
  }
};

// CREATE (multipart/form-data, multer should run before this)
const createMenu = async (req, res) => {
  try {
    const { menu_date, food_name, menu_price } = req.body;

    if (menu_price && (isNaN(menu_price) || menu_price < 0)) {
      return res.status(400).json({ success: false, error: "Invalid price" });
    }

    await db.Menu.create({
      menu_date,
      food_name,
      description: req.body.description || null,
      price: menu_price || null,
      image_path: req.file ? `/uploads/menu/${req.file.filename}` : null,
    });

    return res.json({ success: true, message: "Menu created" }); // Always JSON
  } catch (err) {
    console.error("Error creating menu:", err);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

// UPDATE (multipart; method-override or real PUT route)
const updateMenu = async (req, res) => {
  try {
    const id = req.params.id;
    const menu = await db.Menu.findByPk(id);
    if (!menu)
      return res.status(404).json({ success: false, error: "Menu not found" });

    const { menu_date, food_name, menu_price, remove_image } = req.body;

    // Validate price
    if (menu_price && (isNaN(menu_price) || menu_price < 0)) {
      return res.status(400).json({ success: false, error: "Invalid price" });
    }

    // Handle image: use new file if provided, remove if requested, or keep existing
    let image_path = menu.image_path;
    if (remove_image === "true") {
      image_path = null; // Clear the image
      // Optionally, delete the old file from the server (requires fs module)
      if (menu.image_path) {
        const fs = require("fs").promises;
        const path = require("path");
        try {
          await fs.unlink(path.join(__dirname, "../public", menu.image_path));
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
    } else if (req.file) {
      image_path = `/uploads/menu/${req.file.filename}`;
    }

    await menu.update({
      menu_date,
      food_name,
      description: req.body.description || null, // <-- Added
      price: menu_price || null,
      image_path,
    });

    if (req.xhr || req.headers.accept?.includes("application/json")) {
      return res.json({ success: true, message: "Menu updated" });
    }
    return res.redirect("/daily-menu");
  } catch (err) {
    console.error("Error updating menu:", err);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

// API: get menu by id (JSON)
const getMenuById = async (req, res) => {
  try {
    const m = await db.Menu.findByPk(req.params.id);
    if (!m) return res.status(404).json({ error: "Menu not found" });
    return res.json(m);
  } catch (err) {
    console.error("Error fetching menu by ID:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteMenu = async (req, res) => {
  try {
    const id = req.params.id;
    const menu = await db.Menu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ success: false, error: "Menu not found" });
    }

    // If there's an image, remove it from disk
    if (menu.image_path) {
      const fs = require("fs").promises;
      const path = require("path");
      try {
        await fs.unlink(path.join(__dirname, "../public", menu.image_path));
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }

    await menu.destroy();

    if (req.xhr || req.headers.accept?.includes("application/json")) {
      return res.json({ success: true, message: "Menu deleted" });
    }

    return res.redirect("/daily-menu");
  } catch (err) {
    console.error("Error deleting menu:", err);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  getAllMenus,
  getEditMenuPage,
  createMenu,
  updateMenu,
  getMenuById,
  deleteMenu,
  menu,
};
