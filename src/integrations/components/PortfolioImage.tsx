import { AdvancedImage } from '@cloudinary/react';
import useGetImages from '../cloudinary/hooks/useGetImages';
import { useMemo } from 'react';

export type IImage = {
  publicId: string;
  [props: string]: unknown;
};
export default function PortfolioImage({ publicId, ...props }: IImage) {
  const { getImage } = useGetImages({});

  const imageData = useMemo(() => getImage(publicId), [publicId]);

  return <AdvancedImage cldImg={imageData} {...props} />;
}
