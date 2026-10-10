import axios from 'axios';
import type { CloudinaryTagAssetResponse } from './CloudinaryApi.types';

export default class CloudinaryApi {
  constructor(private readonly cloudName: string) {}

  /** Cloudinary's public tag delivery API. Never put an Admin API secret here. */
  async getAssetsList(tag: string): Promise<string[]> {
    const { data } = await axios.get<CloudinaryTagAssetResponse>(
      `https://res.cloudinary.com/${encodeURIComponent(this.cloudName)}/image/list/${encodeURIComponent(tag)}.json`,
      { timeout: 15000 },
    );
    if (
      !Array.isArray(data.resources) ||
      data.resources.some((asset) => typeof asset.public_id !== 'string')
    ) {
      throw new Error('The album response was not a valid image list.');
    }
    return [...new Set(data.resources.map((asset) => asset.public_id))];
  }
}
