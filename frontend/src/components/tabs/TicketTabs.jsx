// ExperiencesTab.jsx
import React from "react";
import "./ExperiencesTab.css";

const ExperiencesTab = ({ experiences }) => {
  // Rich content based on Airbnb's actual design patterns
  const defaultExperiences = [
    {
      id: 1,
      title: "Hidden Zurich Photo Walk with a Local Photographer",
      host: "Individual Host",
      price: "112",
      currency: "Fr.",
      priceSuffix: "/ guest",
      badge: "$5.0",
      category: "Photography",
      location: "Zurich",
      rating: "4.92",
      reviews: 47,
    },
    {
      id: 2,
      title: "Natural emotions photos by Anna",
      host: "Individual Host",
      price: "177",
      currency: "Fr.",
      priceSuffix: "/ group",
      category: "Photography",
      location: "Zurich",
      rating: "4.85",
      reviews: 32,
    },
    {
      id: 3,
      title: "Results-oriented fitness",
      host: "Individual Host",
      price: "49",
      currency: "Fr.",
      priceSuffix: "/ guest",
      minimum: "Minimum Fr. 85 to book",
      category: "Training",
      location: "London",
      rating: "4.78",
      reviews: 23,
    },
    {
      id: 4,
      title: "Private Restorative Yoga",
      host: "Individual Host",
      price: "49",
      currency: "Fr.",
      priceSuffix: "/ guest",
      minimum: "Minimum Fr. 85 to book",
      category: "Training",
      location: "London",
      rating: "4.91",
      reviews: 56,
    },
    {
      id: 5,
      title: "Your Stunning Photoshoot in Barcelona",
      host: "Business host",
      price: "24",
      currency: "Fr.",
      priceSuffix: "/ guest",
      minimum: "Minimum Fr. 109 to book",
      category: "Photography",
      location: "Barcelona",
      rating: "4.95",
      reviews: 128,
    },
    {
      id: 6,
      title: "Shine in Barcelona Streets",
      host: "Individual Host",
      price: "24",
      currency: "Fr.",
      priceSuffix: "/ guest",
      minimum: "Minimum Fr. 57 to book",
      category: "Photography",
      location: "Barcelona",
      rating: "4.87",
      reviews: 64,
    },
    {
      id: 7,
      title: "Street Art Discovery Tour",
      host: "Individual Host",
      price: "45",
      currency: "Fr.",
      priceSuffix: "/ guest",
      minimum: "Minimum Fr. 90 to book",
      category: "Art",
      location: "Rome",
      rating: "4.93",
      reviews: 89,
    },
    {
      id: 8,
      title: "Cooking Class with Local Chef",
      host: "Business host",
      price: "89",
      currency: "Fr.",
      priceSuffix: "/ guest",
      minimum: "Minimum Fr. 178 to book",
      category: "Food",
      location: "Rome",
      rating: "4.96",
      reviews: 156,
    },
    {
      id: 9,
      title: "Dubai Desert Safari Experience",
      host: "Individual Host",
      price: "145",
      currency: "Fr.",
      priceSuffix: "/ guest",
      minimum: "Minimum Fr. 290 to book",
      category: "Adventure",
      location: "Dubai",
      rating: "4.94",
      reviews: 213,
    },
    {
      id: 10,
      title: "New York Street Photography Tour",
      host: "Business host",
      price: "85",
      currency: "Fr.",
      priceSuffix: "/ guest",
      minimum: "Minimum Fr. 170 to book",
      category: "Photography",
      location: "New York",
      rating: "4.89",
      reviews: 47,
    },
  ];

  const displayExperiences = experiences && experiences.length > 0 ? experiences : defaultExperiences;

  // Group experiences by city
  const groupedByCity = displayExperiences.reduce((acc, exp) => {
    const city = exp.location || "Zurich";
    if (!acc[city]) acc[city] = [];
    acc[city].push(exp);
    return acc;
  }, {});

  // Get unique categories
  const categories = [...new Set(displayExperiences.map(exp => exp.category))].filter(Boolean);

  // Get unique cities for the section titles
  const cities = Object.keys(groupedByCity);

  return (
    <div className="experiences-tab">
      {/* Get the app banner - exactly as in Airbnb */}
      <div className="app-banner">
        <div className="banner-content">
          <span className="material-symbols-outlined banner-icon">app_shortcut</span>
          <div className="banner-text">
            <span className="banner-title">Get the app</span>
            <span className="banner-subtitle">The fastest, easiest way to Airbnb</span>
          </div>
          <button className="banner-btn">USE APP</button>
        </div>
      </div>

      {/* Services sections by city - Airbnb style */}
      <div className="services-container">
        {cities.map((city) => (
          <div key={city} className="city-section">
            <h3 className="city-title">Services in {city}</h3>
            
            {/* Category filter chips - like Airbnb */}
            <div className="category-chips">
              {categories.map(cat => (
                <button key={cat} className="chip-btn">
                  <span className="material-symbols-outlined chip-icon">
                    {cat === "Photography" && "photo_camera"}
                    {cat === "Training" && "fitness_center"}
                    {cat === "Art" && "palette"}
                    {cat === "Food" && "restaurant"}
                    {cat === "Adventure" && "hiking"}
                    {cat === "Hair" && "cut"}
                  </span>
                  {cat}
                </button>
              ))}
            </div>

            {/* Experience cards grid */}
            <div className="experiences-grid">
              {groupedByCity[city].map((exp) => (
                <div key={exp.id} className="experience-card">
                  {/* Image placeholder with icon */}
                  <div className="exp-image-container">
                    <div className="exp-image">
                      <span className="material-symbols-outlined exp-icon">
                        {exp.category === "Photography" && "photo_camera"}
                        {exp.category === "Training" && "fitness_center"}
                        {exp.category === "Art" && "palette"}
                        {exp.category === "Food" && "restaurant"}
                        {exp.category === "Adventure" && "hiking"}
                        {exp.category === "Hair" && "cut"}
                      </span>
                    </div>
                    {/* Rating badge */}
                    <div className="rating-badge">
                      <span className="material-symbols-outlined star-icon">star</span>
                      <span>{exp.rating}</span>
                      <span className="reviews-count">({exp.reviews})</span>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="exp-content">
                    <h4 className="exp-title">{exp.title}</h4>
                    <p className="exp-host">{exp.host}</p>
                    
                    <div className="exp-pricing">
                      <span className="price-from">From</span>
                      <span className="price-amount">{exp.currency} {exp.price}</span>
                      <span className="price-suffix">{exp.priceSuffix}</span>
                      {exp.badge && (
                        <span className="price-badge">
                          <span className="material-symbols-outlined badge-icon">attach_money</span>
                          {exp.badge}
                        </span>
                      )}
                    </div>

                    {exp.minimum && (
                      <p className="exp-minimum">{exp.minimum}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Discover more link - Airbnb style */}
      <div className="discover-section">
        <a href="/services" className="discover-link">
          Discover services on Airbnb
          <span className="material-symbols-outlined arrow-icon">arrow_forward</span>
        </a>
      </div>

      {/* Bottom navigation - Airbnb style */}
      <div className="bottom-nav">
        <div className="nav-item active">
          <span className="material-symbols-outlined">search</span>
          <span>Explore</span>
        </div>
        <div className="nav-item">
          <span className="material-symbols-outlined">favorite</span>
          <span>Wishlists</span>
        </div>
        <div className="nav-item">
          <span className="material-symbols-outlined">flight</span>
          <span>Trips</span>
        </div>
        <div className="nav-item">
          <span className="material-symbols-outlined">chat</span>
          <span>Messages</span>
        </div>
        <div className="nav-item">
          <span className="material-symbols-outlined">person</span>
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
};

export default ExperiencesTab;