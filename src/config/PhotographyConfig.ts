import { cloudName } from './PortfolioConfig';

const customHero = import.meta.env.VITE_CLOUDINARY_HERO_ID?.trim();
const heroCloud =
  import.meta.env.VITE_CLOUDINARY_HERO_CLOUD_NAME?.trim() || (customHero ? cloudName : 'demo');

/** Independent of the portfolio cloud: the original basketball example lives in demo. */
export const heroPhoto = {
  publicId: customHero || 'cld-sample-3',
  cloudName: heroCloud,
  alt: customHero ? 'Featured sports photograph' : 'Basketball in action · demo photograph',
  objectPosition: 'center 35%',
  mobileObjectPosition: '70% 35%',
  isPreview: heroCloud === 'demo',
  // Preserve the original container strength and custom render-layer travel.
  parallax: { enabled: true, strength: 300, travel: 700 },
};

/** One quieter photo layer behind the story section, with a smaller scroll distance. */
export const storyPhoto = {
  ...heroPhoto,
  parallax: { enabled: true, strength: 100, travel: 120 },
};
