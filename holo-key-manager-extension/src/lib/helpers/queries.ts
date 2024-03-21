import type { QueryClient } from '@tanstack/svelte-query';

import { LOCAL, PASSWORD } from '$shared/const';
import { storageService } from '$shared/services';
import { HashSaltSchema } from '$shared/types';

export const handleSuccess = (queryClient: QueryClient, queryKey: string[]) => () =>
	queryClient.invalidateQueries({ queryKey });

export const getPassword = async () => {
	const data = await storageService.getWithoutCallback({
		key: PASSWORD,
		area: LOCAL
	});
	return HashSaltSchema.safeParse(data);
};
