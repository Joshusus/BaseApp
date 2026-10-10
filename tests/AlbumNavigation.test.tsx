import { cleanup, fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import AlbumNavigation from '../src/pages/portfolio/AlbumNavigation';

vi.mock('react-i18next', async () => {
  const { englishI18n } = await import('./translationFixture');
  return { useTranslation: () => ({ t: englishI18n.t.bind(englishI18n) }) };
});
const albums = ['Track', 'Water', 'Team'].map((title) => ({
  id: title,
  title,
  category: 'Sport',
  description: '',
}));
let headingTops = [1200, 2400, 3600];
beforeEach(() => {
  headingTops = [1200, 2400, 3600];
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    const index = Number(this.dataset.testHeading);
    return { top: this.hasAttribute('data-test-heading') ? headingTops[index] : 0 } as DOMRect;
  });
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(48);
  vi.stubGlobal('innerHeight', 800);
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function setup() {
  render(
    <MemoryRouter>
      <AlbumNavigation albums={albums} search="photo=test" />
      {albums.map((album, index) => (
        <section key={album.id} id={`album-${album.id}`} tabIndex={-1}>
          <div data-album-heading data-test-heading={index}>
            {album.title}
          </div>
        </section>
      ))}
    </MemoryRouter>,
  );
  return within(screen.getByRole('navigation')).getAllByRole('link');
}
it('keeps upcoming albums at the bottom, follows each heading, stacks in order and reverses on upward scrolling', async () => {
  const links = setup();
  await waitFor(() => expect(links[0].style.transform).toBe('translateY(608px)'));
  expect(links[2].style.transform).toBe('translateY(720px)');
  headingTops = [400, 1600, 2800];
  fireEvent.scroll(window);
  await waitFor(() => expect(links[0].style.transform).toBe('translateY(384px)'));
  expect(links[1].style.transform).toBe('translateY(664px)');
  headingTops = [-100, 300, 1500];
  fireEvent.scroll(window);
  await waitFor(() => expect(links[0].style.transform).toBe('translateY(0px)'));
  expect(links[1].style.transform).toBe('translateY(284px)');
  expect(links[1].getAttribute('aria-current')).toBe('location');
  headingTops = [-1500, -300, 20];
  fireEvent.scroll(window);
  await waitFor(() => expect(links[2].style.transform).toBe('translateY(112px)'));
  headingTops = [1200, 2400, 3600];
  fireEvent.scroll(window);
  await waitFor(() => expect(links[0].style.transform).toBe('translateY(608px)'));
  expect(links.every((link) => !link.hasAttribute('aria-current'))).toBe(true);
});
it('retains direct links, moves focus to the target and makes an oversized list scrollable', async () => {
  const links = setup();
  const target = document.getElementById('album-Water')!;
  target.scrollIntoView = vi.fn();
  expect(links[1].getAttribute('href')).toBe('/?photo=test#album-Water');
  fireEvent.click(links[1]);
  await waitFor(() =>
    expect(target.scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' }),
  );
  expect(document.activeElement).toBe(target);
  vi.stubGlobal('innerHeight', 150);
  fireEvent.resize(window);
  await waitFor(() => expect(screen.getByRole('navigation').dataset.crowded).toBe('true'));
  expect(links.map((link) => link.style.transform)).toEqual([
    'translateY(0px)',
    'translateY(56px)',
    'translateY(112px)',
  ]);
});
