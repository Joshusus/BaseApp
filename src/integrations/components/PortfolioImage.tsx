import { useTranslation } from 'react-i18next';
import { useState, type ComponentPropsWithoutRef } from 'react';
import useGetImages from '../cloudinary/hooks/useGetImages';

type Props = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & {
  publicId: string;
  alt: string;
  imageWidth?: number;
  cloudName?: string;
};
export default function PortfolioImage({
  publicId,
  alt,
  imageWidth = 900,
  cloudName,
  loading = 'lazy',
  ...props
}: Props) {
  const { t } = useTranslation();
  const { getImage } = useGetImages();
  const [failedSource, setFailedSource] = useState<string>();
  const source = JSON.stringify([cloudName, publicId]);
  if (failedSource === source)
    return (
      <span
        className={`image-fallback ${props.className || ''}`}
        style={props.style}
        role="img"
        aria-label={alt}
      >
        {t('Photography.Unavailable')}
      </span>
    );
  return (
    <img
      {...props}
      src={getImage(publicId, imageWidth, cloudName).toURL()}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailedSource(source)}
    />
  );
}
