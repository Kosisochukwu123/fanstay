import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
    <h1 style={{ fontSize: '3rem', marginBottom: 16 }}>404</h1>
    <p style={{ marginBottom: 24, color: 'var(--color-text-muted)' }}>Page not found.</p>
    <Link to="/" className="btn btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
