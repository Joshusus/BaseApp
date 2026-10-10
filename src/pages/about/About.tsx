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
      <main id="main-content" className="section">
        <div className="page-intro">
          <p className="eyebrow">BEHIND THE LENS</p>
          <h1>A feel for the moment.</h1>
        </div>
        <div className={styles.layout}>
          <img
            src={siteConfig.profilePhotoUrl}
            alt={`Portrait of ${siteConfig.name}`}
            className={styles.portrait}
            loading="lazy"
          />
          <div>
            <p className="eyebrow">{siteConfig.name}</p>
            <h2>More than the score.</h2>
            <p>{siteConfig.about}</p>
            <p>
              Every sport has a rhythm. The build-up, the burst of effort, the reaction afterwards.
              Those are the moments worth keeping.
            </p>
            <Link className="button button-primary" to="/contact">
              Talk about your project <IconArrowUpRight size={20} />
            </Link>
          </div>
        </div>
        <section className={styles.services} aria-label="Photography enquiries">
          {siteConfig.services.map((service, index) => (
            <div key={service}>
              <span>0{index + 1}</span>
              <h3>{service}</h3>
            </div>
          ))}
        </section>
      </main>
    </PageContent>
  );
}
