import { useQueryClient } from '@tanstack/svelte-query';

import {
	createApplicationKeyMutation,
	createApplicationKeysQuery,
	createSignInWithKeyMutation
} from './applicationQueries';
import {
	createRecoverDeviceKeyMutation,
	createSessionQuery,
	createSetupDeviceKeyQuery,
	createStoreDeviceKey
} from './extensionQueries';
import {
	createChangePasswordWithDeviceKeyMutation,
	createPasswordAndStoreDeviceKeyMutation,
	createPasswordMutation,
	createSetupPasswordQuery,
	createSignInMutation
} from './password';

export function appQueries() {
	const queryClient = useQueryClient();
	const changePasswordWithDeviceKeyMutation =
		createChangePasswordWithDeviceKeyMutation(queryClient);
	const createPassword = createPasswordMutation(queryClient);
	const signInWithKeyMutation = createSignInWithKeyMutation(queryClient);
	const sessionQuery = createSessionQuery();
	const setupDeviceKeyQuery = createSetupDeviceKeyQuery();
	const setupPasswordQuery = createSetupPasswordQuery();
	const applicationKeysQueryFunction = createApplicationKeysQuery();
	const signInMutation = createSignInMutation(queryClient);
	const storeDeviceKey = createStoreDeviceKey(queryClient);
	const recoverDeviceKeyMutation = createRecoverDeviceKeyMutation();
	const applicationKeyMutation = createApplicationKeyMutation(queryClient);
	const passwordAndStoreDeviceKeyMutation = createPasswordAndStoreDeviceKeyMutation(queryClient);

	return {
		changePasswordWithDeviceKeyMutation,
		createPassword,
		sessionQuery,
		setupDeviceKeyQuery,
		setupPasswordQuery,
		signInMutation,
		storeDeviceKey,
		applicationKeyMutation,
		recoverDeviceKeyMutation,
		passwordAndStoreDeviceKeyMutation,
		applicationKeysQueryFunction,
		signInWithKeyMutation
	};
}
