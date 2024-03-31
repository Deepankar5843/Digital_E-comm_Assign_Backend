const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const requireUser = require("../middlewares/requireUser");

// Create a new category
router.post("/", requireUser, categoryController.createCategory);

// Update an existing category
router.put("/:id", requireUser, categoryController.updateCategory);

router.get("/:id", requireUser, categoryController.getCategoryByAdmin);

// Delete an existing category
router.delete("/:id", requireUser, categoryController.deleteCategory);

// Other routes for category operations can be added here

module.exports = router;
