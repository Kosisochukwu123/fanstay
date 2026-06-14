import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminAPI, settingsAPI } from '../../api';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { PageSkeleton } from '../../components/common/Skeletons';
import '../../styles/dashboard.css';
import '../../styles/forms.css';
import './AdminSiteSettings.css';

const TABS = ['Theme', 'Hero', 'Sections', 'Testimonials', 'Inspiration'];

const AdminSiteSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Theme');
  const { refresh } = useSiteSettings();

  const fetchSettings = () => {
    settingsAPI.get().then((res) => setSettings(res.data.settings)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading || !settings) return <div className="container"><PageSkeleton /></div>;

  return (
    <div className="container dashboard-page">
      <h1>Site Settings</h1>
      <p className="settings-intro">
        Customize FanStay's branding, homepage content, and layout. Changes apply across the site immediately.
      </p>

      <div className="dashboard-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Theme' && (
        <ThemeTab settings={settings} setSettings={setSettings} onSaved={refresh} />
      )}
      {activeTab === 'Hero' && (
        <HeroTab settings={settings} setSettings={setSettings} onSaved={refresh} />
      )}
      {activeTab === 'Sections' && (
        <SectionsTab settings={settings} setSettings={setSettings} onSaved={refresh} />
      )}
      {activeTab === 'Testimonials' && (
        <TestimonialsTab settings={settings} setSettings={setSettings} onSaved={refresh} />
      )}
      {activeTab === 'Inspiration' && (
        <InspirationTab settings={settings} setSettings={setSettings} onSaved={refresh} />
      )}
    </div>
  );
};

