import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import './SearchBar.css';

export const SearchBarCompact = ({ onClick }) => (
  <button className="search-pill-compact" onClick={onClick}>
    <FiSearch />
    Start your search
  </button>
);

const SearchBar = ({ initialValues = {} }) => {
  const navigate = useNavigate();
  const [city, setCity] = useState(initialValues.city || '');
  const [event, setEvent] = useState(initialValues.event || '');
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || '');
  const [guests, setGuests] = useState(initialValues.guests || '');
  const [activeField, setActiveField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (event) params.set('event', event);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/explore?${params.toString()}`);
  };

  const whenLabel = checkIn && checkOut
    ? `${new Date(checkIn).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${new Date(checkOut).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
    : 'Add dates';

  const whoLabel = guests ? `${guests} guest${guests > 1 ? 's' : ''}` : 'Add guests';

  return (
    <form className="search-pill" onSubmit={handleSubmit}>
      <div
        className={`search-pill-segment ${activeField === 'where' ? 'active' : ''}`}
        onClick={() => setActiveField('where')}
      >
        <span className="search-pill-label">Where</span>
        <input
          type="text"
          placeholder="Search destinations or events"
          value={city || event}
          onChange={(e) => {
            setCity(e.target.value);
            setEvent('');
          }}
          onFocus={() => setActiveField('where')}
        />
      </div>

      <div className="search-pill-divider" />

      <div
        className={`search-pill-segment ${activeField === 'checkin' ? 'active' : ''}`}
        onClick={() => setActiveField('checkin')}
      >
        <span className="search-pill-label">Check in</span>
        {activeField === 'checkin' ? (
          <input
            type="date"
            value={checkIn}
            autoFocus
            onChange={(e) => setCheckIn(e.target.value)}
            onBlur={() => setActiveField(null)}
          />
        ) : (
          <span className="search-pill-value">{checkIn ? new Date(checkIn).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Add dates'}</span>
        )}
      </div>

      <div className="search-pill-divider" />

      <div
        className={`search-pill-segment ${activeField === 'checkout' ? 'active' : ''}`}
        onClick={() => setActiveField('checkout')}
      >
        <span className="search-pill-label">Check out</span>
        {activeField === 'checkout' ? (
          <input
            type="date"
            value={checkOut}
            autoFocus
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            onBlur={() => setActiveField(null)}
          />
        ) : (
          <span className="search-pill-value">{checkOut ? new Date(checkOut).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Add dates'}</span>
        )}
      </div>

      <div className="search-pill-divider" />

      <div
        className={`search-pill-segment last ${activeField === 'who' ? 'active' : ''}`}
        onClick={() => setActiveField('who')}
      >
        <span className="search-pill-label">Who</span>
        {activeField === 'who' ? (
          <input
            type="number"
            min={1}
            placeholder="Add guests"
            value={guests}
            autoFocus
            onChange={(e) => setGuests(e.target.value)}
            onBlur={() => setActiveField(null)}
          />
        ) : (
          <span className="search-pill-value">{whoLabel}</span>
        )}
      </div>

      <button type="submit" className="search-pill-submit" aria-label="Search">
        <FiSearch />
        <span className="search-pill-submit-label">Search</span>
      </button>
    </form>
  );
};

export default SearchBar;