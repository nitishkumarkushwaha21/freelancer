export const siteConfig = {
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'hello@builtbywho.com',
  whatsappMessage:
    'Hi BuiltByWho! I need a website built. Here is a quick brief about my project:',
};

export function getWhatsAppUrl(message = siteConfig.whatsappMessage) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getMailtoUrl(subject = 'New project inquiry') {
  return `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}`;
}
