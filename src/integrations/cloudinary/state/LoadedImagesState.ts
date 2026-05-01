import type { CloudinaryImage } from "@cloudinary/url-gen/index";

type ImagesDictionary = {
  [publicId: string]: CloudinaryImage;
}

// I'm experimenting with caching all images we've requested here. Maybe put a cache limit on?
export default class LoadedImagesState {
  static value: ImagesDictionary = {};
  // static set(newValue: ImagesDictionary) {
  //   LoadedImagesState.value = newValue;
  // }
  // static get() {
  //   return LoadedImagesState.value;
  // }
}