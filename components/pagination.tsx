"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
	Pagination as UiPagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

function generatePageNumbers(
	currentPage: number,
	totalPages: number,
): (number | "...")[] {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}
	const pages: (number | "...")[] = [1];
	if (currentPage > 4) pages.push("...");
	for (
		let i = Math.max(2, currentPage - 2);
		i <= Math.min(totalPages - 1, currentPage + 2);
		i++
	) {
		pages.push(i);
	}
	if (currentPage < totalPages - 3) pages.push("...");
	pages.push(totalPages);
	return pages;
}

export default function Pagination({ totalPages }: { totalPages: number }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentPage = Number(searchParams.get("page")) || 1;

	const createPageURL = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", page.toString());
		return `${pathname}?${params.toString()}`;
	};

	const pages = generatePageNumbers(currentPage, totalPages);

	return (
		<UiPagination className="py-8">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href={createPageURL(currentPage - 1)}
						disabled={currentPage <= 1}
						aria-disabled={currentPage <= 1}
					/>
				</PaginationItem>

				{pages.map((page, i) => (
					<PaginationItem key={page === "..." ? `ellipsis-${i}` : page}>
						{page === "..." ? (
							<PaginationEllipsis />
						) : (
							<PaginationLink
								href={createPageURL(page)}
								isActive={currentPage === page}
							>
								{page}
							</PaginationLink>
						)}
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext
						href={createPageURL(currentPage + 1)}
						disabled={currentPage >= totalPages}
						aria-disabled={currentPage >= totalPages}
					/>
				</PaginationItem>
			</PaginationContent>
		</UiPagination>
	);
}

