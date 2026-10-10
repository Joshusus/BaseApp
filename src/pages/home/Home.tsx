import { isLocalNavigation, scrollToSection } from '~/helpers/scrollToSection';
import { Link } from 'react-router';
import { IconArrowUpRight, IconArrowRight } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import PageContent from '~/components/pageContent/PageContent';
import NavHeader from '~/components/navHeader/NavHeader';
import PortfolioImage from '~/integrations/components/PortfolioImage';
import { albums, featuredAlbumId, isPreviewPortfolio, previewNote } from '~/config/PortfolioConfig';
import { siteConfig } from '~/config/SiteConfig';
import usePortfolio from '../portfolio/usePortfolio';
import styles from './Home.module.css';
import ParallaxPhoto from '~/components/parallaxPhoto/ParallaxPhoto';
import { heroPhoto, storyPhoto } from '~/config/PhotographyConfig';

export default function Home() {
  const { t } = useTranslation();
  const album = albums.find((item) => item.id === featuredAlbumId);
  const { images, status, error, retry } = usePortfolio(album);
  return (
    <PageContent pageTitle={t('Home.Title')}>
      <NavHeader />
      <main id="main-content">
        <ParallaxPhoto
          photo={heroPhoto}
          className={styles.hero}
          contentClassName={styles.heroLayout}
          loading="eager"
        >
          <div className={styles.heroContent}>
            <p className="eyebrow">
              {t(siteConfig.name)} / {t(siteConfig.role)}
            </p>
            <h1>{t(siteConfig.headline)}</h1>
            <p className={styles.intro}>{t(siteConfig.introduction)}</p>
            <Link className="button button-primary" to="/portfolio">
              {t('Common.ExplorePortfolio')} <IconArrowUpRight size={20} />
            </Link>
          </div>
          <div className={styles.heroFoot}>
            <span>{t(heroPhoto.isPreview ? 'Home.HeroPreview' : 'Home.HeroStatement')}</span>
            <a
              className={styles.scrollPrompt}
              href="#selected-work"
              onClick={(event) => {
                if (!isLocalNavigation(event)) return;
                event.preventDefault();
                scrollToSection('selected-work');
              }}
            >
              {t('Home.Scroll')}
            </a>
          </div>
        </ParallaxPhoto>
        <section id="selected-work" className="section" tabIndex={-1}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t('Home.SelectedWork')}</p>
              <h2>{t('Home.SelectedHeading')}</h2>
            </div>
            <Link
              className="text-link"
              to={`/portfolio?album=${encodeURIComponent(album?.id || '')}`}
            >
              {t('Home.ViewCollection')} <IconArrowRight size={18} />
            </Link>
          </div>
          {isPreviewPortfolio && <p className="demo-note">{t(previewNote)}</p>}
          {status === 'loading' && (
            <p role="status" className="state-panel">
              {t('Home.LoadingHighlights')}
            </p>
          )}
          {status === 'error' && (
            <div role="alert" className="state-panel">
              <p>{t(error || 'Portfolio.LoadError')}</p>
              <button className="button" onClick={retry}>
                {t('Common.TryAgain')}
              </button>
            </div>
          )}
          {status === 'ready' && images.length === 0 && (
            <p className="state-panel">{t('Home.EmptyHighlights')}</p>
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
                  alt={
                    album?.captions?.[id]
                      ? t(album.captions[id])
                      : t('Portfolio.FrameCaption', {
                          title: album ? t(album.title) : '',
                          number: index + 1,
                        })
                  }
                />
                <div>
                  <span>
                    0{index + 1} / {album && t(album.category)}
                  </span>
                  <h3>
                    {album && t(album.title)}
                    <IconArrowUpRight size={24} />
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <ParallaxPhoto
          photo={storyPhoto}
          className={styles.statementPhoto}
          contentClassName={styles.statement}
        >
          <p className="eyebrow">{t('Home.StoryEyebrow')}</p>
          <h2>
            {t('Home.StoryHeadingFirst')}
            <br />
            {t('Home.StoryHeadingSecond')}
          </h2>
          <div>
            <p>{t('Home.StoryBody')}</p>
            <Link className="text-link" to="/about">
              {t('Home.MeetMarcus')} <IconArrowRight size={18} />
            </Link>
          </div>
        </ParallaxPhoto>
        <section className="cta section">
          <div>
            <p className="eyebrow">{t('Home.CtaEyebrow')}</p>
            <h2>{t('Home.CtaHeading')}</h2>
            <p>{t('Home.CtaBody')}</p>
          </div>
          <Link className="button button-primary" to="/contact">
            {t('Common.StartConversation')} <IconArrowUpRight size={20} />
          </Link>
        </section>
      </main>
    </PageContent>
  );
}
