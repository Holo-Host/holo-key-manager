import type { QueryClient } from '@tanstack/svelte-query';

export const handleSuccess = (queryClient: QueryClient, queryKey: string[]) => () =>
	queryClient.invalidateQueries({ queryKey });
