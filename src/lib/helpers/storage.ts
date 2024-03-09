import { LOCAL, PASSWORD } from '$commonConst';
import { storageService } from '$commonServices';
import { HashSaltSchema } from '$commonTypes';

export const getPassword = async () => {
	const data = await storageService.getWithoutCallback({ key: PASSWORD, area: LOCAL });
	return HashSaltSchema.safeParse(data);
};
