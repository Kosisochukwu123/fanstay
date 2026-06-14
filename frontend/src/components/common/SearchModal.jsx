import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiSearch, FiNavigation } from 'react-icons/fi';
import { FaLandmark, FaUmbrellaBeach, FaCity, FaWater, FaMonument } from 'react-icons/fa';
import { FiHome } from 'react-icons/fi';
import { GiSoccerBall } from 'react-icons/gi';
import { MdOutlineEventSeat } from 'react-icons/md';
import './SearchModal.css';

const SUB_TABS = [
  { key: 'stays', label: 'Homes', icon: <FiHome />, to: '/explore' },
  { key: 'events', label: 'Events', icon: <GiSoccerBall />, to: '/events' },
  { key: 'tickets', label: 'Match Tickets', icon: <MdOutlineEventSeat />, to: '/events' },
];

const SUGGESTED_DESTINATIONS = [
  { name: 'Nearby', sub: "Find what's around you", icon: <FiNavigation />, isNearby: true },
  { name: 'New York, USA', sub: 'Host city for the World Cup opener', icon: <FaCity /> },
  { name: 'Los Angeles, USA', sub: 'For sights like SoFi Stadium', icon: <FaLandmark /> },
  { name: 'Mexico City, Mexico', sub: 'For sights like Estadio Azteca', icon: <FaMonument /> },
  { name: 'Miami, USA', sub: 'Popular beach destination', icon: <FaUmbrellaBeach /> },
  { name: 'Toronto, Canada', sub: 'For its waterfront and skyline', icon: <FaWater /> },
];

/**
 * Full-screen search modal shown on mobile when "Start your search" is tapped.
 * Matches Airbnb's destination picker: tabs, Where input + suggestions, When/Who rows, Clear all / Search footer.
 */
const SearchModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState('stays');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');
  const [activeField, setActiveField] = useState('where'); // 'where' | 'when' | 'who'

  // Hide site navbar/bottom nav while this full-screen modal is open
  useEffect(() => {
    document.body.classList.add('search-modal-open');
    return () => document.body.classList.remove('search-modal-open');
  }, []);

  const handleSelectDestination = (name) => {
    if (name === 'Nearby') {
      setDestination('');
    } else {
      // Strip country for the city query param
      setDestination(name.split(',')[0]);
    }
    setActiveField('when');
  };

  const handleClearAll = () => {
    setDestination('');
    setCheckIn('');
    setCheckOut('');
    setGuests('');
    setActiveField('where');
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('city', destination);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);

    const sub = SUB_TABS.find((t) => t.key === activeSubTab);
    onClose();
    navigate(`${sub.to}?${params.toString()}`);
  };

  return (
    <div className="search-modal">
      {/* Top tabs: Homes / Experiences / Services + close */}
      <div className="search-modal-tabs">
        <div className="search-modal-tabs-inner">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`search-modal-tab ${activeSubTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveSubTab(tab.key)}
            >
              <span className="search-modal-tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <button className="search-modal-close" onClick={onClose} aria-label="Close search">
          <FiX />
        </button>
      </div>

      <div className="search-modal-body">
        {/* Where */}
        <div className={`search-modal-section ${activeField === 'where' ? 'expanded' : ''}`}>
          {activeField === 'where' ? (
            <>
              <h2>Where?</h2>
              <div className="search-modal-input-wrap">
                <FiSearch className="search-modal-input-icon" />
                <input
                  type="text"
                  placeholder="Search destinations"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  autoFocus
                />
              </div>

              <p className="search-modal-suggested-label">Suggested destinations</p>
              <div className="search-modal-suggestions">
                {SUGGESTED_DESTINATIONS.map((dest) => (
                  <button
                    key={dest.name}
                    className="search-modal-suggestion"
                    onClick={() => handleSelectDestination(dest.name)}
                  >
                    <span className="search-modal-suggestion-icon">{dest.icon}</span>
                    <span className="search-modal-suggestion-text">
                      <strong>{dest.name}</strong>
                      <span>{dest.sub}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <button className="search-modal-collapsed-row" onClick={() => setActiveField('where')}>
              <span className="search-modal-collapsed-label">Where</span>
              <span className="search-modal-collapsed-value">{destination || 'Add destination'}</span>
            </button>
          )}
        </div>

        {/* When */}
        <div className={`search-modal-section ${activeField === 'when' ? 'expanded' : ''}`}>
          {activeField === 'when' ? (
            <>
              <h2>When's your trip?</h2>
              <div className="search-modal-date-row">
                <div className="form-group">
                  <label>Check-in</label>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Check-out</label>
                  <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
              </div>
              <button className="search-modal-continue" onClick={() => setActiveField('who')}>Continue</button>
            </>
          ) : (
            <button className="search-modal-collapsed-row" onClick={() => setActiveField('when')}>
              <span className="search-modal-collapsed-label">When</span>
              <span className="search-modal-collapsed-value">
                {checkIn && checkOut
                  ? `${new Date(checkIn).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${new Date(checkOut).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                  : 'Add dates'}
              </span>
            </button>
          )}
        </div>

        {/* Who */}
        <div className={`search-modal-section ${activeField === 'who' ? 'expanded' : ''}`}>
          {activeField === 'who' ? (
            <>
              <h2>Who's coming?</h2>
              <div className="form-group">
                <label>Guests</label>
                <input
                  type="number"
                  min={1}
                  placeholder="Add guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>
            </>
          ) : (
            <button className="search-modal-collapsed-row" onClick={() => setActiveField('who')}>
              <span className="search-modal-collapsed-label">Who</span>
              <span className="search-modal-collapsed-value">
                {guests ? `${guests} guest${guests > 1 ? 's' : ''}` : 'Add guests'}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="search-modal-footer">
        <button className="search-modal-clear" onClick={handleClearAll}>Clear all</button>
        <button className="search-modal-search-btn" onClick={handleSearch}>
          <FiSearch /> Search
        </button>
      </div>
    </div>
  );
};

export default SearchModal;