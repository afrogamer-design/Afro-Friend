import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    const { method = 'GET', data = null, headers = {} } = options;
    
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await axios({
        url,
        method,
        data,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });

      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'An error occurred');
      throw err;
    }
  }, []);

  const get = useCallback((endpoint) => request(endpoint), [request]);
  const post = useCallback((endpoint, data) => request(endpoint, { method: 'POST', data }), [request]);
  const put = useCallback((endpoint, data) => request(endpoint, { method: 'PUT', data }), [request]);
  const del = useCallback((endpoint) => request(endpoint, { method: 'DELETE' }), [request]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
    clearError: () => setError(null)
  };
};