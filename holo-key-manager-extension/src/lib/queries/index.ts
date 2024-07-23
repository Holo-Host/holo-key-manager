import { useQueryClient } from '@tanstack/svelte-query';

import {
	createApplicationKeyMutation,
	createApplicationsListQuery,
	createSignInWithKeyMutation
} from './applicationQueries';
import {
	createGenerateKeys,
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
	const signInMutation = createSignInMutation(queryClient);
	const applicationsListQuery = createApplicationsListQuery();
	const storeDeviceKey = createStoreDeviceKey(queryClient);
	const recoverDeviceKeyMutation = createRecoverDeviceKeyMutation();
	const generateKeysMutation = createGenerateKeys();
	const applicationKeyMutation = createApplicationKeyMutation(queryClient);
	const passwordAndStoreDeviceKeyMutation = createPasswordAndStoreDeviceKeyMutation(queryClient);

	return {
		changePasswordWithDeviceKeyMutation,
		createPassword,
		isSignedInToExtensionQuery,
		setupDeviceKeyQuery,
		setupPasswordQuery,
		signInMutation,
		applicationsListQuery,
		storeDeviceKey,
		applicationKeyMutation,
		recoverDeviceKeyMutation,
		passwordAndStoreDeviceKeyMutation,
		signInWithKeyMutation,
		generateKeysMutation
	};
}
