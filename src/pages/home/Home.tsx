import { Link } from 'react-router';
import { IconArrowUpRight, IconArrowRight } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageContent from '~/components/pageContent/PageContent';
import NavHeader from '~/components/navHeader/NavHeader';
import PortfolioImage from '~/integrations/components/PortfolioImage';
import {
  albums,
  featuredAlbumId,
  heroPublicId,
  isPreviewPortfolio,
  previewNote,
} from '~/config/PortfolioConfig';
import { siteConfig } from '~/config/SiteConfig';
import usePortfolio from '../portfolio/usePortfolio';
import styles from './Home.module.css';

export default function Home() {
  const { t } = useTranslation();
  const album = albums.find((item) => item.id === featuredAlbumId);
  const { images, status, error, retry } = usePortfolio(album);
  return (
    <PageContent pageTitle={t('Home.Title')}>
      <NavHeader />
      <main id="main-content">
        <section className={styles.hero}>
          {heroPublicId && (
            <PortfolioImage
              publicId={heroPublicId}
              alt={
                isPreviewPortfolio
                  ? 'Cloudinary image delivery preview'
                  : 'Featured sports photograph'
              }
              loading="eager"
              fetchPriority="high"
              imageWidth={1800}
              className={styles.heroImage}
            />
          )}
          <div className={styles.heroContent}>
            <p className="eyebrow">
              {siteConfig.name} / {siteConfig.role}
            </p>
            <h1>{siteConfig.headline}</h1>
            <p className={styles.intro}>{siteConfig.introduction}</p>
            <Link className="button button-primary" to="/portfolio">
              Explore the portfolio <IconArrowUpRight size={20} />
            </Link>
          </div>
          <div className={styles.heroFoot}>
            <span>THE ACTION. THE ATMOSPHERE. THE STORY.</span>
            <span>SCROLL TO EXPLORE ↓</span>
          </div>
        </section>
        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / SELECTED WORK</p>
              <h2>In the thick of it.</h2>
            </div>
            <Link
              className="text-link"
              to={`/portfolio?album=${encodeURIComponent(album?.id || '')}`}
            >
              View the collection <IconArrowRight size={18} />
            </Link>
          </div>
          {isPreviewPortfolio && <p className="demo-note">{previewNote}</p>}
          {status === 'loading' && (
            <p role="status" className="state-panel">
              Loading highlights…
            </p>
          )}
          {status === 'error' && (
            <div role="alert" className="state-panel">
              <p>{error}</p>
              <button className="button" onClick={retry}>
                Try again
              </button>
            </div>
          )}
          {status === 'ready' && images.length === 0 && (
            <p className="state-panel">New photographs are on their way. Come back soon.</p>
          )}
          <div className={styles.highlights}>
            {images.slice(0, 3).map((id, index) => (
              <Link
                key={id}
                to={`/portfolio?album=${encodeURIComponent(album?.id || '')}&photo=${encodeURIComponent(id)}`}
                className={styles.highlight}
              >
                <PortfolioImage
                  publicId={id}
                  alt={album?.captions?.[id] || `${album?.title} — photograph ${index + 1}`}
                />
                <div>
                  <span>
                    0{index + 1} / {album?.category}
                  </span>
                  <h3>
                    {album?.title}
                    <IconArrowUpRight size={24} />
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className={styles.statement}>
          <p className="eyebrow">BEYOND THE FINISH LINE</p>
          <h2>
            Great sport deserves
            <br />a great story.
          </h2>
          <div>
            <p>
              From the first whistle to the final push. Photography for athletes, clubs and events,
              with the energy of the day at its heart.
            </p>
            <Link className="text-link" to="/about">
              Meet Marcus <IconArrowRight size={18} />
            </Link>
          </div>
        </section>
        <section className="cta section">
          <div>
            <p className="eyebrow">YOUR NEXT CHAPTER</p>
            <h2>Let’s capture it.</h2>
            <p>Have an event, a team or an idea in mind?</p>
          </div>
          <Link className="button button-primary" to="/contact">
            Start a conversation <IconArrowUpRight size={20} />
          </Link>
        </section>
      </main>
    </PageContent>
  );
}
