import personIcon from "@/public/person.png";
import { CastProfileType } from "@/types";
import Image from "next/image";

export default function CastProfile(props: CastProfileType) {
	return (
		<>
			<div className="relative w-24 md:w-28 xl:w-32 h-24 md:h-28 xl:h-32 bg-secondary rounded-full shadow-sm">
				<Image
					src={props.profile_path ?? personIcon}
					fill
					loading="lazy"
					sizes="128px"
					alt={`Profile photo of ${props.name}`}
					className="object-cover rounded-full"
				/>
			</div>
			<div className="mt-2 px-1 w-24 md:w-28 xl:w-32 whitespace-pre-line text-center">
				<h1 className="text-[0.9375rem] leading-tight font-medium">
					{props.name}
				</h1>
				<p className="mt-1 text-sm leading-tight text-neutral-400">
					{props.character || props.job}
				</p>
			</div>
		</>
	);
}
