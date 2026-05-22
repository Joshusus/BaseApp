import { useState } from 'react';
import Panel from '~/components/panel/Panel';
import styles from './About.module.css';
import Button from '~/components/button/Button';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import PageContent from '~/components/pageContent/PageContent';
import NavHeader from '~/components/navHeader/NavHeader';

export default function About() {
  document.title = 'About';
  const [example, _setExample] = useState<string>('World');
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <PageContent pageTitle={t('About.TitleTest', { name: example })}>
      <NavHeader />
      <div className={styles.topColumns}>
        <Panel className={styles.textColumn}>
          {t('About.ExampleDisclaimer')}
        </Panel>
        <img
          src='./photos/ProfilePic.png'
          alt={t('Common.ProfilePic')}
          className={styles.profilePic}
        />
      </div>

      <Button onClick={() => navigate('/')}>{t('Home.Title')}</Button>
    </PageContent>
  );
}
