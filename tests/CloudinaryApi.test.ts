import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import CloudinaryApi from '../src/integrations/cloudinary/apis/CloudinaryApi';

describe('public Cloudinary tag API', () => {
  it('awaits requests, encodes cloud/tag paths, deduplicates public IDs', async () => {
    const get = vi.spyOn(axios, 'get').mockResolvedValue({
      data: { resources: [{ public_id: 'b' }, { public_id: 'a' }, { public_id: 'b' }] },
    });
    await expect(new CloudinaryApi('a cloud').getAssetsList('sports & water')).resolves.toEqual([
      'b',
      'a',
    ]);
    expect(get).toHaveBeenCalledWith(
      'https://res.cloudinary.com/a%20cloud/image/list/sports%20%26%20water.json',
      { timeout: 15000 },
    );
  });
  it('rejects malformed lists and exposes HTTP failures to the cache/hook', async () => {
    vi.spyOn(axios, 'get')
      .mockResolvedValueOnce({ data: { resources: 'invalid' } })
      .mockRejectedValueOnce(new Error('restricted'));
    const api = new CloudinaryApi('one');
    await expect(api.getAssetsList('sport')).rejects.toThrow('valid image list');
    await expect(api.getAssetsList('sport')).rejects.toThrow('restricted');
  });
});
