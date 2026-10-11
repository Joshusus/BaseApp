import { afterEach, describe, expect, it, vi } from 'vitest';
import { AlbumCache } from '../src/integrations/cloudinary/state/AlbumCache';

afterEach(() => vi.useRealTimers());
describe('shared album metadata cache', () => {
  it('deduplicates in-flight consumers and caches resolved albums, including empty ones', async () => {
    const cache = new AlbumCache();
    let resolve!: (ids: string[]) => void;
    const loader = vi.fn(
      () =>
        new Promise<string[]>((done) => {
          resolve = done;
        }),
    );
    const one = cache.load('marcus', 'sport', loader);
    const two = cache.load('marcus', 'sport', loader);
    expect(two).toBe(one);
    await Promise.resolve();
    expect(loader).toHaveBeenCalledTimes(1);
    resolve([]);
    await expect(one).resolves.toEqual([]);
    await expect(cache.load('marcus', 'sport', loader)).resolves.toEqual([]);
    expect(loader).toHaveBeenCalledTimes(1);
  });
  it('keeps different clouds and tags separate and preserves returned order', async () => {
    const cache = new AlbumCache();
    await expect(cache.load('one', 'sport', async () => ['b', 'a'])).resolves.toEqual(['b', 'a']);
    await expect(cache.load('two', 'sport', async () => ['c'])).resolves.toEqual(['c']);
    await expect(cache.load('one', 'water', async () => ['d'])).resolves.toEqual(['d']);
  });
  it('evicts failed requests so retry can succeed', async () => {
    const cache = new AlbumCache();
    const loader = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(['recovered']);
    await expect(cache.load('one', 'sport', loader)).rejects.toThrow('offline');
    await expect(cache.load('one', 'sport', loader)).resolves.toEqual(['recovered']);
    expect(loader).toHaveBeenCalledTimes(2);
  });
  it('refreshes after expiry, deduplicates pending refresh, and freezes results', async () => {
    vi.useFakeTimers();
    const cache = new AlbumCache(100);
    const loader = vi.fn().mockResolvedValue(['a']);
    const ids = await cache.load('one', 'sport', loader);
    expect(Object.isFrozen(ids)).toBe(true);
    await cache.load('one', 'sport', loader);
    expect(loader).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(101);
    const one = cache.load('one', 'sport', loader);
    expect(cache.load('one', 'sport', loader, true)).toBe(one);
    await one;
    expect(loader).toHaveBeenCalledTimes(2);
    await cache.load('one', 'sport', loader, true);
    expect(loader).toHaveBeenCalledTimes(3);
  });
});
