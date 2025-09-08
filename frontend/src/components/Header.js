import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Gamepad2, MessageSquare, User, LogOut, LogIn, UserPlus } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <Gamepad2 size={32} className="logo-icon" />
          <span>AfroGamer Connect</span>
        </Link>

        <nav className="nav">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <Gamepad2 size={18} />
                Discover
              </Link>
              <Link to="/messages" className="nav-link">
                <MessageSquare size={18} />
                Messages
              </Link>
              <Link to="/profile" className="nav-link">
                <User size={18} />
                Profile
              </Link>
              <button onClick={handleSignOut} className="btn btn-outline">
                <LogOut size={18} />
                Sign Out
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                <LogIn size={18} />
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                <UserPlus size={18} />
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;