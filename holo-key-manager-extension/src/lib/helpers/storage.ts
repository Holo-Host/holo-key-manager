import { LOCAL, PASSWORD } from '$sharedConst';
import { storageService } from '$sharedServices';
import { HashSaltSchema } from '$sharedTypes';

export const getPassword = async () => {
	const data = await storageService.getWithoutCallback({ key: PASSWORD, area: LOCAL });
	return HashSaltSchema.safeParse(data);
};
