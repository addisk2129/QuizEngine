import Category from '../models/category.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const categoryController = {
  createCategory: catchAsync(async (req, res, next) => {
    const { name, description, icon, color } = req.body;
  
    if (!name) {
      return next(new AppError('Category name is required', 400));
    }
  
    // Generate slug from name
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  
    const existingCategory = await Category.findOne({ slug });
  
    if (existingCategory) {
      return next(new AppError('Category already exists', 400));
    }
  
    const newCategory = await Category.create({
      name,
      slug,  // Add this line
      description,
      icon,
      color
    });
  
    res.status(201).json({
      status: 'success',
      data: { category: newCategory }
    });
  }),

  getAllCategory: catchAsync(async (req, res, next) => {
    const allCategory = await Category.find();

    if (!allCategory) return next(new AppError('Not Found', 404));

    res.status(200).json({
      status: "success",
      data: {
        allCategory
      }
    });
  }),

  updateCategory: catchAsync(async (req, res, next) => {
    const { catId } = req.params;
    const { name, description, icon, color } = req.body;
  
    // If name is being updated, update slug too
    const updateData = { description, icon, color };
    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
  
    const updated = await Category.findByIdAndUpdate(catId, updateData, {
      new: true,
      runValidators: true
    });
  
    if (!updated) {
      return next(new AppError('Category not found', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: { category: updated }
    });
  }),
  deleteCategory: catchAsync(async (req, res, next) => {
    const { catId } = req.params;

    const category = await Category.findByIdAndDelete(catId);

    if (!category) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: "success",
      message: "Category Deleted successfully",
    });
  })
};

export default categoryController;