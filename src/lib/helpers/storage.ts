import { LOCAL, PASSWORD } from '$const';
import { storageService } from '$services';
import { HashSaltSchema } from '$types';

export const getPassword = async () => {
	const data = await storageService.getWithoutCallback({ key: PASSWORD, area: LOCAL });
	return HashSaltSchema.safeParse(data);
};
