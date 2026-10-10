export type AlbumConfig = {
  id: string;
  title: string;
  category: string;
  description: string;
  /** Public image tag, not a Cloudinary folder. Use tag OR publicIds. */
  tag?: string;
  publicIds?: string[];
  captions?: Record<string, string>;
};

export const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() || 'dx4aoiw5u';
const demoCloud = cloudName === 'demo';

/** Replace the preview with Marcus's collections when they are uploaded.
 * Example: { id: 'watersports', title: 'Watersports', category: 'Sport',
 * description: 'Speed, spray and the moments in between.', tag: 'watersports' }
 * Curated publicIds work without enabling Cloudinary's public Resource list.
 */
export const albums: AlbumConfig[] = [
  {
    id: 'preview',
    title: 'Preview collection',
    category: 'Test collection',
    description: 'A preview of the gallery experience. Marcus’s own photographs are coming soon.',
    publicIds: demoCloud ? ['cld-sample-3', 'samples/people/bicycle'] : ['Decaprio'],
    captions: demoCloud
      ? {
          'cld-sample-3': 'Basketball in action · demo photograph',
          'samples/people/bicycle': 'On two wheels · demo photograph',
        }
      : { Decaprio: 'Cloudinary delivery test · not Marcus’s portfolio work' },
  },
];
/** Set false when you replace the test collection with Marcus's photographs. */
export const isPreviewPortfolio = true;
export const previewNote = demoCloud
  ? 'Preview gallery · These are Cloudinary demo photographs, not Marcus’s work.'
  : 'Preview gallery · This test image verifies image delivery. Marcus’s sports photography is coming soon.';
export const featuredAlbumId = albums[0]?.id;
