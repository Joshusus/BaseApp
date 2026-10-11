import { useEffect, useRef, useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconX, IconLink, IconMail } from '@tabler/icons-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import PortfolioImage from '~/integrations/components/PortfolioImage';
import type { AlbumConfig } from '~/config/PortfolioConfig';
import styles from './Carousel.module.css';

type Props = {
  album: AlbumConfig;
  images: readonly string[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
};
export default function Carousel({ album, images, index, onChange, onClose }: Props) {
  const { t } = useTranslation();
  const dialog = useRef<HTMLDialogElement>(null);
  const pointerStart = useRef<number | null>(null);
  const [shareStatus, setShareStatus] = useState('');
  const previousOverflow = useRef('');
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const move = (step: number) => {
    setShareStatus('');
    onChange((index + step + images.length) % images.length);
  };
  const id = images[index];
  const caption = album.captions?.[id]
    ? t(album.captions[id])
    : t('Portfolio.FrameCaption', { title: t(album.title), number: index + 1 });

  useEffect(() => {
    const node = dialog.current!;
    const opener = document.activeElement as HTMLElement | null;
    node.showModal();
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow.current;
      opener?.focus();
    };
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus('Portfolio.Viewer.LinkCopied');
    } catch {
      setShareStatus('Portfolio.Viewer.CopyUnavailable');
    }
  };
  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="carousel-title"
      onCancel={(event) => {
        event.preventDefault();
        onCloseRef.current();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          move(-1);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          move(1);
        }
      }}
    >
      <div className={styles.content}>
        <header>
          <div>
            <p className={styles.eyebrow}>{t(album.category)}</p>
            <h2 id="carousel-title">{t(album.title)}</h2>
          </div>
          <button
            className={styles.iconButton}
            onClick={onClose}
            aria-label={t('Portfolio.Viewer.Close')}
            autoFocus
          >
            <IconX />
          </button>
        </header>
        <div
          className={styles.stage}
          onPointerDown={(event) => {
            if (event.pointerType === 'touch') pointerStart.current = event.clientX;
          }}
          onPointerUp={(event) => {
            if (
              pointerStart.current !== null &&
              Math.abs(event.clientX - pointerStart.current) > 50
            )
              move(event.clientX < pointerStart.current ? 1 : -1);
            pointerStart.current = null;
          }}
          onPointerCancel={() => {
            pointerStart.current = null;
          }}
        >
          <PortfolioImage key={id} publicId={id} alt={caption} loading="eager" imageWidth={1800} />
          {images.length > 1 && (
            <>
              <button
                className={styles.previous}
                onClick={() => move(-1)}
                aria-label={t('Portfolio.Viewer.Previous')}
              >
                <IconChevronLeft />
              </button>
              <button
                className={styles.next}
                onClick={() => move(1)}
                aria-label={t('Portfolio.Viewer.Next')}
              >
                <IconChevronRight />
              </button>
            </>
          )}
        </div>
        <div className={styles.details}>
          <div aria-live="polite">
            <p>{caption}</p>
            <small>
              {index + 1} / {images.length} ·{' '}
              {t(
                images.length > 1
                  ? 'Portfolio.Viewer.ExploreHint'
                  : 'Portfolio.Viewer.SelectedHint',
              )}
            </small>
          </div>
          <div className={styles.actions}>
            <button className={styles.button} onClick={copyLink}>
              <IconLink size={18} /> {t('Portfolio.Viewer.Share')}
            </button>
            <Link
              className={styles.button}
              to={`/contact?photo=${encodeURIComponent(id)}&album=${encodeURIComponent(t(album.title))}`}
            >
              <IconMail size={18} /> {t('Portfolio.Viewer.Enquire')}
            </Link>
          </div>
        </div>
        <p className={styles.status} role="status">
          {shareStatus && t(shareStatus)}
        </p>
      </div>
    </dialog>
  );
}
