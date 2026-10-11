/** Display fields are i18next keys; connection values are public configuration. */
export const siteConfig = {
  name: 'Common.NameTitle',
  role: 'Common.Role',
  email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'marcus@example.com',
  profilePhotoUrl: import.meta.env.VITE_PROFILE_PHOTO_URL?.trim() || '/photos/Profile.jpg',
  instagram: 'https://www.instagram.com/marcusawphoto/',
  headline: 'Home.Headline',
  introduction: 'Home.Introduction',
  about: 'About.Bio',
  services: [
    'About.Services.EventCoverage',
    'About.Services.AthletePortraits',
    'About.Services.TeamPhotography',
  ],
  enquiryStarter: 'Contact.EnquiryStarter',
};

export const isTestEmail = siteConfig.email.endsWith('@example.com');
