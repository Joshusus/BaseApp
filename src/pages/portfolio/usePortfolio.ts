import { useEffect, useMemo, useState } from "react";
import CloudinaryApi from "~/integrations/cloudinary/apis/CloudinaryApi";

type IUsePortfolio = {
	// getFolderImages: (tag: string) => Promise<string[]>;
};
// { getFolderImages }: IUsePortfolio
export default function usePortfolio() {
	const [testImageIds, setTestImageIds] = useState<string[]>();

	const cloudinaryApi = useMemo(() => new CloudinaryApi("demo"), []);

	useEffect(() => {
		cloudinaryApi.GetAssetsList(
			"logo",
			(response) => {
				setTestImageIds(
					response?.data.resources.map(
						(assetMetadata) => assetMetadata.public_id,
					),
				);
			},
			() => undefined, // TODO
		);
	}, [cloudinaryApi]);

	// useEffect(() => {
	// 	console.log(
	// 		"why is this spam called when I put the function in the dependencies",
	// 	);

	// 	var promise = getFolderImages("logo"); // TODO not awaiting
	// 	promise.then((imageAssets) => {
	// 		setTestImageIds(imageAssets);
	// 	});
	// }, []);

	return { testImageIds };
}
