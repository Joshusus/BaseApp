import PageContent from '~/components/pageContent/PageContent';
import { useTranslation } from 'react-i18next';
import Button from '~/components/button/Button';
import { useNavigate } from 'react-router';
import PortfolioImage from '~/integrations/components/PortfolioImage';
import styles from './Home.module.css';

export default function Home() {
  document.title = 'Homepage';
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PageContent pageTitle={t('Home.Title')}>
      <PortfolioImage publicId='cld-sample-3' className={styles.testImage} />

      <Button onClick={() => navigate('/about')}>About</Button>
    </PageContent>
  );
}

