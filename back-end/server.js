import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wee8syn.mongodb.net/Exams?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url)
  .then(() => console.log('DB Connected successfully'))
  .catch((err) => console.log('Something went wrong:', err));

const server = app.listen(4000, () => console.log("app is running on port 4000"));