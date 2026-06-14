import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { propertyAPI } from '../../api/propertyAPI';
import { eventAPI } from '../../api/eventAPI';
import '../../styles/dashboard.css';
import '../../styles/forms.css';

const AMENITIES_OPTIONS = ['WiFi', 'Kitchen', 'Free Parking', 'Pool', 'Air Conditioning', 'Gym', 'Pet Friendly', 'TV', 'Hot Tub', 'Breakfast Included', 'Garden'];

const ListingForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    country: '',
    lat: '',
    lng: '',
    pricePerNight: '',
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    nearbyEvent: '',
    amenities: [],
  });
  const [events, setEvents] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    eventAPI.getAll({ limit: 50 }).then((res) => setEvents(res.data.events));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    propertyAPI.getOne(id).then((res) => {
      const p = res.data.property;
      setForm({
        title: p.title,
        description: p.description,
        address: p.location.address,
        city: p.location.city,
        country: p.location.country,
        lat: p.coordinates.lat,
        lng: p.coordinates.lng,
        pricePerNight: p.pricePerNight,
        maxGuests: p.maxGuests,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        nearbyEvent: p.nearbyEvent?._id || '',
        amenities: p.amenities || [],
      });
      setExistingImages(p.images || []);
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleDeleteExistingImage = async (publicId) => {
    try {
      const res = await propertyAPI.deleteImage(id, publicId);
      setExistingImages(res.data.property.images);
    } catch {
      toast.error('Failed to delete image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('location.address', form.address);
    formData.append('location.city', form.city);
    formData.append('location.country', form.country);
    formData.append('coordinates.lat', form.lat);
    formData.append('coordinates.lng', form.lng);
    formData.append('pricePerNight', form.pricePerNight);
    formData.append('maxGuests', form.maxGuests);
    formData.append('bedrooms', form.bedrooms);
    formData.append('bathrooms', form.bathrooms);
    if (form.nearbyEvent) formData.append('nearbyEvent', form.nearbyEvent);
    form.amenities.forEach((a) => formData.append('amenities', a));
    images.forEach((img) => formData.append('images', img));

    try {
      if (isEdit) {
        await propertyAPI.update(id, formData);
        toast.success('Listing updated');
      } else {
        await propertyAPI.create(formData);
        toast.success('Listing created');
      }
      navigate('/host/listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container dashboard-page">
      <h1>{isEdit ? 'Edit Listing' : 'Create New Listing'}</h1>

      <form className="listing-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" required value={form.title} onChange={handleChange} placeholder="Modern Loft Near MetLife Stadium" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" required rows={5} value={form.description} onChange={handleChange} placeholder="Describe your property..." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" required value={form.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" required value={form.city} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input type="text" name="country" required value={form.country} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Latitude</label>
            <input type="number" step="any" name="lat" required value={form.lat} onChange={handleChange} placeholder="e.g. 40.8136" />
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input type="number" step="any" name="lng" required value={form.lng} onChange={handleChange} placeholder="e.g. -74.0744" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price per night (USD)</label>
            <input type="number" min="0" name="pricePerNight" required value={form.pricePerNight} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Max guests</label>
            <input type="number" min="1" name="maxGuests" required value={form.maxGuests} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Bedrooms</label>
            <input type="number" min="0" name="bedrooms" required value={form.bedrooms} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Bathrooms</label>
            <input type="number" min="0" name="bathrooms" required value={form.bathrooms} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Nearby sporting event (optional)</label>
          <select name="nearbyEvent" value={form.nearbyEvent} onChange={handleChange}>
            <option value="">None</option>
            {events.map((ev) => (
              <option key={ev._id} value={ev._id}>{ev.eventName} — {ev.city}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Amenities</label>
          <div className="amenities-checklist">
            {AMENITIES_OPTIONS.map((a) => (
              <label key={a} className="checkbox-label">
                <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                {a}
              </label>
            ))}
          </div>
        </div>

        {isEdit && existingImages.length > 0 && (
          <div className="form-group">
            <label>Existing images</label>
            <div className="existing-images-grid">
              {existingImages.map((img) => (
                <div key={img.publicId} className="existing-image-item">
                  <img src={img.url} alt="" />
                  <button type="button" onClick={() => handleDeleteExistingImage(img.publicId)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label>{isEdit ? 'Add more images' : 'Upload images'}</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default ListingForm;
