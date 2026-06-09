import PageContent from '~/components/pageContent/PageContent';
import { useTranslation } from 'react-i18next';
import PortfolioImage from '~/integrations/components/PortfolioImage';
import styles from './Home.module.css';
import { Parallax } from 'react-parallax';
import NavHeader from '~/components/navHeader/NavHeader';
import Panel from '~/components/panel/Panel';
import Button from '~/components/button/Button';
import { useNavigate } from 'react-router';

export default function Home() {
  document.title = 'Homepage';
  const { t } = useTranslation();
  const navigate = useNavigate();

  const calculateParallax = (strength: number, scrollPercentage: number) =>
    scrollPercentage * strength - strength;

  return (
    <PageContent pageTitle={t('Home.Title')}>
      <NavHeader />
      <Parallax
        blur={0}
        strength={300}
        className={styles.parallaxTop}
        renderLayer={(percentage) => (
          <PortfolioImage
            publicId='cld-sample-3'
            style={{
              position: 'absolute',
              background: `rgba(255, 125, 0, ${percentage * 1})`,
              top: calculateParallax(700, percentage),
            }}
            className={styles.imageBlend}
          />
        )}
      >
        <div className={styles.titleOverImage}>
          <div>{t('Home.Name')}</div>
          <div>{t('Home.Job')}</div>
        </div>
      </Parallax>
      <Button
        className={styles.sectionHeader}
        onClick={() => navigate('/portfolio')}
      >
        {t('Home.Highlights')}
      </Button>
      <Panel>
        <div className={styles.portfolioOptions}>
          <PortfolioImage
            publicId='samples/balloons'
            className={styles.portfolioImage}
          />
          <PortfolioImage
            publicId='samples/ecommerce/car-interior-design'
            className={styles.portfolioImage}
          />
          <PortfolioImage
            publicId='samples/people/bicycle'
            className={styles.portfolioImage}
          />
        </div>
      </Panel>
      <div className={styles.bottomPadding} />
    </PageContent>
  );
}

