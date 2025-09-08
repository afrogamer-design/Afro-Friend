import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { UserPlus, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    country: '',
    games: []
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [games, setGames] = useState([]);
  
  const { signUp } = useAuth();
  const { post, get } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const data = await get('/api/games');
      setGames(data);
    } catch (err) {
      console.error('Error fetching games:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGameSelect = (gameId) => {
    setFormData(prev => ({
      ...prev,
      games: prev.games.includes(gameId)
        ? prev.games.filter(id => id !== gameId)
        : [...prev.games, gameId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First, create the user account with Supabase auth
      await signUp(formData.phone);

      // Then, create the user profile in our database
      await post('/api/users', formData);

      navigate('/login', { 
        state: { message: 'Account created successfully! Please verify your phone number.' }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
        <div className="card-header text-center">
          <UserPlus size={48} className="text-primary" />
          <h2 className="card-title">Create Account</h2>
          <p className="card-subtitle">Join the AfroGamer community</p>
        </div>

        {error && (
          <div className="error-message text-danger text-center mb-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="step-content">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <select
                  name="country"
                  className="form-select"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Egypt">Egypt</option>
                  {/* Add more African countries */}
                </select>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(2)}
                style={{ width: '100%' }}
              >
                Next: Select Games
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <div className="form-group">
                <label className="form-label">Select Your Games</label>
                <div className="games-grid">
                  {games.map(game => (
                    <label key={game.id} className="game-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.games.includes(game.id)}
                        onChange={() => handleGameSelect(game.id)}
                      />
                      <span>{game.game_name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStep(1)}
                  style={{ flex: 1 }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </form>

        <style jsx>{`
          .games-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 0.5rem;
          }
          
          .game-checkbox {
            display: flex;
            align-items: center;
            padding: 0.5rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            transition: border-color 0.2s;
          }
          
          .game-checkbox:hover {
            border-color: var(--primary);
          }
          
          .game-checkbox input {
            margin-right: 0.5rem;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Register;