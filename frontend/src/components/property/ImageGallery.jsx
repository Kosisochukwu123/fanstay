import { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './ImageGallery.css';

const ImageGallery = ({ images = [], title }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const imgs = images.length > 0 ? images : [{ url: 'https://placehold.co/1200x800?text=FanStay' }];

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const next = () => setLightboxIndex((i) => (i + 1) % imgs.length);
  const prev = () => setLightboxIndex((i) => (i - 1 + imgs.length) % imgs.length);

  return (
    <>
      <div className="gallery-grid">
        <div className="gallery-main" onClick={() => openLightbox(0)}>
          <img src={imgs[0].url} alt={title} loading="lazy" />
        </div>
        <div className="gallery-thumbs">
          {imgs.slice(1, 5).map((img, i) => (
            <div key={i} className="gallery-thumb" onClick={() => openLightbox(i + 1)}>
              <img src={img.url} alt={`${title} ${i + 2}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close"><FiX /></button>
          <button className="lightbox-nav left" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">
            <FiChevronLeft />
          </button>
          <img src={imgs[lightboxIndex].url} alt={title} onClick={(e) => e.stopPropagation()} />
          <button className="lightbox-nav right" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">
            <FiChevronRight />
          </button>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
