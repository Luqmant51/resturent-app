const jwt = require("jsonwebtoken");
const db = require("../models");
const Order = db.Order;

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_here"; // must match generateToken

exports.createOrder = async (req, res) => {
  try {
    // ✅ Check JWT cookie
    const token = req.cookies.JWT;
    if (!token) {
      // Send redirect instruction for frontend JS
      return res.json({ redirect: '/login' });
    }

    // ✅ Decode and verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.json({ redirect: '/login' });
    }

    const { menu_id, quantity, price } = req.body;

    if (!menu_id || !quantity || !price) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const total_price = parseFloat(price) * parseInt(quantity);

    // ✅ Use user_id from decoded token
    const newOrder = await Order.create({
      user_id: decoded.user_id,
      menu_id,
      quantity,
      total_price
    });

    return res.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
