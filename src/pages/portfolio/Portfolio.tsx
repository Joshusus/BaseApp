import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import styles from './Portfolio.module.css';
import NavHeader from '~/components/navHeader/NavHeader';
import PageContent from '~/components/pageContent/PageContent';

export default function Portfolio() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  document.title = t('Portfolio.Title');

  return (
    <PageContent pageTitle={t('Portfolio.Title')}>
      <NavHeader />
      <div className={styles.gallery}>
        {Array.from({ length: 20 }, (_, x) => (
          <img
            src='./photos/ProfilePic.png'
            alt={t('Common.ProfilePic')}
            className={styles.profilePic}
            key={`${x}`}
          />
        ))}
      </div>
      {/* <PortfolioImage publicId='cld-sample-3' className={styles.testImage} /> */}
    </PageContent>
  );
}

