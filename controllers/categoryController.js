const { success, error } = require("../utils/responseWrapper");
const Category = require("../models/Category");
const Admin = require("../models/Admin");

const createCategory = async (req, res) => {
  try {
    const { categoryName, description, status } = req.body;

    if (!categoryName || !description || !status) {
      return res.send(error(400, "All fields are required"));
    }

    const existingCategory = await Category.findOne({ categoryName });

    if (existingCategory) {
      return res.send(error(409, "Category already exists"));
    }

    // Assuming you have the admin ID available in the request, you can associate the category with the admin who created it
    const adminId = req._id; // Assuming the admin ID is stored in req.user._id
    const newCategory = await Category.create({
      categoryName,
      description,
      status,
      createdBy: adminId, // Associate the category with the admin who created it
    });

    // Update the admin's categories array to include the newly created category
    await Admin.findByIdAndUpdate(adminId, {
      $push: { categories: newCategory._id },
    });

    return res.json(success(200, { newCategory }));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

// Update an existing category
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updates = req.body;

    // Find the category by id and update it
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updates,
      { new: true }
    );

    if (!updatedCategory) {
      // return res.status(404).json(error(404, "Category not found"));
      return red.send(error(404, "Category not found"));
    }

    return res.json(success(200, { updatedCategory }));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

const getCategoryByAdmin = async (req, res) => {
  try {
    // Assuming the admin ID is provided in the request parameters or from the authenticated user
    const adminId = req._id; // Assuming adminId is provided as a parameter

    // Find the admin by ID
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.send(error(404, "Admin not found"));
    }

    // Find categories created by the admin
    const categories = await Category.find({ createdBy: adminId });

    return res.json(success(200, { categories }));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

// Delete an existing category
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find the category by id and delete it
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      // return res.status(404).json(error(404, "Category not found"));
      return res.send(error());
    }

    res.json(success(200, "Category deleted successfully"));
  } catch (err) {
    console.error("Error deleting category:", err);
    res
      .status(500)
      .json(error(500, "An error occurred while deleting the category"));
  }
};

// Other controller functions for handling category operations can be added here

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryByAdmin,
};
