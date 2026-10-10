import { Cloudinary } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { useCallback } from 'react';
import { cloudName } from '~/config/PortfolioConfig';

const clouds = new Map<string, Cloudinary>();

export default function useGetImages() {
  const getImage = useCallback((publicId: string, width = 900, sourceCloud = cloudName) => {
    let cloudinary = clouds.get(sourceCloud);
    if (!cloudinary) {
      cloudinary = new Cloudinary({ cloud: { cloudName: sourceCloud } });
      clouds.set(sourceCloud, cloudinary);
    }
    // Fresh mutable SDK instances prevent transformations leaking between consumers.
    // URL generation is local; the browser/CDN caches actual image requests.
    return cloudinary.image(publicId).resize(scale().width(width)).format('auto').quality('auto');
  }, []);
  return { getImage };
}
