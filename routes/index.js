const express = require("express");
const router = express.Router();

// Import route modules
const landing = require("./landing.routes");
const authRoute = require('./auth.routes');
const about = require("./about.routes");
const booking = require("./booking.routes");
const menu = require("./menu.routes");
const userRoute = require("./user.routes");

const routes = [
  { path: "/", route: landing },
  { path: '/', route: authRoute },
  { path: "/about", route: about },
  { path: '/user', route: userRoute },
  { path: "/booking", route: booking },
  { path: "/menu", route: menu },
];

routes.forEach(({ path, route }) => {
  console.log('path:', path);
  console.log('route stack:', route.stack?.map(layer => layer.route?.path || layer.name));
  
  router.use(path, route);
});


module.exports = router;
