import { isLocalNavigation, scrollToSection } from '~/helpers/scrollToSection';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { AlbumConfig } from '~/config/PortfolioConfig';
import styles from './Portfolio.module.css';

export default function AlbumNavigation({
  albums,
  search,
}: {
  albums: readonly AlbumConfig[];
  search: string;
}) {
  const { t } = useTranslation();
  const rail = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = rail.current;
    if (!node) return;
    let frame = 0;
    const links = Array.from(node.querySelectorAll<HTMLAnchorElement>('a'));
    const sections = albums.map((album) => document.getElementById(`album-${album.id}`));
    const headings = sections.map((section) =>
      section?.querySelector<HTMLElement>('[data-album-heading]'),
    );
    const update = () => {
      frame = 0;
      const gap = 8;
      const inset = 16;
      const available = Math.max(0, window.innerHeight - inset * 2);
      const heights = links.map((link) => link.offsetHeight);
      const total = heights.reduce((sum, height) => sum + height + gap, -gap);
      const crowded = total > available;
      let offset = 0;
      let previousBottom = 0;
      let current = -1;
      // Read all geometry before writing styles, avoiding forced layout between links.
      const headingTops = headings.map(
        (heading) => heading?.getBoundingClientRect().top ?? window.innerHeight,
      );
      headingTops.forEach((top, index) => {
        if (top <= window.innerHeight * 0.4) current = index;
      });
      node.dataset.crowded = String(crowded);
      links.forEach((link, index) => {
        const topStop = offset;
        const bottomStop = available - total + offset;
        const headerTop = headingTops[index] - inset;
        const top = crowded
          ? offset
          : Math.max(topStop, previousBottom, Math.min(bottomStop, headerTop));
        link.style.transform = `translateY(${top}px)`;
        if (index === current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
        previousBottom = top + heights[index] + gap;
        offset += heights[index] + gap;
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
    sections.forEach((section) => {
      if (section) observer?.observe(section);
    });
    links.forEach((link) => observer?.observe(link));
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [albums, t]);

  if (!albums.length) return null;
  return (
    <nav ref={rail} className={styles.albums} aria-label={t('Portfolio.CollectionNavigation')}>
      {albums.map((album, index) => (
        <Link
          key={album.id}
          to={{ search, hash: `#album-${album.id}` }}
          preventScrollReset
          onClick={(event) => {
            if (!isLocalNavigation(event)) return;
            requestAnimationFrame(() => scrollToSection(`album-${album.id}`));
          }}
        >
          <span className={styles.albumNumber} aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>{t(album.title)}</span>
          <span className={styles.albumArrow} aria-hidden="true">
            ↗
          </span>
        </Link>
      ))}
    </nav>
  );
}
