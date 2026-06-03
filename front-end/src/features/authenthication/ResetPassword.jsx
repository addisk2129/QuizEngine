import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword, clearError } from './authSlice';
import Button from "../../ui/Button";
import Logo from "../../ui/Logo";
import Input from "../../ui/Input";
import Label from '../../ui/Label';
import Heading from "../../ui/Heading";
import { StyledAuthPage, HigherContainer, StyledContainer, StyledForm, LabelInput } from './authui/StyledContainer';
import StyledLink from "../../ui/StyledLink";

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [localError, setLocalError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { isLoading, error, message } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearError());
    
    if (password !== passwordConfirm) {
      setLocalError("Passwords do not match!");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password is too short (minimum 8 characters)");
      return;
    }

    const result = await dispatch(resetPassword({ token, passwordData: { password, passwordConfirm } }));
    
    if (result.meta.requestStatus === 'fulfilled') {
      setTimeout(() => {
        navigate('/'); // After resetting, they're typically logged in automatically by the backend sending tokens
      }, 1500);
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
          <Heading $type='h3'>Reset Password</Heading>
          <p className="text-gray-200 mb-6">Enter your new password below.</p>

          <StyledForm onSubmit={handleSubmit}>
            <LabelInput>
              <Label htmlFor="password">New Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </LabelInput>

            <LabelInput>
              <Label htmlFor="passwordConfirm">Confirm New Password</Label>
              <Input
                type="password"
                id="passwordConfirm"
                placeholder="Confirm new password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </LabelInput>

            {localError && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm mt-4">
                {localError}
              </div>
            )}

            {error && !localError && (
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
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </StyledForm>
        </StyledContainer>
      </HigherContainer>
    </StyledAuthPage>
  );
}

export default ResetPassword;
