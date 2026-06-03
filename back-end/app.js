
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'; 
import authRoutes from './route/Auth.js';
import userRoutes from './route/user.js';
import adminRoutes from './route/admin.js';
import categoryRoutes from './route/category.js';
import quizRoutes from './route/quizz.js';
import questionRoutes from './route/Question.js';
import attemptRoutes from './route/UserAttempt.js';
import errorHandler from './middleware/errorHandler.js'

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({ status: 'OK', time: new Date() });
});

app.all("/*splat", (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

app.use(errorHandler);

export default app;


