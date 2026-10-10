import { Link } from 'react-router';
import NavHeader from '~/components/navHeader/NavHeader';
import PageContent from '~/components/pageContent/PageContent';
export default function NotFound() {
  return (
    <PageContent pageTitle="Page not found">
      <NavHeader />
      <main id="main-content" className="section">
        <div className="page-intro">
          <p className="eyebrow">404 / OFF THE TRACK</p>
          <h1>Let’s get you back.</h1>
          <p>This page could not be found.</p>
        </div>
        <Link className="button button-primary" to="/portfolio">
          Explore the portfolio
        </Link>
      </main>
    </PageContent>
  );
}
