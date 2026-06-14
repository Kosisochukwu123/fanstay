import { useEffect, useState } from "react";
import { propertyAPI } from "../api/propertyAPI";
import { eventAPI } from "../api/eventAPI";
import HeroSearch from "../components/common/HeroSearch";
import PropertyCarousel from "../components/common/PropertyCarousel";
import InspirationSection from "../components/common/InspirationSection";
import { PropertyCardSkeletonGrid } from "../components/common/Skeletons";
import TicketsTab from '../components/tabs/TicketTabs';
import EventsTab from "../components/tabs/EventTabs";
import { useSiteSettings } from "../context/SiteSettingsContext";
import "./Home.css";

const DEFAULT_TESTIMONIALS = [
  {
    name: "Marcus T.",
    text: "Booked a place 5 minutes from the stadium and paid with crypto in minutes. Smooth experience from start to finish.",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Sofia R.",
    text: "FanStay made our World Cup trip so much easier. We found a great host who knew all the local tips.",
    avatar: "https://i.pravatar.cc/100?img=32",
  },
  {
    name: "Daniel K.",
    text: "Used a gift card to pay for our stay — the approval process was quick and the place was exactly as described.",
    avatar: "https://i.pravatar.cc/100?img=45",
  },
];

const Home = () => {
  const [propertiesByCity, setPropertiesByCity] = useState({});
  const [events, setEvents] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stays");
  const { settings } = useSiteSettings();

  useEffect(() => {
    Promise.all([
      propertyAPI.getAll({ limit: 24, sort: "-rating.average" }),
      eventAPI.getAll({ upcoming: true, limit: 8 }),
    ])
      .then(([propRes, eventRes]) => {
        const all = propRes.data.properties;
        setFeatured(all.slice(0, 8));

        // Group properties by city for "Popular destinations" style rows
        const grouped = {};
        all.forEach((p) => {
          const city = p.location?.city || "Other";
          if (!grouped[city]) grouped[city] = [];
          grouped[city].push(p);
        });
        setPropertiesByCity(grouped);

        setEvents(eventRes.data.events);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sections = settings?.homepageSections || {};
  const featuredCities = sections.featuredCities || [];

  // Order city rows: admin-featured cities first (in order), then the rest
  let cityRows = Object.entries(propertiesByCity);
  if (featuredCities.length > 0) {
    const featuredEntries = featuredCities
      .map((city) => [city, propertiesByCity[city]])
      .filter(([, props]) => props && props.length > 0);
    const remaining = cityRows.filter(
      ([city]) => !featuredCities.includes(city),
    );
    cityRows = [...featuredEntries, ...remaining];
  }
  cityRows = cityRows.slice(0, 6);

  const testimonials =
    settings?.testimonials?.length > 0
      ? settings.testimonials
      : DEFAULT_TESTIMONIALS;
  const showEvents = sections.showUpcomingEvents !== false;
  const showDestinations = sections.showPopularDestinations !== false;
  const showFeatured = sections.showFeatured !== false;
  const showInspiration = sections.showInspiration !== false;
  const showTestimonials = sections.showTestimonials !== false;

  return (
    <div className="home">
      {/* Hero - minimal, search-focused like Airbnb */}
      <section className="hero">
        <HeroSearch
          backgroundImage={settings?.hero?.backgroundImage}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </section>

      <div className="container">
    {loading ? (
  <div className="section">
    <PropertyCardSkeletonGrid count={8} />
  </div>
) : activeTab === "stays" ? (
  <>
    {showEvents && (
      <PropertyCarousel
        title="Upcoming sporting events"
        items={events}
        type="event"
        viewAllLink="/events"
      />
    )}

    {showDestinations &&
      cityRows.map(([city, props], i) => (
        <PropertyCarousel
          key={city}
          title={
            i === 0
              ? `Popular homes in ${city}`
              : `Stay in ${city}`
          }
          items={props}
          type="property"
          viewAllLink={`/explore?city=${encodeURIComponent(city)}`}
        />
      ))}

    {showFeatured && (
      <PropertyCarousel
        title="Featured accommodations"
        items={featured}
        type="property"
        viewAllLink="/explore"
      />
    )}

    {showInspiration && (
      <InspirationSection
        categories={settings?.inspirationCategories}
      />
    )}
  </>
) : activeTab === "events" ? (
  <EventsTab events={events} />
) : activeTab === "tickets" ? (
  <TicketsTab events={events} />
) : null}

        {/* Testimonials - only on Stays tab */}
        {activeTab === "stays" && showTestimonials && (
          <section className="section">
            <h2 className="section-title">What our guests say</h2>
            <div className="testimonials-grid">
              {testimonials.map((tst, i) => (
                <div key={i} className="testimonial-card">
                  <img
                    src={
                      tst.avatar || `https://i.pravatar.cc/100?u=${tst.name}`
                    }
                    alt={tst.name}
                  />
                  <p>"{tst.text}"</p>
                  <h4>{tst.name}</h4>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
