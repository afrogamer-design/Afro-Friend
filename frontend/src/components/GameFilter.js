import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { ChevronDown } from 'lucide-react';

const GameFilter = ({ selectedGame, onGameChange }) => {
  const { get, loading } = useApi();
  const [games, setGames] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const data = await get('/api/games');
      setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleGameSelect = (gameName) => {
    onGameChange(gameName);
    setIsOpen(false);
  };

  const selectedGameObj = games.find(game => game.game_name === selectedGame);

  return (
    <div className="form-group">
      <label className="form-label">Filter by Game</label>
      <div className="dropdown-container">
        <button
          className="form-select"
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>{selectedGame || 'All Games'}</span>
          <ChevronDown size={16} />
        </button>
        
        {isOpen && (
          <div className="dropdown-menu">
            <div
              className="dropdown-item"
              onClick={() => handleGameSelect('')}
            >
              All Games
            </div>
            {games.map((game) => (
              <div
                key={game.id}
                className="dropdown-item"
                onClick={() => handleGameSelect(game.game_name)}
              >
                {game.game_name}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .dropdown-container {
          position: relative;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .dropdown-item {
          padding: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .dropdown-item:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
};

export default GameFilter;