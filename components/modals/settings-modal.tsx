import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { UserAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SettingsModal() {
	const { user, logOut, deleteAccount } = UserAuth();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleSignOut = () => {
		try {
			logOut();
			toast.success("Sign out successfully");
		} catch (error) {
			toast.error("Something went wrong when logging out.");
		}
	};

	const handleAccountDeletion = async () => {
		try {
			await deleteAccount();
			toast.success("Account deleted successfully");
		} catch (error: any) {
			console.error("Account deletion failed:", error);
			if (error?.code === "auth/requires-recent-login") {
				toast.error("Please sign in again to delete your account.");
			} else {
				toast.error("Something went wrong on deleting account");
			}
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<button type="button" className="rounded-full outline-none focus:outline-none">
							<Avatar className="cursor-pointer w-9 h-9">
								<AvatarImage
									src={user?.photoURL || undefined}
									alt="Profile Photo"
								/>
								<AvatarFallback>
									{user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
								</AvatarFallback>
							</Avatar>
						</button>
					}
				/>
				<DropdownMenuContent align="end" className="w-56">
					<DropdownMenuGroup>
						<DropdownMenuLabel className="flex flex-col gap-1">
							<div className="font-medium text-secondary-foreground text-sm">
								{user?.displayName || "User"}
							</div>
							<div className="text-xs text-muted-foreground truncate">
								{user?.email}
							</div>
						</DropdownMenuLabel>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<Link href="/watched">
						<DropdownMenuItem className="cursor-pointer">
							Watched items
						</DropdownMenuItem>
					</Link>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
						Sign Out
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
						onClick={() => setDeleteDialogOpen(true)}
					>
						Delete Account
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ResponsiveDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				trigger={<button type="button" className="hidden" aria-hidden="true" />}
				title="Delete Account"
				description="Are you absolutely sure you want to delete your account? This action cannot be undone."
			>
				<div className="">
					<Button
						variant="destructive"
						className="w-full"
						onClick={() => {
							handleAccountDeletion();
							setDeleteDialogOpen(false);
						}}
					>
						Delete Account
					</Button>
				</div>
			</ResponsiveDialog>
		</>
	);
}
