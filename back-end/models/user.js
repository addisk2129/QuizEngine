import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
   userName: {
      type: String,
      required: [true, 'Please tell us your userName!'],
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    emailVerificationOTP: {
      type: String,
      select: false
    },

    emailVerificationOTPExpires: {
      type: Date,
      select: false
    },

    emailVerified: {
      type: Boolean,
      default: false
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },

    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },

    password: {
      type: String,
      minlength: 8,
      select: false
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    passwordChangedAt: Date,
    lastLogin:Date,
    passwordResetToken: String,

    passwordResetExpires: Date,
    refreshToken: {
      type: String,
      select: false  
    },
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date
    }
  },
  {
    timestamps: true 
  }
);



userSchema.pre('save', async function (next) {

  if (!this.isModified('password') || !this.password) return;
  
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});



userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;

  this.passwordChangedAt = Date.now() - 1000;
});




userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};



userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min

  return resetToken;
};




const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;