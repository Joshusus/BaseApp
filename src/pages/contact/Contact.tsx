import PageContent from '~/components/pageContent/PageContent';
import { useTranslation } from 'react-i18next';
import Button from '~/components/button/Button';
import { useNavigate } from 'react-router';
import PortfolioImage from '~/integrations/components/PortfolioImage';
import styles from './Contact.module.css';
import NavHeader from '~/components/navHeader/NavHeader';
import Panel from '~/components/panel/Panel';

export default function Contact() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  document.title = t('Contact.Title');

  return (
    <PageContent pageTitle={t('Contact.Title')}>
      <NavHeader />
      <h1>{t('Contacts.ContactForm')}</h1>
      <Panel className={styles.contactPanel}>
        <div className={styles.contactFormArea}></div>
        <Button onClick={() => console.log('bingus')}>
          {t('Contact.Send')}
        </Button>
      </Panel>
      <PortfolioImage publicId='cld-sample-3' className={styles.testImage} />

      <Button onClick={() => navigate('/about')}>About</Button>
    </PageContent>
  );
}

