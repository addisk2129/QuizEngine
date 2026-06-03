import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup, googleLogin } from './authSlice';
import { FcGoogle } from 'react-icons/fc';
import Button from "../../ui/Button";
import Logo from "../../ui/Logo";
import Input from "../../ui/Input";
import Label from '../../ui/Label';
import Heading from "../../ui/Heading";
import { StyledAuthPage, HigherContainer, StyledContainer, StyledForm, LabelInput, AccountText } from './authui/StyledContainer';
import ButtonIcon from "../../ui/ButtonIcon";
import StyledLink from '../../ui/StyledLink';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function SignUP() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signup(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await dispatch(googleLogin({ credential: credentialResponse.credential }));
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
          <Heading $type='h3'>Welcome to QUIZENGINE</Heading>

          <StyledForm onSubmit={handleSubmit}>
            <LabelInput>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                name="username"
                id="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </LabelInput>

            <LabelInput>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </LabelInput>

            <LabelInput>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </LabelInput>

            <LabelInput>
              <Label htmlFor="passwordConfirm">Password Confirm</Label>
              <Input
                type="password"
                name="passwordConfirm"
                id="passwordConfirm"
                placeholder="Confirm your password"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
              />
            </LabelInput>

            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log('Google Login Failed')}
                />
              </div>
            </GoogleOAuthProvider>

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
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <div className="flex -mt-4">
              <AccountText className='text-white'>Already have an account?</AccountText>
              <StyledLink to='/login' className='mt-2'>
                Sign In
              </StyledLink>
            </div>
          </StyledForm>
        </StyledContainer>
      </HigherContainer>
    </StyledAuthPage>
  );
}

export default SignUP;