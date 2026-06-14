import { useEffect, useState } from 'react';
import { propertyAPI } from '../api/propertyAPI';
import PropertyCard from '../components/property/PropertyCard';
import { PropertyCardSkeletonGrid } from '../components/common/Skeletons';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyAPI
      .getFavorites()
      .then((res) => setFavorites(res.data.favorites))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ marginBottom: 24 }}>Your Favorites</h1>
      {loading ? (
        <PropertyCardSkeletonGrid count={4} />
      ) : favorites.length === 0 ? (
        <p className="empty-text">You haven't saved any favorites yet.</p>
      ) : (
        <div className="properties-grid">
          {favorites.map((p) => <PropertyCard key={p._id} property={p} isFavorite />)}
        </div>
      )}
    </div>
  );
};

export default Favorites;
