import React from 'react';
import { ChevronDown } from 'lucide-react';

const CountryFilter = ({ selectedCountry, onCountryChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const africanCountries = [
    'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi',
    'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros',
    'Congo', 'DR Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea',
    'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau',
    'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi',
    'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger',
    'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles',
    'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania',
    'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
  ];

  const handleCountrySelect = (country) => {
    onCountryChange(country);
    setIsOpen(false);
  };

  return (
    <div className="form-group">
      <label className="form-label">Filter by Country</label>
      <div className="dropdown-container">
        <button
          className="form-select"
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>{selectedCountry || 'All Countries'}</span>
          <ChevronDown size={16} />
        </button>
        
        {isOpen && (
          <div className="dropdown-menu">
            <div
              className="dropdown-item"
              onClick={() => handleCountrySelect('')}
            >
              All Countries
            </div>
            {africanCountries.map((country) => (
              <div
                key={country}
                className="dropdown-item"
                onClick={() => handleCountrySelect(country)}
              >
                {country}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryFilter;