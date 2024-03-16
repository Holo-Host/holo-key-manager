import type { QueryClient } from '@tanstack/svelte-query';

import { LOCAL, PASSWORD } from '$sharedConst';
import { storageService } from '$sharedServices';
import { HashSaltSchema } from '$sharedTypes';

export const handleSuccess = (queryClient: QueryClient, queryKey: string[]) => () =>
	queryClient.invalidateQueries({ queryKey });

export const getPassword = async () => {
	const data = await storageService.getWithoutCallback({
		key: PASSWORD,
		area: LOCAL
	});
	return HashSaltSchema.safeParse(data);
};
