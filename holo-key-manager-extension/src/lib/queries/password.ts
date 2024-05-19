import { createMutation, createQuery, type QueryClient } from '@tanstack/svelte-query';
import { get } from 'svelte/store';

import {
	getExtensionSession,
	getPassword,
	handleSuccess,
	hashPassword,
	sendMessageAndHandleResponse,
	verifyPassword
} from '$helpers';
import { lockKey, unlockKey } from '$services';
import {
	DEVICE_KEY,
	EXTENSION_SESSION,
	LOCAL,
	PASSWORD,
	SENDER_EXTENSION,
	SETUP_EXTENSION_SESSION,
	SETUP_KEY,
	SETUP_PASSWORD
} from '$shared/const';
import { getDeviceKey, storageService } from '$shared/services';
import { deviceKeyContentStore, passphraseStore, passwordStore } from '$stores';

const storePassword = async (password: string) => {
	const hashSalt = await hashPassword(password);
	return storageService.set({
		key: PASSWORD,
		value: hashSalt,
		area: LOCAL
	});
};

export function createSetupPasswordQuery() {
	return createQuery({
		queryKey: [SETUP_PASSWORD],
		queryFn: async () => {
			const parsedResult = await getPassword();
			return parsedResult.success;
		}
	});
}

export function createIsSignedInToExtensionQuery() {
	return createQuery({
		queryKey: [EXTENSION_SESSION],
		queryFn: async () => {
			try {
				const session = await getExtensionSession();
				return !!session;
			} catch (e) {
				return false;
			}
		}
	});
}

export function createPasswordMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: storePassword,
		onSuccess: handleSuccess(queryClient, [SETUP_PASSWORD])
	});
}

export function createPasswordAndStoreDeviceKeyMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: async (password: string) => {
			const deviceKey = get(deviceKeyContentStore);
			const passphrase = get(passphraseStore);
			if (!deviceKey) throw new Error('Something went wrong');

			const decryptedKey = await unlockKey(deviceKey, passphrase);
			await storePassword(password);

			storageService.set({
				key: DEVICE_KEY,
				value: await lockKey(decryptedKey, password),
				area: LOCAL
			});
			decryptedKey.zero();
			deviceKeyContentStore.clean();
			passphraseStore.clean();
			passwordStore.reset();
			await sendMessageAndHandleResponse({
				sender: SENDER_EXTENSION,
				action: SETUP_EXTENSION_SESSION,
				payload: undefined
			});
		},
		onSuccess: handleSuccess(queryClient, [SETUP_KEY])
	});
}

export function createSignInMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: async (password: string) => {
			const parsedResult = await getPassword();
			if (!parsedResult.success || !(await verifyPassword(password, parsedResult.data)))
				throw new Error('Invalid password or data');

			await sendMessageAndHandleResponse({
				sender: SENDER_EXTENSION,
				action: SETUP_EXTENSION_SESSION,
				payload: password
			});
		},
		onSuccess: handleSuccess(queryClient, [EXTENSION_SESSION])
	});
}

export function createChangePasswordWithDeviceKeyMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: async (mutationData: { newPassword: string; oldPassword: string }) => {
			const parsedResult = await getPassword();

			if (
				!parsedResult.success ||
				!(await verifyPassword(mutationData.oldPassword, parsedResult.data))
			) {
				throw new Error('Invalid password');
			}

			const deviceKey = await getDeviceKey();

			const decryptedKey = await unlockKey(deviceKey, mutationData.oldPassword);

			await storePassword(mutationData.newPassword);

			storageService.set({
				key: DEVICE_KEY,
				value: await lockKey(decryptedKey, mutationData.newPassword),
				area: LOCAL
			});
			decryptedKey.zero();

			await sendMessageAndHandleResponse({
				sender: SENDER_EXTENSION,
				action: SETUP_EXTENSION_SESSION,
				payload: undefined
			});
		},

		onSuccess: handleSuccess(queryClient, [EXTENSION_SESSION])
	});
}
