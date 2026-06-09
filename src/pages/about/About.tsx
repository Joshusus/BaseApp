import { useTranslation } from 'react-i18next';
import KeyTextBlock from '~/components/keyTextBlock/KeyTextBlock';
import NavHeader from '~/components/navHeader/NavHeader';
import PageContent from '~/components/pageContent/PageContent';
import Panel from '~/components/panel/Panel';
import styles from './About.module.css';

export default function About() {
  document.title = 'About';
  const { t } = useTranslation();

  return (
    <PageContent>
      <NavHeader />
      <div className={styles.topColumns}>
        <Panel className={styles.textColumn}>
          <div>{t('About.ExampleDisclaimer')}</div>
          <KeyTextBlock>
            <p>{t('About.TitleTest', { name: 'Marcus' })}</p>
            <p>{t('About.ExampleDisclaimer')}</p>
          </KeyTextBlock>
          <i>{t('About.PanelTest1')}</i>
        </Panel>
        <img
          src='./photos/ProfilePic.png'
          alt={t('Common.ProfilePic')}
          className={styles.profilePic}
        />
      </div>
    </PageContent>
  );
}
