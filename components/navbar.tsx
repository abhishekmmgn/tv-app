"use client";

import SearchBar from "./search-bar";
import { Search } from "lucide-react";
import { UserAuth } from "@/providers/auth-provider";
import AuthModal from "./modals/auth-modal";
import SettingsModal from "./modals/settings-modal";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const { user } = UserAuth();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="z-50 fixed top-0 inset-x-0 w-full h-14 bg-black px-5 flex items-center justify-between border-b border-b-neutral-800 lg:px-8 xl:px-12">
      <Link href="/">
        <h1 className="font-bold text-lg">TV</h1>
      </Link>
      <div className="w-1/3 flex items-center justify-end gap-5 sm:w-1/2 sm:gap-3">
        <div
          onClick={() => {
            if (pathname === "/") {
              router.push("/search");
            }
          }}
        >
          {pathname !== "/search" && (
            <Search className="text-foreground w-5 h-5 hover:cursor-pointer sm:hidden" />
          )}
          <div className="hidden sm:inline">
            <SearchBar />
          </div>
        </div>

        {user ? <SettingsModal /> : <AuthModal />}
      </div>
    </div>
  );
}
