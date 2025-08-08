const express = require("express");
const menuController = require("../controllers/dailyMenu.controller");
const upload = require("../middlewares/upload"); // Your multer middleware

const router = express.Router();

router.route("/")
  .get(menuController.getAllMenus)
  .post(upload.single("menu_image"), menuController.createMenu);

router.route("/create")
  .get(menuController.getAllMenus); // Render create form

router.route("/:id")
  .get(menuController.getMenuById)
  .put(upload.single("menu_image"), menuController.updateMenu)
  .delete(menuController.deleteMenu); // <-- NEW

router.route("/:id/edit")
  .get(menuController.getEditMenuPage); // Render edit form

module.exports = router;