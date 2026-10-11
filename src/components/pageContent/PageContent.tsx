import styles from './PageContent.module.css';
import { useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { siteConfig } from '~/config/SiteConfig';

export type IPageContent = { children: ReactNode; pageTitle?: string; description?: string };
export default function PageContent({ pageTitle, description, children }: IPageContent) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const displayName = t(siteConfig.name);
  const displayTitle = pageTitle || t('Common.SiteTitle');
  const displayDescription = description || t(siteConfig.introduction);
  useEffect(() => {
    document.title = `${displayTitle} | ${displayName}`;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = displayDescription;
  }, [displayTitle, displayName, displayDescription]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return (
    <div className={styles.sitePage}>
      <a className={styles.skipLink} href="#main-content">
        {t('Common.SkipContent')}
      </a>
      {children}
      <footer className={styles.footer}>
        <Link to="/" className={styles.footerBrand}>
          {t(siteConfig.name)}
          <span>{t('Common.PhotographyLabel')}</span>
        </Link>
        <p>{t('Footer.Tagline')}</p>
        <div>
          <Link to="/portfolio">{t('Footer.ViewWork')}</Link>
          <Link to="/contact">{t('Common.GetInTouch')}</Link>
          <a href={siteConfig.instagram} target="_blank" rel="noreferrer">
            {t('Common.Instagram')}
          </a>
        </div>
        <small>
          {t('Footer.Copyright', { year: new Date().getFullYear(), name: t(siteConfig.name) })}
        </small>
      </footer>
    </div>
  );
}
