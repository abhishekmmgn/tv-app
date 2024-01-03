"use client";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchSuggestions from "./search-suggestions";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [blurTimeoutId, setBlurTimeoutId] = useState(null);
  const [focused, setFocused] = useState<boolean | null>(null);

  const handleBlur = () => {
    setTimeout(() => {
      setFocused(false);
    }, 300);
    setBlurTimeoutId(blurTimeoutId);
  };

  const handleFocus = () => {
    clearTimeout(blurTimeoutId!);
    setFocused(true);
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const encodedSearchQuery = encodeURIComponent(searchQuery);
      const url = `/search?query=${encodedSearchQuery}`;
      router.replace(url);
      setFocused(false);
    }
  }

  const handleSearch = useDebouncedCallback((term) => {
    setSearchQuery(term);
  }, 300);

  return (
    <div className="relative w-full">
      <Search className="absolute top-[9px] left-2 w-5 h-5 text-neutral-500 md:w-4 md:h-4" />
      <Input
        placeholder="Search"
        type="search"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className="h-10 w-full pl-9 md:pl-8 pr-2 rounded-lg md:w-56 md:h-9 bg-secondary/40"
      />
      {focused && searchQuery && (
        <div className="w-full absolute z-40 mt-1 inset-x-0 min-h-screen bg-background/95 sm:mt-2 sm:rounded-sm sm:min-h-0 sm:max-h-64 flex flex-col overflow-y-clip">
          <SearchSuggestions searchQuery={searchQuery} />
        </div>
      )}
    </div>
  );
}
