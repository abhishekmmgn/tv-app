export default function handleCopyLink(
	event: React.MouseEvent<HTMLElement>,
	link: string,
) {
	event.preventDefault();
	try {
		navigator.clipboard.writeText(`https:tv-app-beta.vercel.app${link}`);
		return true;
	} catch (error) {
		return false;
	}
}
