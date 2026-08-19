import { useSiteContent } from '../context/SiteContentContext';

export function getWhatsAppUrlFromSettings(settings, message) {
  const num = settings?.whatsappNumber || import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
  const defaultMessage =
    message || 'Hi BuiltByWho! I need a website built. Here is a quick brief about my project:';
  return `https://wa.me/${num}?text=${encodeURIComponent(defaultMessage)}`;
}

export function getMailtoUrlFromSettings(settings, subject = 'New project inquiry') {
  const email = settings?.contactEmail || import.meta.env.VITE_CONTACT_EMAIL || 'hello@builtbywho.com';
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

export function useSiteLinks() {
  const { settings } = useSiteContent();
  return {
    getWhatsAppUrl: (message) => getWhatsAppUrlFromSettings(settings, message),
    getMailtoUrl: (subject) => getMailtoUrlFromSettings(settings, subject),
    settings,
  };
}
