import React from 'react';
import { MessageSquare, MapPin, Clock } from 'lucide-react';

const ProfileCard = ({ gamer, onMessageClick }) => {
  const getInitials = (username) => {
    return username.split(' ').map(name => name[0]).join('').toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-card fade-in">
      <div className="profile-header">
        <div className="profile-avatar">
          {getInitials(gamer.username)}
        </div>
        <div className="profile-info">
          <h3>{gamer.username}</h3>
          <p>
            <MapPin size={14} />
            {gamer.country}
          </p>
          <p>
            <Clock size={14} />
            Joined {formatDate(gamer.created_at)}
          </p>
        </div>
      </div>

      {gamer.games && gamer.games.length > 0 && (
        <div className="profile-games">
          {gamer.games.slice(0, 4).map((game, index) => (
            <span key={index} className="game-tag">
              {game.name}
            </span>
          ))}
          {gamer.games.length > 4 && (
            <span className="game-tag">
              +{gamer.games.length - 4} more
            </span>
          )}
        </div>
      )}

      <button
        onClick={() => onMessageClick(gamer)}
        className="btn btn-primary mt-1"
        style={{ width: '100%' }}
      >
        <MessageSquare size={16} />
        Send Message
      </button>
    </div>
  );
};

export default ProfileCard;