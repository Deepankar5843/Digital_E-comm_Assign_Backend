const router = require("express").Router();
const itemController = require("../controllers/itemController");
const requireUser = require("../middlewares/requireUser");

// Create a new item
router.post("/", requireUser, itemController.createItem);

// Update an existing item
router.put("/:id", requireUser, itemController.updateItem);

router.get("/:id", requireUser, itemController.getItems);

// Delete an existing item
router.delete("/:id", requireUser, itemController.deleteItem);

// Other routes for item operations can be added here

module.exports = router;
