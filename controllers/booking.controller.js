const book = async (req, res) => {
  const token = req.cookies.JWT;

  let isLoggedIn = false;
  let user = null;
  let isAdmin = false;

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
    res.render("pages/book", {
    isLoggedIn,
    isAdmin,
    user,
    status: req.query.status
  });
};

module.exports = { book };
