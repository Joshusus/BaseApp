import { Cloudinary } from "@cloudinary/url-gen";
import { CloudinaryImage } from '@cloudinary/url-gen/assets/CloudinaryImage';
import { useMemo, useRef } from "react";
import LoadedImagesState from "../state/LoadedImagesState";


export default function useGetImages({}) {

const cloudName = "demo"; //"dx4aoiw5u";
const cld = useMemo(() => new Cloudinary({ cloud: { cloudName: cloudName } }), []);

const getImage = (publicId: string): CloudinaryImage => {
  
  const existingEntry = LoadedImagesState.value[publicId];
  if (existingEntry) {
    return existingEntry;
  }
  
  const image = cld.image(publicId);
  LoadedImagesState.value[publicId] = image;
  return image;
}

  return { getImage }
}