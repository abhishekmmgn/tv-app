"use client";

import { IoSearch } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import SearchSuggestions from "./search-suggestions";
import { Input } from "./ui/input";

export default function SearchBar() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = useState("");
	const [focused, setFocused] = useState<boolean | null>(null);
	const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Sync input with URL query param on navigation
	useEffect(() => {
		const query = searchParams.get("query") ?? "";
		if (inputRef.current) inputRef.current.value = query;
		setSearchQuery(query);
	}, [searchParams]);

	const handleBlur = () => {
		blurTimeoutRef.current = setTimeout(() => {
			setFocused(false);
		}, 300);
	};

	const handleFocus = () => {
		if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
		setFocused(true);
	};

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			// Read directly from the DOM to avoid the debounce lag
			const currentValue = inputRef.current?.value ?? searchQuery;
			router.replace(`/search?query=${encodeURIComponent(currentValue)}`);
			setFocused(false);
		}
	}

	const handleSearch = useDebouncedCallback((term: string) => {
		setSearchQuery(term);
	}, 300);

	return (
		<div className="relative w-full text-muted-foreground">
			<IoSearch className="absolute top-2.5 left-2 w-5 h-5 md:w-4 md:h-4" />
			<Input
				ref={inputRef}
				placeholder="Game of Thrones"
				type="search"
				onChange={(e) => {
					handleSearch(e.target.value);
					if (e.target.value) setFocused(true);
				}}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				onFocus={handleFocus}
				className="h-10 w-full pl-8 pr-2 rounded-lg sm:w-80 md:h-9 bg-secondary"
			/>
			{focused && searchQuery && (
				<div className="w-full absolute z-40 mt-1 inset-x-0 min-h-screen bg-background/95 sm:mt-2 sm:rounded-sm sm:min-h-0 sm:max-h-64 flex flex-col overflow-y-clip">
					<SearchSuggestions searchQuery={searchQuery} />
				</div>
			)}
		</div>
	);
}
