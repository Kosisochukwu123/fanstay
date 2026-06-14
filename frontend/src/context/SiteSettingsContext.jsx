import { createContext, useContext, useEffect, useState } from 'react';
import { settingsAPI } from '../api';

const SiteSettingsContext = createContext(null);

export const useSiteSettings = () => useContext(SiteSettingsContext);

const applyThemeVars = (theme) => {
  if (!theme) return;
  const root = document.documentElement;
  if (theme.primaryColor) root.style.setProperty('--color-primary', theme.primaryColor);
  if (theme.primaryColorDark) root.style.setProperty('--color-primary-dark', theme.primaryColorDark);
  if (theme.secondaryColor) root.style.setProperty('--color-secondary', theme.secondaryColor);
  if (theme.accentColor) root.style.setProperty('--color-accent', theme.accentColor);
  if (theme.fontFamily) root.style.setProperty('--font-base', theme.fontFamily);
  if (theme.borderRadiusBase) root.style.setProperty('--radius-md', theme.borderRadiusBase);
};

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await settingsAPI.get();
      setSettings(res.data.settings);
      applyThemeVars(res.data.settings.theme);
    } catch (err) {
      console.error('Failed to load site settings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};