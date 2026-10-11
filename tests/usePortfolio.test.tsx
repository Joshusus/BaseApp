import { StrictMode, type ReactNode } from 'react';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CloudinaryApi from '../src/integrations/cloudinary/apis/CloudinaryApi';
import usePortfolio from '../src/pages/portfolio/usePortfolio';
import type { AlbumConfig } from '../src/config/PortfolioConfig';

afterEach(cleanup);
const album = (tag: string): AlbumConfig => ({
  id: tag,
  tag,
  title: tag,
  category: 'Sport',
  description: '',
});
describe('usePortfolio', () => {
  it('awaits the response and reuses one request through StrictMode and remounts', async () => {
    const config = album('strict-mode');
    let resolve!: (ids: string[]) => void;
    const request = vi.spyOn(CloudinaryApi.prototype, 'getAssetsList').mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const first = renderHook(() => usePortfolio(config), {
      wrapper: ({ children }: { children: ReactNode }) => <StrictMode>{children}</StrictMode>,
    });
    expect(first.result.current.status).toBe('loading');
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
    first.unmount();
    const second = renderHook(() => usePortfolio(config));
    await act(async () => resolve(['photo-one', 'photo-two']));
    await waitFor(() => expect(second.result.current.images).toEqual(['photo-one', 'photo-two']));
    expect(second.result.current.status).toBe('ready');
    expect(request).toHaveBeenCalledTimes(1);
    second.unmount();
    const third = renderHook(() => usePortfolio(config));
    await waitFor(() => expect(third.result.current.status).toBe('ready'));
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('does not let a slower departed album overwrite the current album', async () => {
    const first = album('slow');
    const second = album('fast');
    let resolve!: (ids: string[]) => void;
    vi.spyOn(CloudinaryApi.prototype, 'getAssetsList').mockImplementation((tag) =>
      tag === 'slow'
        ? new Promise((done) => {
            resolve = done;
          })
        : Promise.resolve(['fast-photo']),
    );
    const hook = renderHook(({ config }) => usePortfolio(config), {
      initialProps: { config: first },
    });
    await waitFor(() => expect(resolve).toBeDefined());
    hook.rerender({ config: second });
    await waitFor(() => expect(hook.result.current.images).toEqual(['fast-photo']));
    await act(async () => resolve(['slow-photo']));
    expect(hook.result.current.images).toEqual(['fast-photo']);
  });
  it('surfaces errors and retries, then reuses cached albums after switching', async () => {
    const a = album('retry-a');
    const b = album('retry-b');
    const request = vi
      .spyOn(CloudinaryApi.prototype, 'getAssetsList')
      .mockRejectedValueOnce(new Error('403'))
      .mockResolvedValueOnce(['a'])
      .mockResolvedValueOnce(['b']);
    const hook = renderHook(({ config }) => usePortfolio(config), { initialProps: { config: a } });
    await waitFor(() => expect(hook.result.current.status).toBe('error'));
    act(() => hook.result.current.retry());
    await waitFor(() => expect(hook.result.current.images).toEqual(['a']));
    hook.rerender({ config: b });
    await waitFor(() => expect(hook.result.current.images).toEqual(['b']));
    hook.rerender({ config: a });
    await waitFor(() => expect(hook.result.current.images).toEqual(['a']));
    expect(request).toHaveBeenCalledTimes(3);
  });
  it('curated albums avoid list requests and handle empty results', async () => {
    const request = vi.spyOn(CloudinaryApi.prototype, 'getAssetsList');
    const config = { ...album('curated'), publicIds: [] };
    const hook = renderHook(() => usePortfolio(config));
    await waitFor(() => expect(hook.result.current.status).toBe('ready'));
    expect(hook.result.current.images).toEqual([]);
    expect(request).not.toHaveBeenCalled();
  });
});
