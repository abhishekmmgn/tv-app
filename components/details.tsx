import { Separator } from "@/components/ui/separator";

export default function Details({
	details,
	isAShow,
}: {
	details: any;
	isAShow: boolean;
}) {
	return (
		<div className="mx-5 md:mx-8 xl:mx-12 p-5 bg-secondary rounded-lg flex flex-col gap-5">
			<div>
				<h1 className="text-xl font-semibold md:text-2xl">
					{details.title || details.name}
				</h1>
				<p className="mt-1 text-sm text-neutral-300 lg:w-1/3">
					{details.overview}
				</p>
			</div>
			<Separator className="bg-neutral-700" />
			<div className="flex flex-col md:grid md:grid-cols-2 gap-2 justify-start md:gap-3">
				{details.original_title !== details.title && (
					<div>
						<h2 className="text-base font-medium text-secondary-foreground">
							Orignal Title
						</h2>
						<p className="text-sm text-accent capitalize">
							{details.original_title}
						</p>
					</div>
				)}
				{details.original_language && (
					<div>
						<h2 className="text-base font-medium text-secondary-foreground">
							Orignal Language
						</h2>
						<p className="text-sm text-accent capitalize">
							{details.original_language}
						</p>
					</div>
				)}
				{isAShow && (
					<>
						<div>
							<h2 className="text-base font-medium text-secondary-foreground">
								Seasons
							</h2>
							<p className="text-sm text-accent">{details.number_of_seasons}</p>
						</div>
						<div>
							<h2 className="text-base font-medium text-secondary-foreground">
								Episodes per Season
							</h2>
							<p className="text-sm text-accent">
								~
								{Math.floor(
									details.number_of_episodes / details.number_of_seasons,
								)}
							</p>
						</div>
					</>
				)}
				{details.runtime && (
					<div>
						<h2 className="text-base font-medium text-secondary-foreground">
							Duration
						</h2>
						<p className="text-sm text-accent">
							{Math.floor(details.runtime / 60)} hr {details.runtime % 60} min
						</p>
					</div>
				)}
				{details.belongs_to_collection && (
					<div>
						<h2 className="text-base font-medium text-secondary-foreground">
							Collection
						</h2>
						<p className="text-sm text-accent">
							{details.belongs_to_collection.name}
						</p>
					</div>
				)}
				<div>
					<h2 className="text-base font-medium text-secondary-foreground">
						Genre
					</h2>
					<p className="text-sm text-accent">
						{details.genres?.map((genre: any) => genre.name).join(", ")}
					</p>
				</div>
				<div>
					<h2 className="text-base font-medium text-secondary-foreground">
						Status
					</h2>
					<p className="text-sm text-accent">{details.status}</p>
				</div>
				<div>
					<h2 className="text-base font-medium text-secondary-foreground">
						Release Data
					</h2>
					<p className="text-sm text-accent">
						{details.first_air_date || details.release_date}
					</p>
				</div>
				{details.production_companies && (
					<div>
						<h2 className="text-base font-medium text-secondary-foreground">
							Produced By
						</h2>
						<p className="text-sm text-accent">
							{details.production_companies
								.map((company: any) => company.name)
								.join(", ")}
						</p>
					</div>
				)}
				{details.networks && (
					<div>
						<h2 className="text-base font-medium text-secondary-foreground">
							Streaming Network
						</h2>
						<p className="text-sm text-accent">
							{details.networks.map((network: any) => network.name).join(", ")}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
