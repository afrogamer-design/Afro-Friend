import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Gamepad2, Users, MessageSquare, Globe } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="card text-center">
          <div className="card-header">
            <Gamepad2 size={64} className="text-primary" />
            <h1 className="card-title">Welcome to AfroGamer Connect</h1>
            <p className="card-subtitle">
              Connect with African gamers, find teammates, and build your gaming community
            </p>
          </div>

          {user ? (
            <div>
              <p>Welcome back, {user.user_metadata?.username || 'Gamer'}!</p>
              <Link to="/dashboard" className="btn btn-primary mt-1">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex gap-2 justify-center">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section mt-2">
        <div className="card">
          <h2 className="text-center mb-2">Why Join AfroGamer Connect?</h2>
          
          <div className="grid grid-3">
            <div className="feature-card text-center">
              <Users size={48} className="text-primary" />
              <h3>Find Gamers</h3>
              <p>Connect with players from across Africa who share your gaming interests</p>
            </div>

            <div className="feature-card text-center">
              <MessageSquare size={48} className="text-primary" />
              <h3>Chat & Team Up</h3>
              <p>Message other gamers, form teams, and coordinate your gameplay</p>
            </div>

            <div className="feature-card text-center">
              <Globe size={48} className="text-primary" />
              <h3>African Focus</h3>
              <p>Built specifically for the African gaming community</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%);
          backdrop-filter: blur(10px);
          border-radius: var(--radius);
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .feature-card {
          padding: 2rem;
          background: rgba(255,255,255,0.8);
          border-radius: var(--radius);
          transition: var(--transition);
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.95);
        }
      `}</style>
    </div>
  );
};

export default Home;