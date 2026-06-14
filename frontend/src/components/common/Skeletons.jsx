import './Skeletons.css';

export const PropertyCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-image" />
    <div className="skeleton skeleton-line" style={{ width: '70%' }} />
    <div className="skeleton skeleton-line" style={{ width: '50%' }} />
    <div className="skeleton skeleton-line" style={{ width: '40%' }} />
  </div>
);

export const PropertyCardSkeletonGrid = ({ count = 8 }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }).map((_, i) => (
      <PropertyCardSkeleton key={i} />
    ))}
  </div>
);

export const EventCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-image" />
    <div className="skeleton skeleton-line" style={{ width: '80%' }} />
    <div className="skeleton skeleton-line" style={{ width: '50%' }} />
  </div>
);

export const TextSkeleton = ({ width = '100%', height = '16px' }) => (
  <div className="skeleton skeleton-line" style={{ width, height }} />
);

export const PageSkeleton = () => (
  <div className="page-skeleton">
    <div className="skeleton skeleton-banner" />
    <div className="skeleton skeleton-line" style={{ width: '60%', height: '32px' }} />
    <div className="skeleton skeleton-line" style={{ width: '40%' }} />
    <div className="skeleton skeleton-line" style={{ width: '90%' }} />
    <div className="skeleton skeleton-line" style={{ width: '85%' }} />
  </div>
);
