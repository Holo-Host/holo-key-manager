import { createMutation, useQueryClient, createQuery } from '@tanstack/svelte-query';
import { generateKeys } from '$lib/services';
import type { GeneratedKeys } from '$types';
import { queryKey } from './query-keys';

export function useGeneratedKeys() {
	const queryClient = useQueryClient();

	const generateKeysMutation = createMutation({
		mutationFn: (passphrase: string) => generateKeys(passphrase),
		onSuccess: (data) => {
			queryClient.setQueryData([queryKey], data);
		}
	});

	const generatedKeysQuery = createQuery<GeneratedKeys>({
		queryKey: [queryKey]
	});
	return { generateKeysMutation, generatedKeysQuery };
}
