import Image from "next/image";
import noItemLandscape from "../../public/noItemLandscape.png";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

type PropsType = {
	episode_number: number | null;
	name: string;
	image: string;
	overview: string;
	runtime: number | null;
};

export default function SeasonCard(props: PropsType) {
	return (
		<div className="w-[332px] md:w-[348px] xl:w-[356px] rounded-md">
			<div className="relative bg-secondary w-full aspect-video rounded-md mb-2 shadow-sm group">
				<Image
					src={
						props.image !== null
							? `https://image.tmdb.org/t/p/w500${props.image}`
							: noItemLandscape
					}
					alt={`Poster of ${props.episode_number}`}
					fill
					loading="lazy"
					sizes="356px"
					className="object-cover rounded-md"
				/>
			</div>
			<div className="w-full h-auto ">
				{props.episode_number !== null && (
					<small className="italic text-secondary-foreground/60">
						{props.episode_number}
					</small>
				)}
				<h1 className="text-sm font-semibold line-clamp-1 mr-1 md:text-sm+">
					{props.name}
				</h1>
				<p className="text-sm text-muted-foreground/80 mr-1 whitespace-normal wrap-break-word md:text-sm+ line-clamp-3">
					{props.overview}
				</p>
				{props.overview && props.overview.length > 120 && (
					<ResponsiveDialog
						title={
							props.episode_number !== null
								? `Ep #${props.episode_number}`
								: props.name
						}
						hideCancel={true}
						description={props.episode_number !== null ? props.name : undefined}
						trigger={
							<button className="text-xs font-medium text-blue-500 hover:underline mt-1">
								More
							</button>
						}
					>
						<div className="py-4">
							<p className="text-sm text-muted-foreground/80 whitespace-normal wrap-break-word md:text-sm+">
								{props.overview}
							</p>
						</div>
					</ResponsiveDialog>
				)}
				{props.runtime !== null && (
					<small className="text-xs text-muted-foreground/60 block mt-1">
						{props.runtime / 60 >= 1 && `${Math.floor(props.runtime / 60)} hr`}{" "}
						{props.runtime % 60 > 0 && `${Math.floor(props.runtime % 60)} min`}
					</small>
				)}
			</div>
		</div>
	);
}
