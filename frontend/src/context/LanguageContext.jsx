import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    home: 'Home',
    explore: 'Explore',
    events: 'Events',
    login: 'Log in',
    signup: 'Sign up',
    logout: 'Log out',
    search: 'Search',
    bookNow: 'Book Now',
    favorites: 'Favorites',
    dashboard: 'Dashboard',
    heroTitle: 'Find Your Stay Near the Action',
    heroSubtitle: 'Discover accommodations near major sporting events around the world',
    popularDestinations: 'Popular Destinations',
    upcomingEvents: 'Upcoming Sporting Events',
    featuredStays: 'Featured Accommodations',
    testimonials: 'What Our Guests Say',
  },
  es: {
    home: 'Inicio',
    explore: 'Explorar',
    events: 'Eventos',
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    logout: 'Cerrar sesión',
    search: 'Buscar',
    bookNow: 'Reservar',
    favorites: 'Favoritos',
    dashboard: 'Panel',
    heroTitle: 'Encuentra tu estancia cerca de la acción',
    heroSubtitle: 'Descubre alojamientos cerca de los grandes eventos deportivos del mundo',
    popularDestinations: 'Destinos Populares',
    upcomingEvents: 'Próximos Eventos Deportivos',
    featuredStays: 'Alojamientos Destacados',
    testimonials: 'Lo que dicen nuestros huéspedes',
  },
  fr: {
    home: 'Accueil',
    explore: 'Explorer',
    events: 'Événements',
    login: 'Connexion',
    signup: 'Inscription',
    logout: 'Déconnexion',
    search: 'Rechercher',
    bookNow: 'Réserver',
    favorites: 'Favoris',
    dashboard: 'Tableau de bord',
    heroTitle: "Trouvez votre séjour près de l'action",
    heroSubtitle: 'Découvrez des hébergements près des grands événements sportifs du monde',
    popularDestinations: 'Destinations Populaires',
    upcomingEvents: 'Événements Sportifs à Venir',
    featuredStays: 'Hébergements en Vedette',
    testimonials: 'Avis de nos voyageurs',
  },
};

const LanguageContext = createContext(null);

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('fanstay_lang') || 'en');

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('fanstay_lang', newLang);
  };

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t, available: Object.keys(translations) }}>
      {children}
    </LanguageContext.Provider>
  );
};
