import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import en from '../public/locales/en/translation.json';
import { englishI18n } from './translationFixture';
import { siteConfig } from '../src/config/SiteConfig';
import { albums, previewNote } from '../src/config/PortfolioConfig';
import { heroPhoto, storyPhoto } from '../src/config/PhotographyConfig';
import Home from '../src/pages/home/Home';
import Portfolio from '../src/pages/portfolio/Portfolio';
import Contact from '../src/pages/contact/Contact';

vi.mock('react-parallax/lib/index.js', () => ({
  Parallax: ({
    renderLayer,
    children,
  }: {
    renderLayer: (percentage: number) => React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div>
      {renderLayer(0.5)}
      {children}
    </div>
  ),
}));
const fr = {
  Common: { NameTitle: 'Marcus FR', Role: 'Photographe', ProfileAlt: 'Portrait de {{name}}' },
  Home: { Headline: 'Chaque moment compte.', Introduction: 'Le sport en images.' },
  Navigation: { MainLabel: 'Navigation principale', Enquire: 'Discutons' },
  Portfolio: {
    GalleryLabel: 'Photographies : {{title}}',
    PhotoCount_one: '{{count}} photographie',
    PhotoCount_other: '{{count}} photographies',
    Viewer: { Enquire: 'Parlons de cette photo', Close: 'Fermer la photo' },
    Albums: {
      Album2: { Title: 'Sélection' },
      Album1: {
        Title: 'Sélection',
        Category: 'Essai',
        Description: 'Une collection de photographies.',
        Captions: {
          DeliveryTest: 'Photographie de test',
          Basketball: 'Basket en action',
          Bicycle: 'À vélo',
        },
      },
    },
  },
  Contact: {
    EnquiryStarter: 'Bonjour Marcus, parlons photographie.',
    Fields: { Message: 'Votre message' },
    CopyDraft: 'Copier le brouillon',
  },
};
async function makeI18n() {
  const instance = createInstance();
  await instance.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: { en: { translation: en }, fr: { translation: fr } },
    interpolation: { escapeValue: false },
  });
  return instance;
}
beforeEach(() => {
  window.scrollTo = vi.fn();
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.body.style.overflow = '';
  document.head.querySelector('meta[name="description"]')?.remove();
});

describe('config-backed translations', () => {
  it('scrolls beyond the hero and focuses the highlights, respecting reduced motion', async () => {
    const instance = await makeI18n();
    const motion = vi
      .fn()
      .mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });
    vi.stubGlobal('matchMedia', motion);
    render(
      <I18nextProvider i18n={instance}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </I18nextProvider>,
    );
    const target = document.getElementById('selected-work')!;
    target.scrollIntoView = vi.fn();
    const prompt = screen.getByRole('link', { name: en.Home.Scroll });
    fireEvent.click(prompt);
    expect(target.scrollIntoView).toHaveBeenLastCalledWith({ block: 'start', behavior: 'smooth' });
    expect(document.activeElement).toBe(target);
    motion.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    fireEvent.click(prompt);
    expect(target.scrollIntoView).toHaveBeenLastCalledWith({ block: 'start', behavior: 'instant' });
  });

  it('registers every configured display key, including caption and image alt keys', () => {
    const keys = [
      siteConfig.name,
      siteConfig.role,
      siteConfig.headline,
      siteConfig.introduction,
      siteConfig.about,
      siteConfig.enquiryStarter,
      ...siteConfig.services,
      previewNote,
      heroPhoto.alt,
      storyPhoto.alt,
      ...albums.flatMap((album) => [
        album.title,
        album.category,
        album.description,
        ...Object.values(album.captions || {}),
      ]),
    ];
    for (const key of keys) {
      expect(englishI18n.exists(key), key).toBe(true);
      expect(englishI18n.t(key), key).not.toBe(key);
    }
  });
  it('updates configured page copy, branding and metadata when language changes without resetting scroll', async () => {
    const instance = await makeI18n();
    const meta = document.createElement('meta');
    meta.name = 'description';
    document.head.append(meta);
    render(
      <I18nextProvider i18n={instance}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </I18nextProvider>,
    );
    expect(screen.getByRole('heading', { name: en.Home.Headline })).toBeTruthy();
    const scrollCalls = vi.mocked(window.scrollTo).mock.calls.length;
    await act(async () => {
      await instance.changeLanguage('fr');
    });
    expect(screen.getByRole('heading', { name: fr.Home.Headline })).toBeTruthy();
    expect(screen.getAllByText('Marcus FR').length).toBeGreaterThan(1);
    expect(document.title).toContain('Marcus FR');
    expect(screen.getByRole('navigation', { name: 'Navigation principale' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Discutons' })).toBeTruthy();
    expect(meta.content).toBe(fr.Home.Introduction);
    expect(vi.mocked(window.scrollTo).mock.calls).toHaveLength(scrollCalls);
  });
  it('translates the full gallery and carousel and puts the readable album title in the enquiry URL', async () => {
    const instance = await makeI18n();
    const album = albums[0];
    const id = Object.keys(album.captions || {})[0] || album.publicIds![0];
    render(
      <I18nextProvider i18n={instance}>
        <MemoryRouter
          initialEntries={[`/portfolio?album=${album.id}&photo=${encodeURIComponent(id)}`]}
        >
          <Portfolio />
        </MemoryRouter>
      </I18nextProvider>,
    );
    await screen.findByRole('dialog');
    await act(async () => {
      await instance.changeLanguage('fr');
    });
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'Sélection' })).toBeTruthy();
    expect(screen.getAllByRole('region', { name: 'Photographies : Sélection' })[0]).toBeTruthy();
    expect(within(dialog).getByRole('button', { name: 'Fermer la photo' })).toBeTruthy();
    expect(
      screen.getByText(instance.t('Portfolio.PhotoCount', { count: album.publicIds!.length })),
    ).toBeTruthy();
    const translatedCaption = instance.t(album.captions![id]);
    expect(within(dialog).getByText(translatedCaption)).toBeTruthy();
    expect(screen.getAllByAltText(translatedCaption).length).toBeGreaterThan(1);
    const link = within(dialog).getByRole('link', { name: 'Parlons de cette photo' });
    const query = new URL(link.getAttribute('href')!, 'https://example.com').searchParams;
    expect(query.get('album')).toBe('Sélection');
    expect(query.get('photo')).toBe(id);
  });
  it('starts an enquiry from translated copy and preserves a visitor’s edits across a language change', async () => {
    const instance = await makeI18n();
    render(
      <I18nextProvider i18n={instance}>
        <MemoryRouter>
          <Contact />
        </MemoryRouter>
      </I18nextProvider>,
    );
    const message = screen.getByLabelText('Your message') as HTMLTextAreaElement;
    expect(message.value).toBe(englishI18n.t(siteConfig.enquiryStarter));
    fireEvent.change(message, { target: { value: 'My own event details' } });
    await act(async () => {
      await instance.changeLanguage('fr');
    });
    expect(message.value).toBe('My own event details');
    expect(screen.getByLabelText('Votre message')).toBe(message);
    expect(screen.getByRole('button', { name: 'Copier le brouillon' })).toBeTruthy();
    expect(screen.getAllByText('Marcus FR').length).toBeGreaterThan(1);
  });
});
