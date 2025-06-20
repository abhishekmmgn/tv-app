import { Separator } from "@/components/ui/separator";
import { DataDetailsType } from "@/types";

export default function Details({
  details,
  isAShow,
}: {
  details: DataDetailsType;
  isAShow: boolean;
}) {
  return (
    <div className="mx-5 md:mx-8 xl:mx-12 p-5 bg-secondary rounded-lg flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold md:text-2xl">
          {details.title || details.name}
        </h1>
        <p className="mt-1 text-sm text-neutral-300 lg:max-w-lg">
          {details.overview}
        </p>
      </div>
      <Separator className="bg-neutral-700" />
      <div className="flex flex-col md:grid md:grid-cols-2 gap-2 justify-start md:gap-3">
        {details.original_title !== details.title && (
          <div>
            <p className="font-medium text-secondary-foreground">
              Orignal Title
            </p>
            <p className="text-sm text-accent capitalize">
              {details.original_title}
            </p>
          </div>
        )}
        {details.original_language && (
          <div>
            <p className="font-medium text-secondary-foreground">
              Orignal Language
            </p>
            <p className="text-sm text-accent capitalize">
              {details.original_language}
            </p>
          </div>
        )}
        {details.number_of_seasons != null && (
          <>
            <div>
              <p className="font-medium text-secondary-foreground">Seasons</p>
              <p className="text-sm text-accent">{details.number_of_seasons}</p>
            </div>
          </>
        )}
        {details.runtime != null && (
          <div>
            <p className="font-medium text-secondary-foreground">Duration</p>
            <p className="text-sm text-accent">{details.runtime} minutes</p>
          </div>
        )}
        {details.belongs_to_collection && (
          <div>
            <p className="font-medium text-secondary-foreground">Collection</p>
            <p className="text-sm text-accent">
              {details.belongs_to_collection.name}
            </p>
          </div>
        )}
        <div>
          <p className="font-medium text-secondary-foreground">Genre</p>
          <p className="text-sm text-accent">
            {details.genres?.map((genre: any) => genre.name).join(", ")}
          </p>
        </div>
        <div>
          <p className="font-medium text-secondary-foreground">Status</p>
          <p className="text-sm text-accent">{details.status}</p>
        </div>
        <div>
          <p className="font-medium text-secondary-foreground">Release Date</p>
          <p className="text-sm text-accent">
            {details.first_air_date || details.release_date}
          </p>
        </div>
        {details.budget != null && details.budget !== 0 && (
          <div>
            <p className="font-medium text-secondary-foreground">Budget</p>
            <p className="text-sm text-accent">${details.budget}</p>
          </div>
        )}
        {details.revenue != null && details.revenue !== 0 && (
          <div>
            <p className="font-medium text-secondary-foreground">Revenue</p>
            <p className="text-sm text-accent">${details.revenue}</p>
          </div>
        )}
        {details.production_companies && (
          <div>
            <p className="font-medium text-secondary-foreground">
              Production Companies
            </p>
            <p className="text-sm text-accent">
              {details.production_companies
                .map((company) => company.name)
                .join(", ")}
            </p>
          </div>
        )}
        {details.networks && (
          <div>
            <p className="font-medium text-secondary-foreground">
              Streaming Network
            </p>
            <p className="text-sm text-accent">
              {details.networks.map((network: any) => network.name).join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
