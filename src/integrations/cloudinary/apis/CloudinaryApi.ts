import axios, { type AxiosError, type AxiosResponse } from "axios";
import type { CloudinaryTagAssetResponse } from "./CloudinaryApi.types";

type SuccessCallback<T> = (response?: AxiosResponse<T>) => void;
type FailedCallback<T> = (error?: AxiosError<T>) => void;

export default class CloudinaryApi {
	Cloudinary: string;

	constructor(cloudinary: string) {
		this.Cloudinary = cloudinary;
	}

	GetAssetsList = (
		tagName: string,
		successCallback: SuccessCallback<CloudinaryTagAssetResponse>,
		failCallback: FailedCallback<unknown>,
	) => {
		axios
			.get(
				`https://res.cloudinary.com/${this.Cloudinary}/image/list/${tagName}.json`,
			)
			.then(successCallback)
			.catch(failCallback);
	};
}
