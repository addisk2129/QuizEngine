import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from './authSlice';
import Button from "../../ui/Button";
import Logo from "../../ui/Logo";
import Input from "../../ui/Input";
import Label from '../../ui/Label';
import Heading from "../../ui/Heading";
import { StyledAuthPage, HigherContainer, StyledContainer, StyledForm, LabelInput, AccountText } from './authui/StyledContainer';
import StyledLink from "../../ui/StyledLink";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
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
          <Heading $type='h3'>Welcome Back!</Heading>
          <p className="text-gray-200 mb-6">Please login to your account</p>

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

            <LabelInput>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </LabelInput>

            <div className="text-right">
              <button 
                type="button" 
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <Button
              $size="large"
              $variation="primary"
              className="w-full mt-2 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </Button>

            <div className="flex -mt-4">
              <AccountText className='text-white'>Don't have an account?</AccountText>
              <StyledLink to='/signup' className='mt-2'>
                Sign Up
              </StyledLink>
            </div>
          </StyledForm>
        </StyledContainer>
      </HigherContainer>
    </StyledAuthPage>
  );
}

export default Login;