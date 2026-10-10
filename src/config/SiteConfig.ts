/** Public content only: VITE_ values are included in the browser bundle. */
export const siteConfig = {
  name: 'Marcus Amps-Woodward',
  role: 'Sports photographer',
  email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'marcus@example.com',
  profilePhotoUrl: import.meta.env.VITE_PROFILE_PHOTO_URL?.trim() || '/photos/MarcusProfile.jpg',
  instagram: 'https://www.instagram.com/marcusawphoto/',
  headline: 'Every second. Everything at stake.',
  introduction:
    'The intensity. The anticipation. The moment it all comes together. Sport, seen through Marcus’s lens.',
  about:
    'Marcus Amps-Woodward is a sports photographer with an eye for the action and the stories around it. Explore the portfolio, or get in touch to talk about your next event.',
  services: ['Event coverage', 'Athlete portraits', 'Team & club photography'],
  enquiryStarter:
    'Hi Marcus,\n\nI’d love to talk about photography for…\n\nEvent / sport:\nDate and location:\nWhat I’m looking for:\n\nThanks!',
};

export const isTestEmail = siteConfig.email.endsWith('@example.com');
