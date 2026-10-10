import { useState, type ComponentPropsWithoutRef } from 'react';
import useGetImages from '../cloudinary/hooks/useGetImages';

type Props = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & {
  publicId: string;
  alt: string;
  imageWidth?: number;
};
export default function PortfolioImage({
  publicId,
  alt,
  imageWidth = 900,
  loading = 'lazy',
  ...props
}: Props) {
  const { getImage } = useGetImages();
  const [failedId, setFailedId] = useState<string>();
  if (failedId === publicId)
    return (
      <span className="image-fallback" role="img" aria-label={alt}>
        Photograph unavailable
      </span>
    );
  return (
    <img
      {...props}
      src={getImage(publicId, imageWidth).toURL()}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailedId(publicId)}
    />
  );
}
