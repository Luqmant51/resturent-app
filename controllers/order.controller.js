const jwt = require("jsonwebtoken");
const db = require("../models");
const { Order, User, Menu } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_here"; // must match generateToken

exports.createOrder = async (req, res) => {
  try {
    // ✅ Check JWT cookie
    const token = req.cookies.JWT;
    if (!token) {
      // Send redirect instruction for frontend JS
      return res.json({ redirect: "/login" });
    }

    // ✅ Decode and verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.json({ redirect: "/login" });
    }

    const { menu_id, quantity, price } = req.body;

    if (!menu_id || !quantity || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const total_price = parseFloat(price) * parseInt(quantity);
    const newOrder = await Order.create({
      user_id: decoded.user_id,
      menu_id,
      quantity,
      total_price,
    });

    return res.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ["user_id", "user_name", "user_email"]
        },
        {
          model: Menu,
          attributes: ["menu_id", "food_name", "price"]
        }
      ],
      order: [["order_id", "DESC"]] // no createdAt in your model, so using order_id
    });

    let isAdmin = false;
    let isLoggedIn = false;

    if (req.cookies.JWT) {
      try {
        const decoded = jwt.verify(req.cookies.JWT, JWT_SECRET);
        isAdmin = decoded.is_admin === true;
        isLoggedIn = true;
      } catch (err) {
        console.warn("Invalid token in getAllOrders");
      }
    }

    console.log(orders);
    

    res.render("pages/adminOrders", {
      orders,
      isAdmin,
      isLoggedIn
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).send("Server error");
  }
};

exports.confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.update({ status: "confirmed" }, { where: { order_id: id } });
    res.json({ success: true });
  } catch (err) {
    console.error("Error confirming order:", err);
    res.status(500).json({ success: false });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.destroy({ where: { order_id: id } });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ success: false });
  }
};
