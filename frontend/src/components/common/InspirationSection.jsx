import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InspirationSection.css';

const CATEGORY_DATA = {
  Popular: [
    { name: 'New York', tag: 'World Cup stays' },
    { name: 'Los Angeles', tag: 'World Cup stays' },
    { name: 'Mexico City', tag: 'World Cup stays' },
    { name: 'Miami', tag: 'Vacation rentals' },
    { name: 'Dallas', tag: 'Monthly rentals' },
    { name: 'Toronto', tag: 'Apartment rentals' },
  ],
  'Host cities': [
    { name: 'New York', tag: 'Stadium stays' },
    { name: 'Los Angeles', tag: 'Stadium stays' },
    { name: 'Atlanta', tag: 'Stadium stays' },
    { name: 'Houston', tag: 'Stadium stays' },
    { name: 'Boston', tag: 'Stadium stays' },
    { name: 'Seattle', tag: 'Stadium stays' },
  ],
  Beach: [
    { name: 'Miami Beach', tag: 'Beachfront rentals' },
    { name: 'San Diego', tag: 'Beach houses' },
    { name: 'Cancun', tag: 'Vacation rentals' },
    { name: 'Vancouver', tag: 'Waterfront stays' },
  ],
  Mountains: [
    { name: 'Denver', tag: 'Mountain cabins' },
    { name: 'Monterrey', tag: 'Vacation rentals' },
    { name: 'Guadalajara', tag: 'Apartment rentals' },
    { name: 'Vancouver', tag: 'Cabin rentals' },
  ],
};

const TABS_DEFAULT = Object.keys(CATEGORY_DATA);

const InspirationSection = ({ categories }) => {
  const data = categories && categories.length > 0
    ? categories.reduce((acc, cat) => {
        acc[cat.label] = cat.destinations;
        return acc;
      }, {})
    : CATEGORY_DATA;

  const tabs = Object.keys(data);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const navigate = useNavigate();

  return (
    <section className="inspiration-section">
      <h2>Inspiration for future getaways</h2>

      <div className="inspiration-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`inspiration-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="inspiration-grid">
        {(data[activeTab] || []).map((dest) => (
          <button
            key={dest.name}
            className="inspiration-item"
            onClick={() => navigate(`/explore?city=${encodeURIComponent(dest.name)}`)}
          >
            <strong>{dest.name}</strong>
            <span>{dest.tag}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default InspirationSection;