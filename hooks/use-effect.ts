"use client";

import { browserRuntime } from "@/lib/effect/browser";
import type { AuthService, UserStore } from "@/lib/effect/firebase";
import type { TmdbClient } from "@/lib/effect/tmdb";
import { Effect } from "effect";
import { useEffect, useState } from "react";

type BrowserServices = TmdbClient | AuthService | UserStore;

type Result<A, E> = { data: A | null; error: E | null };

// Runs an effect on the browser runtime. Pass a memoised effect (useMemo) or null
// to skip; changing or unmounting aborts the in-flight request.
export function useBrowserEffect<A, E>(
	effect: Effect.Effect<A, E, BrowserServices> | null,
) {
	const [state, setState] = useState<{
		source: unknown;
		result: Result<A, E>;
	} | null>(null);

	useEffect(() => {
		if (!effect) return;
		const controller = new AbortController();
		browserRuntime
			.runPromise(
				effect.pipe(
					Effect.match({
						onSuccess: (data): Result<A, E> => ({ data, error: null }),
						onFailure: (error): Result<A, E> => ({ data: null, error }),
					}),
				),
				{ signal: controller.signal },
			)
			.then((result) => {
				if (!controller.signal.aborted) setState({ source: effect, result });
			})
			.catch(() => {
				// aborted
			});
		return () => controller.abort();
	}, [effect]);

	const settled = state !== null && state.source === effect;
	return {
		data: settled ? state.result.data : null,
		error: settled ? state.result.error : null,
		loading: effect !== null && !settled,
	};
}
