import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import NavHeader from '~/components/navHeader/NavHeader';
import PageContent from '~/components/pageContent/PageContent';
export default function NotFound() {
  const { t } = useTranslation();
  return (
    <PageContent pageTitle={t('NotFound.Title')}>
      <NavHeader />
      <main id="main-content" className="section">
        <div className="page-intro">
          <p className="eyebrow">{t('NotFound.Eyebrow')}</p>
          <h1>{t('NotFound.Heading')}</h1>
          <p>{t('NotFound.Body')}</p>
        </div>
        <Link className="button button-primary" to="/portfolio">
          {t('Common.ExplorePortfolio')}
        </Link>
      </main>
    </PageContent>
  );
}
