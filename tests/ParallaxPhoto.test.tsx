import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import ParallaxPhoto from '../src/components/parallaxPhoto/ParallaxPhoto';
import PortfolioImage from '../src/integrations/components/PortfolioImage';

vi.mock('react-i18next', async () => {
  const { englishI18n } = await import('./translationFixture');
  return { useTranslation: () => ({ t: englishI18n.t.bind(englishI18n), i18n: englishI18n }) };
});

vi.mock('react-parallax/lib/index.js', () => ({
  Parallax: ({
    disabled,
    renderLayer,
    children,
  }: {
    disabled: boolean;
    renderLayer: (percentage: number) => React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div data-testid="parallax" data-disabled={String(disabled)}>
      {renderLayer(0.5)}
      {children}
    </div>
  ),
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const photo = {
  publicId: 'sport',
  cloudName: 'demo',
  alt: 'Sport photograph',
  objectPosition: 'center',
  parallax: { enabled: true, strength: 300, travel: 700 },
};

describe('configurable parallax photography', () => {
  it('turns off both the library effect and custom photo travel when reduced motion changes', () => {
    const listeners = new Set<() => void>();
    const query = {
      matches: false,
      addEventListener: (_type: string, fn: () => void) => listeners.add(fn),
      removeEventListener: (_type: string, fn: () => void) => listeners.delete(fn),
    };
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: vi.fn(() => query) });
    const view = render(
      <ParallaxPhoto photo={photo}>
        <p>Headline</p>
      </ParallaxPhoto>,
    );
    expect(screen.getByTestId('parallax').getAttribute('data-disabled')).toBe('false');
    expect((screen.getByAltText('Sport photograph') as HTMLImageElement).style.top).not.toBe('0px');
    act(() => {
      query.matches = true;
      listeners.forEach((fn) => fn());
    });
    expect(screen.getByTestId('parallax').getAttribute('data-disabled')).toBe('true');
    expect((screen.getByAltText('Sport photograph') as HTMLImageElement).style.top).toBe('0px');
    view.unmount();
    expect(listeners.size).toBe(0);
  });
  it('keeps the hero cloud independent and recovers when switching away from a failed cloud', () => {
    const view = render(<PortfolioImage publicId="same-id" cloudName="one" alt="Frame" />);
    expect(screen.getByAltText('Frame').getAttribute('src')).toContain('/one/');
    fireEvent.error(screen.getByAltText('Frame'));
    expect(screen.getByText('Photograph unavailable')).toBeTruthy();
    view.rerender(<PortfolioImage publicId="same-id" cloudName="demo" alt="Frame" />);
    expect(screen.getByAltText('Frame').getAttribute('src')).toContain('/demo/');
    expect(screen.queryByText('Photograph unavailable')).toBeNull();
  });
});
