const jwt = require("jsonwebtoken");
const db = require('../models');

const getalluser = async (req, res) => {
  try {
    const token = req.cookies.JWT;
    let isLoggedIn = false;
    let user = null;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      isLoggedIn = true;
      user = await db.User.findByPk(decoded.user_id);

      if (!user?.is_admin) {
        return res.status(403).send("Access Denied: Admins only");
      }

      const users = await db.User.findAll();
      return res.render('pages/admin-users', {
        users,
        isLoggedIn,
        user,
        isAdmin: true
      });
    }

    return res.status(401).send("Unauthorized");
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).send("Internal Server Error");
  }
};

const getuserbyid = async (req, res) => {
  try {
    const id = req.params.id; 
    const user = await db.User.findOne({
      where: { user_id: id }
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    return res.status(500).send("Internal Server Error");
  }
};

const toggleAdmin = async (req, res) => {
  try {
    const token = req.cookies.JWT;
    if (!token) return res.status(401).send("Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decoded.user_id;

    const currentUser = await db.User.findByPk(currentUserId);
    if (!currentUser || !currentUser.is_admin) {
      return res.status(403).send("Access Denied: Admins only");
    }

    const targetUserId = req.params.id;
    if (parseInt(targetUserId) === currentUserId) {
      return res.status(400).send("You cannot change your own admin status.");
    }

    const user = await db.User.findByPk(targetUserId);
    if (!user) return res.status(404).send("User not found");

    user.is_admin = !user.is_admin;
    await user.save();

    res.redirect("/user"); // your admin dashboard route
  } catch (err) {
    console.error("Error toggling admin:", err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = { getalluser, getuserbyid, toggleAdmin };
