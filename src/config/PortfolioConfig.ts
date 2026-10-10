export type AlbumConfig = {
  id: string;
  /** Display fields and caption values are translation keys, resolved with t(). */
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
 * Example: { id: 'watersports', title: 'Portfolio.Albums.Watersports.Title',
 * category: 'Portfolio.Albums.Watersports.Category',
 * description: 'Portfolio.Albums.Watersports.Description', tag: 'watersports' }
 * Define those display keys in public/locales/en/translation.json.
 * Curated publicIds work without enabling Cloudinary's public Resource list.
 */
export const albums: AlbumConfig[] = [
  {
    id: 'preview',
    title: 'Portfolio.Albums.Album1.Title',
    category: 'Portfolio.Albums.Album1.Category',
    description: 'Portfolio.Albums.Album1.Description',
    publicIds: demoCloud ? ['cld-sample-3', 'samples/people/bicycle'] : ['Decaprio'],
    captions: demoCloud
      ? {
          'cld-sample-3': 'Portfolio.Albums.Album1.Captions.Basketball',
          'samples/people/bicycle': 'Portfolio.Albums.Album1.Captions.Bicycle',
        }
      : { Decaprio: 'Portfolio.Albums.Album1.Captions.DeliveryTest' },
  },
];
/** Set false when you replace the test collection with Marcus's photographs. */
export const isPreviewPortfolio = true;
export const previewNote = demoCloud ? 'Portfolio.Preview.Demo' : 'Portfolio.Preview.DeliveryTest';
export const featuredAlbumId = albums[0]?.id;
