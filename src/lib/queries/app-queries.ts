import { useQueryClient } from '@tanstack/svelte-query';

import {
	createSessionQuery,
	createSetupDeviceKeyQuery,
	createStoreDeviceKey
} from './sessionAndKey';
import {
	createChangePasswordWithDeviceKeyMutation,
	createPasswordMutation,
	createSetupPasswordQuery,
	createSignInMutation
} from './password';

export function sessionStorageQueries() {
	const queryClient = useQueryClient();
	const changePasswordWithDeviceKeyMutation =
		createChangePasswordWithDeviceKeyMutation(queryClient);
	const createPassword = createPasswordMutation(queryClient);
	const sessionQuery = createSessionQuery();
	const setupDeviceKeyQuery = createSetupDeviceKeyQuery();
	const setupPasswordQuery = createSetupPasswordQuery();
	const signInMutation = createSignInMutation(queryClient);
	const storeDeviceKey = createStoreDeviceKey(queryClient);

	return {
		changePasswordWithDeviceKeyMutation,
		createPassword,
		sessionQuery,
		setupDeviceKeyQuery,
		setupPasswordQuery,
		signInMutation,
		storeDeviceKey
	};
}
