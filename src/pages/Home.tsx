import PageContent from '~/components/pageContent/PageContent';
import { useTranslation } from 'react-i18next';
import Button from '~/components/button/Button';
import { useNavigate } from 'react-router';

export default function Home() {
  document.title = 'Homepage';
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PageContent pageTitle={t('Home.Title')}>
      <Button onClick={() => navigate('/about')}>About</Button>
    </PageContent>
  );
}

