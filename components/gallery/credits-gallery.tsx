import { CastProfileType, CreditsListType } from "@/types";
import CastProfile from "../cards/cast-profile";

export default function CreditsGallery({ data }: { data: CreditsListType }) {
	const list: CastProfileType[] = [
		...data.cast.slice(0, 10),
		...data.crew.slice(0, 10),
	];
	return (
		<>
			{list?.slice(0, 20).map((item: CastProfileType, index: number) => (
				<div key={index}>
					<CastProfile
						profile_path={
							item?.profile_path
								? `https://image.tmdb.org/t/p/w154${item.profile_path}`
								: null
						}
						name={item.name}
						character={item.character}
						job={item.job}
					/>
				</div>
			))}
		</>
	);
}
