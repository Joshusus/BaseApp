import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Parallax } from 'react-parallax/lib/index.js';
import PortfolioImage from '~/integrations/components/PortfolioImage';
import styles from './ParallaxPhoto.module.css';

type Props = {
  photo: {
    publicId: string;
    cloudName: string;
    alt: string;
    objectPosition: string;
    mobileObjectPosition?: string;
    parallax: { enabled: boolean; strength: number; travel: number };
  };
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  loading?: 'lazy' | 'eager';
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined'
      ? !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

/** Keep the original render-layer formula; overscan prevents blank edges while scrolling. */
export default function ParallaxPhoto({
  photo,
  children,
  className,
  contentClassName,
  loading = 'lazy',
}: Props) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window === 'undefined' ? photo.parallax.travel : window.innerHeight,
  );
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1024 : window.innerWidth,
  );
  useEffect(() => {
    const update = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const disabled = reduced || !photo.parallax.enabled;
  const travel = disabled
    ? 0
    : Math.min(Math.max(0, photo.parallax.travel), Math.max(0, viewportHeight));
  return (
    <Parallax
      blur={0}
      strength={disabled ? 0 : photo.parallax.strength}
      disabled={disabled}
      className={className}
      contentClassName={`${styles.content} ${contentClassName || ''}`}
      renderLayer={(percentage) => (
        <PortfolioImage
          publicId={photo.publicId}
          cloudName={photo.cloudName}
          alt={t(photo.alt)}
          loading={loading}
          fetchPriority={loading === 'eager' ? 'high' : 'auto'}
          imageWidth={1800}
          className={styles.photo}
          style={{
            top: disabled ? 0 : Math.max(-travel, Math.min(travel, (percentage - 1) * travel)),
            height: `calc(100% + ${travel}px)`,
            objectPosition:
              viewportWidth <= 650
                ? photo.mobileObjectPosition || photo.objectPosition
                : photo.objectPosition,
          }}
        />
      )}
    >
      {children}
    </Parallax>
  );
}
