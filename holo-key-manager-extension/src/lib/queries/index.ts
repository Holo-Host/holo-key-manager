import { useQueryClient } from '@tanstack/svelte-query';

import {
	createAllApplicationsQuery,
	createApplicationKeyMutation,
	createApplicationKeysQuery,
	createSignInWithKeyMutation
} from './applicationQueries';
import {
	createRecoverDeviceKeyMutation,
	createSetupDeviceKeyQuery,
	createStoreDeviceKey
} from './extensionQueries';
import {
	createChangePasswordWithDeviceKeyMutation,
	createIsSignedInToExtensionQuery,
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
	const isSignedInToExtensionQuery = createIsSignedInToExtensionQuery();
	const setupDeviceKeyQuery = createSetupDeviceKeyQuery();
	const setupPasswordQuery = createSetupPasswordQuery();
	const applicationKeysQueryFunction = createApplicationKeysQuery();
	const signInMutation = createSignInMutation(queryClient);
	const storeDeviceKey = createStoreDeviceKey(queryClient);
	const allApplicationsQuery = createAllApplicationsQuery();
	const recoverDeviceKeyMutation = createRecoverDeviceKeyMutation();
	const applicationKeyMutation = createApplicationKeyMutation(queryClient);
	const passwordAndStoreDeviceKeyMutation = createPasswordAndStoreDeviceKeyMutation(queryClient);

	return {
		changePasswordWithDeviceKeyMutation,
		createPassword,
		isSignedInToExtensionQuery,
		setupDeviceKeyQuery,
		setupPasswordQuery,
		signInMutation,
		storeDeviceKey,
		applicationKeyMutation,
		recoverDeviceKeyMutation,
		passwordAndStoreDeviceKeyMutation,
		applicationKeysQueryFunction,
		allApplicationsQuery,
		signInWithKeyMutation
	};
}
