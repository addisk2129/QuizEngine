import express from 'express';
import categoryController from '../controllers/category.js';
import authMidlleware from '../middleware/authMiddleware.js';

const categoryRoute = express.Router();

categoryRoute.get('/', categoryController.getAllCategory);

categoryRoute.use(authMidlleware.protect,authMidlleware.authorize('admin'))
categoryRoute.post('/', categoryController.createCategory);
categoryRoute.patch('/:catId', categoryController.updateCategory);
categoryRoute.delete('/:catId', categoryController.deleteCategory);

export default categoryRoute;