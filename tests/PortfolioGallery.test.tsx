import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Portfolio from '../src/pages/portfolio/Portfolio';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('../src/config/PortfolioConfig', () => ({
  cloudName: 'fixture-cloud',
  isPreviewPortfolio: false,
  previewNote: '',
  albums: [
    {
      id: 'race',
      title: 'Race day',
      category: 'Athletics',
      description: 'Track action',
      publicIds: Array.from({ length: 28 }, (_, index) => `frame-${index + 1}`),
    },
    {
      id: 'water',
      title: 'Watersports',
      category: 'Water',
      description: 'Water action',
      publicIds: ['frame-1', 'water-2'],
    },
  ],
}));
beforeEach(() => {
  window.scrollTo = vi.fn();
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
});
afterEach(cleanup);

describe('full portfolio galleries', () => {
  it('renders every collection together and loads additional frames without hiding the other albums', async () => {
    render(
      <MemoryRouter>
        <Portfolio />
      </MemoryRouter>,
    );
    const race = screen.getByRole('region', { name: 'Race day photographs' });
    const water = screen.getByRole('region', { name: 'Watersports photographs' });
    await within(race).findByRole('button', { name: 'View Race day, photograph 1' });
    expect(within(race).getAllByRole('button', { name: /^View / })).toHaveLength(24);
    expect(within(water).getAllByRole('button', { name: /^View / })).toHaveLength(2);
    fireEvent.click(within(race).getByRole('button', { name: 'Load more photographs' }));
    expect(within(race).getAllByRole('button', { name: /^View / })).toHaveLength(28);
    expect(within(water).getAllByRole('button', { name: /^View / })).toHaveLength(2);
  });
  it('opens the clicked collection only, even when another album shares the same image ID', async () => {
    render(
      <MemoryRouter>
        <Portfolio />
      </MemoryRouter>,
    );
    const water = screen.getByRole('region', { name: 'Watersports photographs' });
    fireEvent.click(
      await within(water).findByRole('button', { name: 'View Watersports, photograph 1' }),
    );
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(
      within(screen.getByRole('dialog')).getByRole('heading', { name: 'Watersports' }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Next photograph' }));
    expect(within(screen.getByRole('dialog')).getByText('Watersports — photograph 2')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Close photograph viewer' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(within(water).getAllByRole('button', { name: /^View / })).toHaveLength(2);
  });
  it('opens a shared photo URL while keeping the complete galleries underneath', async () => {
    render(
      <MemoryRouter initialEntries={['/portfolio?album=water&photo=frame-1']}>
        <Portfolio />
      </MemoryRouter>,
    );
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'Watersports' })).toBeTruthy();
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(screen.getByRole('region', { name: 'Race day photographs' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Watersports photographs' })).toBeTruthy();
  });
});
