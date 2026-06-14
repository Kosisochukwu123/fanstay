import { useState } from 'react';
import { FiMaximize2, FiLayers, FiX } from 'react-icons/fi';
import PropertyMap from './PropertyMap';
import './MiniMapPreview.css';

/**
 * Compact map preview shown inline in the property description.
 * Clicking expand opens a full-size map in a modal overlay.
 */
const MiniMapPreview = ({ lat, lng, label, city, country }) => {
  const [expanded, setExpanded] = useState(false);

  if (!lat || !lng) return null;

  return (
    <>
      <div className="mini-map-preview" onClick={() => setExpanded(true)}>
        <PropertyMap lat={lat} lng={lng} label={label} />
        <div className="mini-map-overlay-controls">
          <button className="mini-map-icon-btn" aria-label="Expand map" onClick={(e) => { e.stopPropagation(); setExpanded(true); }}>
            <FiMaximize2 />
          </button>
          <button className="mini-map-icon-btn" aria-label="Layers" onClick={(e) => e.stopPropagation()}>
            <FiLayers />
          </button>
        </div>
      </div>
      <p className="mini-map-location-note">
        Exact location provided after booking. General area: {city}, {country}.
      </p>

      {expanded && (
        <div className="mini-map-modal" onClick={() => setExpanded(false)}>
          <div className="mini-map-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="mini-map-modal-close" onClick={() => setExpanded(false)} aria-label="Close map">
              <FiX />
            </button>
            <PropertyMap lat={lat} lng={lng} label={label} />
          </div>
        </div>
      )}
    </>
  );
};

export default MiniMapPreview;