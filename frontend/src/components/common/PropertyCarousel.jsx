import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import PropertyCard from '../property/PropertyCard';
import EventCard from '../event/EventCard';
import './PropertyCarousel.css';

/**
 * Horizontal scrolling carousel for properties or events.
 * items: array of property or event objects
 * type: 'property' | 'event'
 */
const PropertyCarousel = ({ title, items = [], type = 'property', viewAllLink }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -clientWidth * 0.85 : clientWidth * 0.85,
      behavior: 'smooth',
    });
  };

  if (items.length === 0) return null;

  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <h2 className="carousel-title">
          {title}
          {viewAllLink && (
            <Link to={viewAllLink} className="carousel-title-arrow" aria-label="View all">
              <FiArrowRight />
            </Link>
          )}
        </h2>
        <div className="carousel-nav">
          <button onClick={() => scroll('left')} aria-label="Scroll left"><FiChevronLeft /></button>
          <button onClick={() => scroll('right')} aria-label="Scroll right"><FiChevronRight /></button>
        </div>
      </div>

      <div className="carousel-track" ref={scrollRef}>
        {items.map((item) => (
          <div className="carousel-item" key={item._id}>
            {type === 'property' ? <PropertyCard property={item} /> : <EventCard event={item} />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyCarousel;