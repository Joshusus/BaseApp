import { useState } from 'react';
import Panel from '~/components/panel/Panel';
import styles from './About.module.css';
import Button from '~/components/button/Button';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Background, Parallax } from 'react-parallax';
import PageContent from '~/components/pageContent/PageContent';
import PortfolioImage from '~/integrations/components/PortfolioImage';

export default function About() {
  document.title = 'About';
  const [example, _setExample] = useState<string>('World');
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <PageContent pageTitle={t('About.TitleTest', { name: example })}>
      <div> {t('About.ExampleDisclaimer')}</div>

      <div className={styles.fullRow}>
        <PortfolioImage publicId='Goggins.webp' className={styles.profilePic} />
      </div>

      <div className={styles.fullRow}>
        <Parallax blur={0} strength={300} className={styles.profilePic}>
          <Background className={styles.customParallaxBg}>
            <PortfolioImage
              publicId='Goggins.webp'
              className={styles.profilePic}
            />
          </Background>
        </Parallax>
      </div>

      <div className={styles.fullRow}>
        <Parallax
          blur={0}
          bgImage='./photos/ProfilePic.png'
          bgImageAlt='the frog'
          strength={600}
          className={styles.profilePic}
        />
      </div>

      <div className={styles.largeRow}>
        <Panel>
          <Parallax
            blur={0}
            bgImage='./photos/ProfilePic.png'
            bgImageAlt='the frog'
            strength={250}
            className={styles.bigPanel}
          >
            {t('About.PanelTest1')}
            {t('About.PanelTest1')}
            {t('About.PanelTest1')}
          </Parallax>
        </Panel>
      </div>

      <div className={styles.tabsList}>
        <Panel>{t('About.PanelTest1')}</Panel>
        <Panel>{t('About.PanelTest2')}</Panel>
        <Panel>{t('About.PanelTest3')}</Panel>
      </div>

      <Panel>
        <div className={styles.compactTabsList}>
          <Panel>{t('About.PanelTest1')}</Panel>
          <Panel>{t('About.PanelTest2')}</Panel>
          <Panel>{t('About.PanelTest3')}</Panel>
        </div>
      </Panel>

      <Button onClick={() => navigate('/')}>Back</Button>
    </PageContent>
  );
}
