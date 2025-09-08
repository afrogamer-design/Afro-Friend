import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import ProfileCard from '../components/ProfileCard';
import GameFilter from '../components/GameFilter';
import CountryFilter from '../components/CountryFilter';
import MessageModal from '../components/MessageModal';
import Loader from '../components/Loader';
import { Search, Filter, Users } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { get } = useApi();
  const [gamers, setGamers] = useState([]);
  const [filteredGamers, setFilteredGamers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGamer, setSelectedGamer] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    fetchGamers();
  }, []);

  useEffect(() => {
    filterGamers();
  }, [gamers, selectedGame, selectedCountry, searchQuery]);

  const fetchGamers = async () => {
    try {
      setLoading(true);
      const data = await get('/api/users');
      setGamers(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch gamers. Please try again.');
      console.error('Error fetching gamers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterGamers = () => {
    let filtered = gamers.filter(gamer => gamer.id !== user?.id);

    if (selectedGame) {
      filtered = filtered.filter(gamer => 
        gamer.games?.some(game => 
          game.name.toLowerCase().includes(selectedGame.toLowerCase())
        )
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter(gamer => 
        gamer.country.toLowerCase() === selectedCountry.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(gamer =>
        gamer.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredGamers(filtered);
  };

  const handleSendMessage = (gamer) => {
    setSelectedGamer(gamer);
    setShowMessageModal(true);
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard-page">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Find Fellow Gamers</h1>
          <p className="card-subtitle">
            Connect with African gamers who share your passion
          </p>
        </div>

        <div className="filters">
          <div className="filter-grid">
            <div className="form-group">
              <div className="form-input" style={{ display: 'flex', alignItems: 'center' }}>
                <Search size={20} style={{ marginRight: '10px', color: '#666' }} />
                <input
                  type="text"
                  placeholder="Search gamers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', flex: 1 }}
                />
              </div>
            </div>

            <GameFilter
              selectedGame={selectedGame}
              onGameChange={setSelectedGame}
            />

            <CountryFilter
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="results-header">
          <h3>
            <Users size={20} style={{ marginRight: '10px' }} />
            {filteredGamers.length} {filteredGamers.length === 1 ? 'gamer' : 'gamers'} found
          </h3>
        </div>

        {filteredGamers.length === 0 ? (
          <div className="text-center mt-2">
            <p>No gamers found matching your criteria.</p>
            <button 
              onClick={() => {
                setSelectedGame('');
                setSelectedCountry('');
                setSearchQuery('');
              }}
              className="btn btn-primary mt-1"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-3">
            {filteredGamers.map(gamer => (
              <ProfileCard
                key={gamer.id}
                gamer={gamer}
                onMessageClick={handleSendMessage}
              />
            ))}
          </div>
        )}
      </div>

      {showMessageModal && selectedGamer && (
        <MessageModal
          receiver={selectedGamer}
          onClose={() => {
            setShowMessageModal(false);
            setSelectedGamer(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;