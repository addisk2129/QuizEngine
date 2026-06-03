import mongoose from 'mongoose';
import validator from 'validator';


const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'fa-code'
  },
  color: {
    type: String,
    default: 'from-blue-500 to-cyan-500'
  },
  image: {
    type: String,
    default: '/images/categories/default.jpg'
  },
  totalQuizzes: {
    type: Number,
    default: 0
  },
  totalLearners: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;