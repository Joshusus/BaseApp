import { IconBrandInstagram, IconMail, IconArrowUpRight } from '@tabler/icons-react';
import { NavLink, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { siteConfig } from '~/config/SiteConfig';
import styles from './NavHeader.module.css';

export default function NavHeader() {
  const { t } = useTranslation();
  return (
    <header className={styles.header}>
      <div className={styles.utility}>
        <span>SPORT. IN FOCUS.</span>
        <div>
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Marcus on Instagram"
          >
            <IconBrandInstagram size={18} />
          </a>
          <Link to="/contact" aria-label="Email Marcus">
            <IconMail size={18} />
          </Link>
        </div>
      </div>
      <nav className={styles.bar} aria-label="Main navigation">
        <Link to="/" className={styles.brand}>
          <span className={styles.monogram} aria-hidden="true">
            M<span>AW</span>
          </span>
          <span>
            {siteConfig.name}
            <small>SPORTS PHOTOGRAPHY</small>
          </span>
        </Link>
        <div className={styles.links}>
          {[
            ['/', 'Home.Title'],
            ['/portfolio', 'Portfolio.Title'],
            ['/about', 'About.Title'],
            ['/contact', 'Contact.Title'],
          ].map(([to, key]) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) => (isActive ? styles.active : styles.link)}
            >
              {t(key)}
            </NavLink>
          ))}
        </div>
        <Link className={styles.enquire} to="/contact">
          Let’s talk <IconArrowUpRight size={18} />
        </Link>
      </nav>
    </header>
  );
}
