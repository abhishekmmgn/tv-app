import CastProfile from "../cards/cast-profile";

export default function CreditsGallery({ data }: { data: any }) {
  const list = [...data.cast.slice(0, 5), ...data.crew.slice(0, 5)];
  return (
    <>
      {list?.slice(0, 10).map((item: any, index: number) => (
        <div key={index}>
          <CastProfile
            image={item.profile_path}
            name={item.name}
            character={item.character}
            job={item.job}
          />
        </div>
      ))}
    </>
  );
}
