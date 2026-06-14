import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyAPI } from '../api/propertyAPI';
import PropertyCard from '../components/property/PropertyCard';
import { PropertyCardSkeletonGrid } from '../components/common/Skeletons';
import SearchBar from '../components/common/SearchBar';
import './Explore.css';

const AMENITIES_OPTIONS = ['WiFi', 'Kitchen', 'Free Parking', 'Pool', 'Air Conditioning', 'Gym', 'Pet Friendly', 'TV', 'Hot Tub', 'Breakfast Included', 'Garden'];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Local filter state
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [amenities, setAmenities] = useState(
    searchParams.get('amenities') ? searchParams.get('amenities').split(',') : []
  );

  const fetchProperties = (pageNum = 1) => {
    setLoading(true);
    const params = {
      city: searchParams.get('city') || undefined,
      event: searchParams.get('event') || undefined,
      checkIn: searchParams.get('checkIn') || undefined,
      checkOut: searchParams.get('checkOut') || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      minRating: minRating || undefined,
      amenities: amenities.length > 0 ? amenities.join(',') : undefined,
      page: pageNum,
      limit: 12,
    };

    propertyAPI
      .getAll(params)
      .then((res) => {
        setProperties(res.data.properties);
        setTotal(res.data.total);
        setPages(res.data.pages);
        setPage(res.data.page);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProperties(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchProperties(1);
  };

  return (
    <div className="explore-page">
      <div className="container">
        <div className="explore-search-wrap">
          <SearchBar initialValues={Object.fromEntries(searchParams.entries())} />
        </div>

        <div className="explore-layout">
          <aside className="explore-filters">
            <h3>Filters</h3>
            <form onSubmit={applyFilters}>
              <div className="form-group">
                <label>Price range ($/night)</label>
                <div className="price-range-inputs">
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} min="0" />
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} min="0" />
                </div>
              </div>

              <div className="form-group">
                <label>Minimum rating</label>
                <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
                  <option value="">Any</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="4.5">4.5+</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amenities</label>
                <div className="amenities-checklist">
                  {AMENITIES_OPTIONS.map((a) => (
                    <label key={a} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={amenities.includes(a)}
                        onChange={() => toggleAmenity(a)}
                      />
                      {a}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block">Apply Filters</button>
            </form>
          </aside>

          <main className="explore-results">
            <div className="explore-results-header">
              <h2>{loading ? 'Searching...' : `${total} stays found`}</h2>
            </div>

            {loading ? (
              <PropertyCardSkeletonGrid count={9} />
            ) : properties.length === 0 ? (
              <p className="empty-text">No properties match your search. Try adjusting your filters.</p>
            ) : (
              <>
                <div className="properties-grid">
                  {properties.map((property) => <PropertyCard key={property._id} property={property} />)}
                </div>

                {pages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: pages }).map((_, i) => (
                      <button
                        key={i}
                        className={`pagination-btn ${page === i + 1 ? 'active' : ''}`}
                        onClick={() => fetchProperties(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Explore;
