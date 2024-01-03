type PropsType = {
  title: string;
  link: string;
};

export default function VideoCard(props: PropsType) {
  return (
    <div className="w-[360px] md:w-[372px] xl:w-[384px] rounded-md">
      <div className="relative bg-secondary w-full aspect-video rounded-md mb-2 shadow-sm group">
        <iframe
          width="100%"
          height="100%"
          src={props.link}
          title={props.title}
          allowFullScreen
          className="rounded-md"
        ></iframe>
      </div>
      <h1 className="text-sm font-semibold line-clamp-1 mr-1">{props.title}</h1>
    </div>
  );
}
