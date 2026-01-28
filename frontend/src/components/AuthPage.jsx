import { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

export default function AuthPage() {
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSwitchToSignUp = () => {
    setShowSignUp(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignUp(false);
  };

  return showSignUp ? (
    <SignUp onSwitchToLogin={handleSwitchToLogin} />
  ) : (
    <Login onSwitchToSignUp={handleSwitchToSignUp} />
  );
}
