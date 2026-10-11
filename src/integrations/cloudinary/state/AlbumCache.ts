type Entry = { promise: Promise<readonly string[]>; expiresAt: number };

/** Shared by all hook instances. Cache metadata, not downloaded image bytes. */
export class AlbumCache {
  private entries = new Map<string, Entry>();
  constructor(private readonly ttlMs = 30 * 60 * 1000) {}

  load(
    cloud: string,
    tag: string,
    loader: () => Promise<string[]>,
    refresh = false,
  ): Promise<readonly string[]> {
    const key = JSON.stringify([cloud, tag]);
    const existing = this.entries.get(key);
    // In-flight entries are always reused, even on retry.
    if (
      existing &&
      (existing.expiresAt === Infinity || (!refresh && existing.expiresAt > Date.now()))
    ) {
      return existing.promise;
    }
    const entry: Entry = { promise: Promise.resolve([]), expiresAt: Infinity };
    entry.promise = Promise.resolve()
      .then(loader)
      .then((ids) => {
        entry.expiresAt = Date.now() + this.ttlMs;
        return Object.freeze([...ids]);
      })
      .catch((error: unknown) => {
        if (this.entries.get(key) === entry) this.entries.delete(key);
        throw error;
      });
    this.entries.set(key, entry);
    return entry.promise;
  }
}

export const albumCache = new AlbumCache();
