import { useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { siteConfig } from '~/config/SiteConfig';

export type IPageContent = { children: ReactNode; pageTitle?: string; description?: string };
export default function PageContent({ pageTitle, description, children }: IPageContent) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = `${pageTitle || 'Sports photography'} | ${siteConfig.name}`;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = description || siteConfig.introduction;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pageTitle, description, pathname]);
  return (
    <div className="site-page">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {children}
      <footer className="site-footer">
        <Link to="/" className="footer-brand">
          {siteConfig.name}
          <span>SPORTS PHOTOGRAPHY</span>
        </Link>
        <p>For the moments that matter.</p>
        <div>
          <Link to="/portfolio">View the work</Link>
          <Link to="/contact">Get in touch</Link>
          <a href={siteConfig.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
        <small>
          © {new Date().getFullYear()} {siteConfig.name}. Photographs remain the property of their
          respective owners.
        </small>
      </footer>
    </div>
  );
}
