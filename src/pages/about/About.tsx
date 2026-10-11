import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IconArrowUpRight } from '@tabler/icons-react';
import NavHeader from '~/components/navHeader/NavHeader';
import PageContent from '~/components/pageContent/PageContent';
import { siteConfig } from '~/config/SiteConfig';
import styles from './About.module.css';

export default function About() {
  const { t } = useTranslation();
  return (
    <PageContent pageTitle={t('About.Title')}>
      <NavHeader />
      <main id="main-content" className={styles.section}>
        <div className={styles.pageIntro}>
          <p className={styles.eyebrow}>{t('About.Eyebrow')}</p>
          <h1>{t('About.Heading')}</h1>
        </div>
        <div className={styles.layout}>
          <img
            src={siteConfig.profilePhotoUrl}
            alt={t('Common.ProfileAlt', { name: t(siteConfig.name) })}
            className={styles.portrait}
            loading="lazy"
          />
          <div>
            <p className={styles.eyebrow}>{t(siteConfig.name)}</p>
            <h2>{t('About.StoryHeading')}</h2>
            <p>{t(siteConfig.about)}</p>
            <p>{t('About.StoryBody')}</p>
            <Link className={styles.primaryButton} to="/contact">
              {t('About.ProjectLink')} <IconArrowUpRight size={20} />
            </Link>
          </div>
        </div>
        <section className={styles.services} aria-label={t('About.ServicesLabel')}>
          {siteConfig.services.map((service, index) => (
            <div key={service}>
              <span>0{index + 1}</span>
              <h3>{t(service)}</h3>
            </div>
          ))}
        </section>
      </main>
    </PageContent>
  );
}
