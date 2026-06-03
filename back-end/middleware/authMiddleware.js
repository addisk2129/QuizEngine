import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

const authMidlleware={
  protect:catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to access this resource.', 401));
    }
  
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }
  
    if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('User recently changed password. Please log in again.', 401));
    }
  
    req.user = currentUser;
    next();
  
  }),

authorize:(...allowedRoles)=>{
  return(req,res,next)=>{
   const {role} = req.user;
   const hasPermission = allowedRoles.includes(role)
   if(!hasPermission){
    return next(new AppError('Forbidden: You do not have permission to perform this action.', 401));
   }
    next();
  }
}

}

export default authMidlleware;