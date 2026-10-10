import AlbumNavigation from './AlbumNavigation';
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
      <main id="main-content" className={`section ${albums.length ? styles.withAlbumRail : ''}`}>
        <div className="page-intro">
          <p className="eyebrow">{t('Portfolio.Eyebrow')}</p>
          <h1>{t('Portfolio.Heading')}</h1>
          <p>{t('Portfolio.Introduction')}</p>
        </div>
        {isPreviewPortfolio && <p className="demo-note">{t(previewNote)}</p>}
        <AlbumNavigation albums={albums} search={params.toString()} />
        <p className={styles.galleryHint}>{t('Portfolio.GalleryHint')}</p>
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
          <p className="state-panel">{t('Portfolio.EmptyCollections')}</p>
        )}
        <div className="cta">
          <div>
            <h2>{t('Portfolio.CtaHeading')}</h2>
            <p>{t('Portfolio.CtaBody')}</p>
          </div>
          <Link className="button button-primary" to="/contact">
            {t('Common.GetInTouch')} <IconArrowUpRight size={20} />
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
  const { t } = useTranslation();
  const { images, status, error, retry } = usePortfolio(album);
  const [visible, setVisible] = useState(24);
  const selected = photo ? images.indexOf(photo) : -1;
  return (
    <section
      id={`album-${album.id}`}
      className={styles.albumSection}
      tabIndex={-1}
      aria-label={t('Portfolio.GalleryLabel', { title: t(album.title) })}
    >
      <div className={styles.albumHeading} data-album-heading>
        <div>
          <p className="eyebrow">{t(album.category)}</p>
          <h2>{t(album.title)}</h2>
          <p>{t(album.description)}</p>
        </div>
        {status === 'ready' && <span>{t('Portfolio.PhotoCount', { count: images.length })}</span>}
      </div>
      {status === 'loading' && (
        <div className={styles.skeleton} role="status" aria-label={t('Portfolio.Loading')}>
          {[1, 2, 3].map((id) => (
            <div key={id} />
          ))}
        </div>
      )}
      {status === 'error' && (
        <div className="state-panel" role="alert">
          <p>{t(error || 'Portfolio.LoadError')}</p>
          <button className="button" onClick={retry}>
            {t('Common.TryAgain')}
          </button>
        </div>
      )}
      {status === 'ready' && images.length === 0 && (
        <p className="state-panel">{t('Portfolio.EmptyAlbum')}</p>
      )}
      {status === 'ready' && photo && selected < 0 && (
        <p role="status" className="demo-note">
          {t('Portfolio.MissingPhoto')}
        </p>
      )}
      <div className={styles.gallery}>
        {images.slice(0, visible).map((id, index) => (
          <button
            key={id}
            className={styles.image}
            onClick={() => changePhoto(id)}
            aria-label={
              album.captions?.[id]
                ? t('Portfolio.ViewCaption', { caption: t(album.captions[id]) })
                : t('Portfolio.ViewFrame', { title: t(album.title), number: index + 1 })
            }
          >
            <PortfolioImage
              publicId={id}
              alt={
                album.captions?.[id]
                  ? t(album.captions[id])
                  : t('Portfolio.FrameCaption', { title: t(album.title), number: index + 1 })
              }
            />
            <span className={styles.viewFrame}>
              {t('Portfolio.ViewFrameLabel')} <IconArrowUpRight size={18} />
            </span>
          </button>
        ))}
      </div>
      {visible < images.length && (
        <div className={styles.loadMore}>
          <p>
            {t('Portfolio.Showing', {
              visible: Math.min(visible, images.length),
              total: images.length,
            })}
          </p>
          <button className="button" onClick={() => setVisible((count) => count + 24)}>
            {t('Portfolio.LoadMore')}
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
