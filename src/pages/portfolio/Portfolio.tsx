import { useTranslation } from 'react-i18next';
import NavHeader from '~/components/navHeader/NavHeader';
import PageContent from '~/components/pageContent/PageContent';
import PortfolioImage from '~/integrations/components/PortfolioImage';
import styles from './Portfolio.module.css';
import usePortfolio from './usePortfolio';

export default function Portfolio() {
  const { t } = useTranslation();
  document.title = t('Portfolio.Title');

  // const { getFolderImages } = useGetImages();
  const { testImageIds } = usePortfolio();

  const exampleImages = (images: number) => {
    return Array.from({ length: images }, (_, x) => (
      <div className={styles.imageContainer}>
        <img
          src='./photos/ProfilePic.png'
          alt={t('Common.ProfilePic')}
          className={styles.pfImage}
          key={`${x}`}
        />
      </div>
    ));
  };

  const testImages = () => {
    if (!testImageIds) return undefined;
    return Array.from({ length: testImageIds.length }, (_, x) =>
      newPortfolioImage(testImageIds[x]),
    );
  };

  const newPortfolioImage = (publicId: string) => (
    <div className={styles.imageContainer}>
      <PortfolioImage
        publicId={publicId}
        className={styles.pfImage}
        key={`${publicId}`}
      />
    </div>
  );

  return (
    <PageContent pageTitle={t('Portfolio.Title')}>
      <NavHeader />
      <div className={styles.sectionHeaderTop}>{t('Portfolio.MostRecent')}</div>
      <div className={styles.gallery}>{testImages()}</div>
      <div className={styles.sectionHeader}>{t('Portfolio.Aquasports')}</div>
      <div className={styles.gallery}>{exampleImages(10)}</div>
    </PageContent>
  );
}

