import type { ImageFormatType } from "@cloudinary/url-gen/types/types";

export type CloudinaryTagAssetResponse = {
	resources: CloudinaryTagAsset[];
	updated_at: Date;
};

export type CloudinaryTagAsset = {
	public_id: string;
	format: ImageFormatType;
	width: number;
	height: number;
};
