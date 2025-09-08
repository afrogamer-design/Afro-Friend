import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { X, Send } from 'lucide-react';

const MessageModal = ({ receiver, onClose }) => {
  const { user } = useAuth();
  const { post, loading } = useApi();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    try {
      await post('/api/messages', {
        receiver_id: receiver.id,
        content: message.trim()
      });
      
      setMessage('');
      onClose();
    } catch (err) {
      setError('Failed to send message');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Message {receiver.username}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Message</label>
            <textarea
              className="form-input"
              rows="4"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError('');
              }}
              placeholder={`Write a message to ${receiver.username}...`}
            />
            {error && <div className="text-danger">{error}</div>}
          </div>

          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !message.trim()}
            >
              <Send size={16} />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;