import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, clearError } from './authSlice';
import Button from "../../ui/Button";
import Logo from "../../ui/Logo";
import Input from "../../ui/Input";
import Label from '../../ui/Label';
import Heading from "../../ui/Heading";
import { StyledAuthPage, HigherContainer, StyledContainer, StyledForm, LabelInput } from './authui/StyledContainer';
import StyledLink from "../../ui/StyledLink";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, message } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    await dispatch(forgotPassword(email));
  };

  return (
    <StyledAuthPage>
      <HigherContainer>
        <div className="relative -top-7 w-full left-30 text-center mb-8">
          <StyledLink to='/'>
            <Logo />
          </StyledLink>
        </div>

        <StyledContainer>
          <Heading $type='h3'>Forgot Password</Heading>
          <p className="text-gray-200 mb-6">Enter your email address to receive a password reset link.</p>

          <StyledForm onSubmit={handleSubmit}>
            <LabelInput>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </LabelInput>

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm mt-4">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 text-green-200 text-sm mt-4">
                {message}
              </div>
            )}

            <Button
              $size="large"
              $variation="primary"
              className="w-full mt-4 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center mt-6">
              <button 
                type="button" 
                onClick={() => navigate('/login')}
                className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                &larr; Back to Login
              </button>
            </div>
          </StyledForm>
        </StyledContainer>
      </HigherContainer>
    </StyledAuthPage>
  );
}

export default ForgotPassword;
