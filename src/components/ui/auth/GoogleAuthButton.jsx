import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext";

const GoogleLoginButton = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google user:', decoded);
      login(decoded); // ✅ Update context + localStorage

      localStorage.setItem('user', JSON.stringify(decoded));
      localStorage.setItem('token', credentialResponse.credential);

      navigate('/');
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log('Google login failed')}
    />
  );
};

export default GoogleLoginButton;
