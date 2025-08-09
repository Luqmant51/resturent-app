const express = require("express");
const router = express.Router();

// Import route modules
const landing = require("./landing.routes");
const authRoute = require('./auth.routes');
const about = require("./about.routes");
const booking = require("./booking.routes");
const menu = require("./menu.routes");
const userRoute = require("./user.routes");
const order = require("./order.routes");

const routes = [
  { path: "/", route: landing },
  { path: '/', route: authRoute },
  { path: "/about", route: about },
  { path: '/user', route: userRoute },
  { path: "/booking", route: booking },
  { path: "/menu", route: menu },
  { path: "/orders", route: order },
];

routes.forEach(({ path, route }) => {
    router.use(path, route);
});


module.exports = router;
