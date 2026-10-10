import { useEffect, useRef, useState } from 'react';
import { albums, cloudName, type AlbumConfig } from '~/config/PortfolioConfig';
import CloudinaryApi from '~/integrations/cloudinary/apis/CloudinaryApi';
import { albumCache } from '~/integrations/cloudinary/state/AlbumCache';

type AlbumState = {
  images: readonly string[];
  status: 'loading' | 'ready' | 'error';
  error?: string;
};
const loading: AlbumState = { images: [], status: 'loading' };
const api = new CloudinaryApi(cloudName);

export default function usePortfolio(album: AlbumConfig | undefined = albums[0]) {
  const [result, setResult] = useState<{ album: AlbumConfig | undefined; state: AlbumState }>();
  const [retryCount, setRetryCount] = useState(0);
  const refreshRequested = useRef<AlbumConfig | undefined>(undefined);
  const state = result && result.album === album ? result.state : loading;

  useEffect(() => {
    let active = true;
    const refresh = !!album && refreshRequested.current === album;
    refreshRequested.current = undefined;
    setResult({ album, state: loading });
    const request = album?.publicIds
      ? Promise.resolve([...new Set(album.publicIds)])
      : album?.tag
        ? albumCache.load(cloudName, album.tag, () => api.getAssetsList(album.tag!), refresh)
        : Promise.resolve([]);
    request
      .then((images) => {
        if (active) setResult({ album, state: { images, status: 'ready' } });
      })
      .catch(() => {
        if (active)
          setResult({
            album,
            state: {
              images: [],
              status: 'error',
              error: 'This album could not be loaded. Please try again.',
            },
          });
      });
    // A departing consumer must not cancel the request shared by other consumers.
    return () => {
      active = false;
    };
  }, [album, retryCount]);

  return {
    ...state,
    retry: () => {
      refreshRequested.current = album;
      setRetryCount((count) => count + 1);
    },
  };
}
