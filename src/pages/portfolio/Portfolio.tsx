import { useTranslation } from 'react-i18next';
import styles from './Portfolio.module.css';
import NavHeader from '~/components/navHeader/NavHeader';
import PageContent from '~/components/pageContent/PageContent';

export default function Portfolio() {
  const { t } = useTranslation();
  document.title = t('Portfolio.Title');

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

  return (
    <PageContent pageTitle={t('Portfolio.Title')}>
      <NavHeader />
      <div className={styles.sectionHeaderTop}>{t('Portfolio.MostRecent')}</div>
      <div className={styles.gallery}>{exampleImages(8)}</div>
      <div className={styles.sectionHeader}>{t('Portfolio.Aquasports')}</div>
      <div className={styles.gallery}>{exampleImages(10)}</div>
    </PageContent>
  );
}

