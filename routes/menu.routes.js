const express = require("express");
const menuController = require("../controllers/menu.controller");
const upload = require("../middlewares/upload"); // Your multer middleware

const router = express.Router();
router.get("/menus", menuController.menu);

router.route("/admin")
  .get(menuController.getAllMenus)
  .post(upload.single("menu_image"), menuController.createMenu);

// similarly for edit/update/delete routes
router.route("/admin/:id")
  .get(menuController.getMenuById)
  .put(upload.single("menu_image"), menuController.updateMenu)
  .delete(menuController.deleteMenu);

router.route("/admin/:id/edit").get(menuController.getEditMenuPage);


module.exports = router;
