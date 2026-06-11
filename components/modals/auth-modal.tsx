import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { AppleSvg, GoogleSvg } from "@/lib/icons";
import { UserAuth } from "@/providers/auth-provider";
import toast from "react-hot-toast";

function AuthModalContent() {
	const { googleSignIn } = UserAuth();

	const handleSignIn = () => {
		try {
			googleSignIn();
		} catch (error) {
			// console.log(error);
			toast.error("Something went wrong");
		}
	};

	return (
		<div className="mt-12 space-y-2 w-full max-w-full">
			<Button
				variant="outline"
				size="lg"
				onClick={handleSignIn}
				className="w-full"
			>
				<GoogleSvg />
				<span className="ml-1">Continue with Google</span>
			</Button>
			<Button
				variant="outline"
				size="lg"
				onClick={() =>
					console.error(
						"I don't have an Apple Developer account. Sign in with Google",
					)
				}
				className="w-full"
				disabled
			>
				<AppleSvg />
				<span className="ml-1">Sign in with Apple</span>
			</Button>
		</div>
	);
}

export default function AuthModal() {
	return (
		<ResponsiveDialog
			trigger={<Button className="hover:cursor-pointer">Sign In</Button>}
			title="Continue with Authentication"
			description="Sign In or Sign Up"
		>
			<AuthModalContent />
		</ResponsiveDialog>
	);
}
