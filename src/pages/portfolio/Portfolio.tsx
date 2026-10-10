import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IconArrowUpRight } from '@tabler/icons-react';
import NavHeader from '~/components/navHeader/NavHeader';
import PageContent from '~/components/pageContent/PageContent';
import Carousel from '~/components/carousel/Carousel';
import PortfolioImage from '~/integrations/components/PortfolioImage';
import {
  albums,
  isPreviewPortfolio,
  previewNote,
  type AlbumConfig,
} from '~/config/PortfolioConfig';
import usePortfolio from './usePortfolio';
import styles from './Portfolio.module.css';

export default function Portfolio() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const focusedAlbum = albums.find((item) => item.id === params.get('album')) || albums[0];
  return (
    <PageContent pageTitle={t('Portfolio.Title')}>
      <NavHeader />
      <main id="main-content" className="section">
        <div className="page-intro">
          <p className="eyebrow">THE PORTFOLIO</p>
          <h1>Sport. In every frame.</h1>
          <p>A closer look at the action, the atmosphere and the people who make it happen.</p>
        </div>
        {isPreviewPortfolio && <p className="demo-note">{previewNote}</p>}
        <nav className={styles.albums} aria-label="Jump to a photo collection">
          {albums.map((item) => (
            <Link
              key={item.id}
              to={{ search: params.toString(), hash: `#album-${item.id}` }}
              preventScrollReset
              onClick={() =>
                requestAnimationFrame(() => {
                  const target = document.getElementById(`album-${item.id}`);
                  target?.scrollIntoView({ block: 'start', behavior: 'instant' });
                  target?.focus({ preventScroll: true });
                })
              }
            >
              {item.title} <span aria-hidden="true">↓</span>
            </Link>
          ))}
        </nav>
        <p className={styles.galleryHint}>
          Browse the collections below. Select a photograph to open the focused viewer.
        </p>
        {albums.length ? (
          albums.map((album) => (
            <AlbumGallery
              key={album.id}
              album={album}
              photo={focusedAlbum?.id === album.id ? params.get('photo') : null}
              changePhoto={(id) => {
                const next = new URLSearchParams(params);
                next.set('album', album.id);
                if (id) next.set('photo', id);
                else next.delete('photo');
                setParams(next, { preventScrollReset: true });
              }}
            />
          ))
        ) : (
          <p className="state-panel">New collections are coming soon.</p>
        )}
        <div className="cta">
          <div>
            <h2>See something you like?</h2>
            <p>Talk to Marcus about coverage, prints or image licensing.</p>
          </div>
          <Link className="button button-primary" to="/contact">
            Get in touch <IconArrowUpRight size={20} />
          </Link>
        </div>
      </main>
    </PageContent>
  );
}

function AlbumGallery({
  album,
  photo,
  changePhoto,
}: {
  album: AlbumConfig;
  photo: string | null;
  changePhoto: (id?: string) => void;
}) {
  const { images, status, error, retry } = usePortfolio(album);
  const [visible, setVisible] = useState(24);
  const selected = photo ? images.indexOf(photo) : -1;
  return (
    <section
      id={`album-${album.id}`}
      className={styles.albumSection}
      tabIndex={-1}
      aria-label={`${album.title} photographs`}
    >
      <div className={styles.albumHeading}>
        <div>
          <p className="eyebrow">{album.category}</p>
          <h2>{album.title}</h2>
          <p>{album.description}</p>
        </div>
        {status === 'ready' && (
          <span>
            {images.length} {images.length === 1 ? 'photograph' : 'photographs'}
          </span>
        )}
      </div>
      {status === 'loading' && (
        <div className={styles.skeleton} role="status" aria-label="Loading photographs">
          {[1, 2, 3].map((id) => (
            <div key={id} />
          ))}
        </div>
      )}
      {status === 'error' && (
        <div className="state-panel" role="alert">
          <p>{error}</p>
          <button className="button" onClick={retry}>
            Try again
          </button>
        </div>
      )}
      {status === 'ready' && images.length === 0 && (
        <p className="state-panel">
          This collection is waiting for its first photographs. Check back soon.
        </p>
      )}
      {status === 'ready' && photo && selected < 0 && (
        <p role="status" className="demo-note">
          That photograph is no longer in this collection. Explore the current photographs below.
        </p>
      )}
      <div className={styles.gallery}>
        {images.slice(0, visible).map((id, index) => (
          <button
            key={id}
            className={styles.image}
            onClick={() => changePhoto(id)}
            aria-label={`View ${album.captions?.[id] || `${album.title}, photograph ${index + 1}`}`}
          >
            <PortfolioImage
              publicId={id}
              alt={album.captions?.[id] || `${album.title} — photograph ${index + 1}`}
            />
            <span className={styles.viewFrame}>
              VIEW FRAME <IconArrowUpRight size={18} />
            </span>
          </button>
        ))}
      </div>
      {visible < images.length && (
        <div className={styles.loadMore}>
          <p>
            Showing {Math.min(visible, images.length)} of {images.length}
          </p>
          <button className="button" onClick={() => setVisible((count) => count + 24)}>
            Load more photographs
          </button>
        </div>
      )}
      {selected >= 0 && (
        <Carousel
          album={album}
          images={images}
          index={selected}
          onChange={(index) => changePhoto(images[index])}
          onClose={() => changePhoto()}
        />
      )}
    </section>
  );
}
