import { useQueryClient } from '@tanstack/svelte-query';

import {
	createChangePasswordWithDeviceKeyMutation,
	createPasswordAndStoreDeviceKeyMutation,
	createPasswordMutation,
	createSetupPasswordQuery,
	createSignInMutation
} from './password';
import {
	createRecoverDeviceKeyMutation,
	createSessionQuery,
	createSetupDeviceKeyQuery,
	createStoreDeviceKey
} from './sessionAndKey';

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
	const recoverDeviceKeyMutation = createRecoverDeviceKeyMutation();
	const passwordAndStoreDeviceKeyMutation = createPasswordAndStoreDeviceKeyMutation(queryClient);

	return {
		changePasswordWithDeviceKeyMutation,
		createPassword,
		sessionQuery,
		setupDeviceKeyQuery,
		setupPasswordQuery,
		signInMutation,
		storeDeviceKey,
		recoverDeviceKeyMutation,
		passwordAndStoreDeviceKeyMutation
	};
}
