import { useState } from 'react';
import { MemoryRouter } from 'react-router';
import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Carousel from '../src/components/carousel/Carousel';
import Contact from '../src/pages/contact/Contact';
import { siteConfig } from '../src/config/SiteConfig';
import { englishI18n } from './translationFixture';

vi.mock('react-i18next', async () => {
  const { englishI18n } = await import('./translationFixture');
  return { useTranslation: () => ({ t: englishI18n.t.bind(englishI18n), i18n: englishI18n }) };
});
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
  window.scrollTo = vi.fn();
});
afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

describe('photo viewer', () => {
  it('wraps arrow navigation, carries the current reference to an enquiry, and restores body scrolling', () => {
    const album = {
      id: 'sport',
      title: 'Sport',
      category: 'Action',
      description: '',
      captions: { a: 'First frame', b: 'Second frame' },
    };
    function Viewer() {
      const [index, setIndex] = useState(0);
      const [open, setOpen] = useState(true);
      return open ? (
        <Carousel
          album={album}
          images={['a', 'b']}
          index={index}
          onChange={setIndex}
          onClose={() => setOpen(false)}
        />
      ) : (
        <p>Closed</p>
      );
    }
    render(
      <MemoryRouter>
        <Viewer />
      </MemoryRouter>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowLeft' });
    expect(screen.getByText('Second frame')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Ask about/ }).getAttribute('href')).toContain(
      'photo=b',
    );
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'ArrowRight' });
    expect(screen.getByText('First frame')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Close photograph viewer' }));
    expect(document.body.style.overflow).toBe('');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('does not show navigation for a single-image album and gives a clipboard fallback', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('blocked')) },
    });
    render(
      <MemoryRouter>
        <Carousel
          album={{ id: 'one', title: 'One', category: 'Sport', description: '' }}
          images={['a']}
          index={0}
          onChange={vi.fn()}
          onClose={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'Next photograph' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Share photo' }));
    expect(await screen.findByText(/Copy the address from your browser/)).toBeTruthy();
  });
});

describe('contact composer', () => {
  it('prefills an image enquiry and labels the non-deliverable test address', () => {
    render(
      <MemoryRouter initialEntries={['/contact?photo=water%2Ffinish&album=Race%20day']}>
        <Contact />
      </MemoryRouter>,
    );
    expect((screen.getByLabelText('Your message') as HTMLTextAreaElement).value).toContain(
      'Photo reference: water/finish',
    );
    expect((screen.getByLabelText('Subject') as HTMLInputElement).value).toBe(
      'Photo enquiry: Race day',
    );
    expect(screen.getByText(/placeholder and cannot receive enquiries/)).toBeTruthy();
  });
  it('offers a selectable draft when clipboard access fails, preserving the message', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('blocked')) },
    });
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Jo' } });
    fireEvent.change(screen.getByLabelText('Your email'), { target: { value: 'jo@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Copy draft' }));
    const draft = (await screen.findByLabelText('Draft to copy')) as HTMLTextAreaElement;
    expect(draft.value).toContain(englishI18n.t(siteConfig.enquiryStarter));
    expect(draft.value).toContain('Reply to: jo@example.com');
    expect(screen.queryByText(/sent successfully/i)).toBeNull();
  });
  it('keeps long drafts in the page rather than opening a truncated mailto', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Jo' } });
    fireEvent.change(screen.getByLabelText('Your email'), { target: { value: 'jo@example.com' } });
    fireEvent.change(screen.getByLabelText('Your message'), {
      target: { value: 'a'.repeat(3000) },
    });
    fireEvent.submit(screen.getByRole('button', { name: 'Open email draft' }).closest('form')!);
    expect(screen.getByText(/too long for some email apps/)).toBeTruthy();
    expect((screen.getByLabelText('Draft to copy') as HTMLTextAreaElement).value).toContain(
      'a'.repeat(3000),
    );
  });
});