// ===================== THEME TAB =====================
const ThemeTab = ({ settings, setSettings, onSaved }) => {
  const [theme, setTheme] = useState(settings.theme);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => setTheme((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminAPI.updateTheme(theme);
      setSettings((prev) => ({ ...prev, theme: res.data.theme }));
      toast.success('Theme updated');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update theme');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset ALL site settings to defaults? This affects theme, hero, sections, testimonials, and inspiration content.')) return;
    try {
      const res = await adminAPI.resetSettings();
      setSettings(res.data.settings);
      setTheme(res.data.settings.theme);
      toast.success('Settings reset to defaults');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset settings');
    }
  };

  const colorFields = [
    { key: 'primaryColor', label: 'Primary color' },
    { key: 'primaryColorDark', label: 'Primary color (hover/dark)' },
    { key: 'secondaryColor', label: 'Secondary color' },
    { key: 'accentColor', label: 'Accent color' },
  ];

  return (
    <div className="settings-panel">
      <h2>Branding &amp; Theme</h2>

      <div className="form-group">
        <label>Logo / brand name</label>
        <input
          type="text"
          value={theme.logoText}
          onChange={(e) => handleChange('logoText', e.target.value)}
          placeholder="FanStay"
        />
      </div>

      <div className="color-fields-grid">
        {colorFields.map((f) => (
          <div className="form-group" key={f.key}>
            <label>{f.label}</label>
            <div className="color-input-row">
              <input
                type="color"
                value={theme[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
              />
              <input
                type="text"
                value={theme[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Base border radius</label>
        <input
          type="text"
          value={theme.borderRadiusBase}
          onChange={(e) => handleChange('borderRadiusBase', e.target.value)}
          placeholder="12px"
        />
      </div>

      <div className="form-group">
        <label>Font family (CSS value)</label>
        <input
          type="text"
          value={theme.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
        />
      </div>

      <div className="theme-preview" style={{
        '--preview-primary': theme.primaryColor,
        '--preview-secondary': theme.secondaryColor,
        '--preview-accent': theme.accentColor,
        '--preview-radius': theme.borderRadiusBase,
        fontFamily: theme.fontFamily,
      }}>
        <span className="theme-preview-logo">{theme.logoText}</span>
        <button className="theme-preview-btn primary">Primary Button</button>
        <button className="theme-preview-btn secondary">Secondary</button>
        <span className="theme-preview-badge">Badge / Accent</span>
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Theme'}
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>Reset All Settings</button>
      </div>
    </div>
  );
};

// ===================== HERO TAB =====================
const HeroTab = ({ settings, setSettings, onSaved }) => {
  const [hero, setHero] = useState(settings.hero);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('headline', hero.headline);
      formData.append('subheadline', hero.subheadline);
      if (imageFile) formData.append('backgroundImage', imageFile);

      const res = await adminAPI.updateHero(formData);
      setSettings((prev) => ({ ...prev, hero: res.data.hero }));
      setHero(res.data.hero);
      toast.success('Hero section updated');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update hero section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-panel">
      <h2>Homepage Hero</h2>

      <div className="form-group">
        <label>Headline</label>
        <input
          type="text"
          value={hero.headline}
          onChange={(e) => setHero({ ...hero, headline: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Subheadline</label>
        <textarea
          rows={2}
          value={hero.subheadline}
          onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Background image (optional)</label>
        {hero.backgroundImage && (
          <img src={hero.backgroundImage} alt="Hero background" className="hero-image-preview" />
        )}
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Hero Section'}
      </button>
    </div>
  );
};

// ===================== SECTIONS TAB =====================
const SectionsTab = ({ settings, setSettings, onSaved }) => {
  const [sections, setSections] = useState(settings.homepageSections);
  const [cityInput, setCityInput] = useState('');
  const [saving, setSaving] = useState(false);

  const toggles = [
    { key: 'showUpcomingEvents', label: 'Show "Upcoming Sporting Events" carousel' },
    { key: 'showPopularDestinations', label: 'Show "Popular Homes / Stay in..." city carousels' },
    { key: 'showFeatured', label: 'Show "Featured Accommodations" carousel' },
    { key: 'showInspiration', label: 'Show "Inspiration for future getaways"' },
    { key: 'showTestimonials', label: 'Show testimonials section' },
  ];

  const handleToggle = (key) => setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const addCity = () => {
    if (!cityInput.trim()) return;
    setSections((prev) => ({ ...prev, featuredCities: [...(prev.featuredCities || []), cityInput.trim()] }));
    setCityInput('');
  };

  const removeCity = (city) => {
    setSections((prev) => ({ ...prev, featuredCities: prev.featuredCities.filter((c) => c !== city) }));
  };

  const moveCity = (index, direction) => {
    setSections((prev) => {
      const cities = [...prev.featuredCities];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= cities.length) return prev;
      [cities[index], cities[newIndex]] = [cities[newIndex], cities[index]];
      return { ...prev, featuredCities: cities };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminAPI.updateHomepageSections(sections);
      setSettings((prev) => ({ ...prev, homepageSections: res.data.homepageSections }));
      toast.success('Homepage layout updated');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update homepage layout');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-panel">
      <h2>Homepage Sections</h2>

      <div className="toggle-list">
        {toggles.map((t) => (
          <label key={t.key} className="toggle-row">
            <input
              type="checkbox"
              checked={sections[t.key] !== false}
              onChange={() => handleToggle(t.key)}
            />
            {t.label}
          </label>
        ))}
      </div>

      <h3 style={{ marginTop: 24, marginBottom: 8 }}>Featured Cities (order shown on homepage)</h3>
      <p className="settings-hint">Cities listed here appear first, in this order. Leave empty to auto-order by rating.</p>

      <div className="city-input-row">
        <input
          type="text"
          placeholder="e.g. New York"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCity())}
        />
        <button type="button" className="btn btn-secondary" onClick={addCity}>Add</button>
      </div>

      {sections.featuredCities?.length > 0 && (
        <ul className="featured-city-list">
          {sections.featuredCities.map((city, i) => (
            <li key={city}>
              <span>{city}</span>
              <div className="action-buttons">
                <button type="button" className="btn btn-secondary" onClick={() => moveCity(i, -1)}>↑</button>
                <button type="button" className="btn btn-secondary" onClick={() => moveCity(i, 1)}>↓</button>
                <button type="button" className="btn btn-secondary" onClick={() => removeCity(city)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: 16 }}>
        {saving ? 'Saving...' : 'Save Homepage Layout'}
      </button>
    </div>
  );
};

// ===================== TESTIMONIALS TAB =====================
const TestimonialsTab = ({ settings, setSettings, onSaved }) => {
  const [testimonials, setTestimonials] = useState(
    settings.testimonials?.length > 0
      ? settings.testimonials
      : []
  );
  const [saving, setSaving] = useState(false);

  const addTestimonial = () => {
    setTestimonials((prev) => [...prev, { name: '', text: '', avatar: '' }]);
  };

  const updateTestimonial = (index, field, value) => {
    setTestimonials((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  };

  const removeTestimonial = (index) => {
    setTestimonials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminAPI.updateTestimonials(testimonials);
      setSettings((prev) => ({ ...prev, testimonials: res.data.testimonials }));
      toast.success('Testimonials updated');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update testimonials');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-panel">
      <h2>Testimonials</h2>
      <p className="settings-hint">Leave empty to use FanStay's default sample testimonials.</p>

      {testimonials.map((t, i) => (
        <div className="testimonial-editor-card" key={i}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={t.name}
                onChange={(e) => updateTestimonial(i, 'name', e.target.value)}
                placeholder="Guest name"
              />
            </div>
            <div className="form-group">
              <label>Avatar URL (optional)</label>
              <input
                type="text"
                value={t.avatar}
                onChange={(e) => updateTestimonial(i, 'avatar', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="form-group">
            <label>Testimonial text</label>
            <textarea
              rows={3}
              value={t.text}
              onChange={(e) => updateTestimonial(i, 'text', e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => removeTestimonial(i)}>Remove</button>
        </div>
      ))}

      <div className="action-buttons" style={{ marginTop: 16 }}>
        <button type="button" className="btn btn-secondary" onClick={addTestimonial}>+ Add Testimonial</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Testimonials'}
        </button>
      </div>
    </div>
  );
};

// ===================== INSPIRATION TAB =====================
const InspirationTab = ({ settings, setSettings, onSaved }) => {
  const [categories, setCategories] = useState(settings.inspirationCategories?.length > 0 ? settings.inspirationCategories : []);
  const [saving, setSaving] = useState(false);

  const addCategory = () => {
    setCategories((prev) => [...prev, { label: '', destinations: [] }]);
  };

  const updateCategoryLabel = (i, value) => {
    setCategories((prev) => prev.map((c, idx) => (idx === i ? { ...c, label: value } : c)));
  };

  const removeCategory = (i) => {
    setCategories((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addDestination = (catIndex) => {
    setCategories((prev) =>
      prev.map((c, idx) => (idx === catIndex ? { ...c, destinations: [...c.destinations, { name: '', tag: '' }] } : c))
    );
  };

  const updateDestination = (catIndex, destIndex, field, value) => {
    setCategories((prev) =>
      prev.map((c, idx) =>
        idx === catIndex
          ? { ...c, destinations: c.destinations.map((d, di) => (di === destIndex ? { ...d, [field]: value } : d)) }
          : c
      )
    );
  };

  const removeDestination = (catIndex, destIndex) => {
    setCategories((prev) =>
      prev.map((c, idx) => (idx === catIndex ? { ...c, destinations: c.destinations.filter((_, di) => di !== destIndex) } : c))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminAPI.updateInspiration(categories);
      setSettings((prev) => ({ ...prev, inspirationCategories: res.data.inspirationCategories }));
      toast.success('Inspiration content updated');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update inspiration content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-panel">
      <h2>Inspiration for Future Getaways</h2>
      <p className="settings-hint">Leave empty to use FanStay's default categories (Popular, Host cities, Beach, Mountains).</p>

      {categories.map((cat, ci) => (
        <div className="inspiration-editor-card" key={ci}>
          <div className="form-group">
            <label>Category label</label>
            <input
              type="text"
              value={cat.label}
              onChange={(e) => updateCategoryLabel(ci, e.target.value)}
              placeholder="e.g. Popular"
            />
          </div>

          <label className="settings-hint" style={{ display: 'block', marginBottom: 8 }}>Destinations</label>
          {cat.destinations.map((dest, di) => (
            <div className="form-row destination-row" key={di}>
              <input
                type="text"
                placeholder="City name"
                value={dest.name}
                onChange={(e) => updateDestination(ci, di, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Tag (e.g. World Cup stays)"
                value={dest.tag}
                onChange={(e) => updateDestination(ci, di, 'tag', e.target.value)}
              />
              <button type="button" className="btn btn-secondary" onClick={() => removeDestination(ci, di)}>Remove</button>
            </div>
          ))}
          <div className="action-buttons" style={{ marginTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={() => addDestination(ci)}>+ Add Destination</button>
            <button type="button" className="btn btn-secondary" onClick={() => removeCategory(ci)}>Remove Category</button>
          </div>
        </div>
      ))}

      <div className="action-buttons" style={{ marginTop: 16 }}>
        <button type="button" className="btn btn-secondary" onClick={addCategory}>+ Add Category</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Inspiration Content'}
        </button>
      </div>
    </div>
  );
};

export default AdminSiteSettings;