import { createMutation, createQuery, QueryClient } from '@tanstack/svelte-query';

import {
	deriveSignPubKey,
	fetchAndParseAppsList,
	fetchAuthenticatedAppsList,
	handleSuccess,
	sendMessageAndHandleResponse
} from '$helpers';
import {
	APPLICATION_KEYS,
	APPLICATION_SIGNED_IN_KEY,
	APPS_LIST,
	AUTHENTICATED_APPS_LIST,
	LOCAL,
	SENDER_EXTENSION,
	SESSION,
	SIGN_IN_SUCCESS,
	SIGN_UP_SUCCESS
} from '$shared/const';
import { storageService } from '$shared/services';

export function createApplicationKeyMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: async (mutationData: {
			app_key_name: string;
			happId: string;
			email?: string;
			registrationCode?: string;
		}) => {
			const currentAppsList = await fetchAndParseAppsList();

			if (currentAppsList.some((app) => app.keyName === mutationData.app_key_name)) {
				throw new Error('There is already a key with that name');
			}

			storageService.set({
				key: APPS_LIST,
				value: [
					...currentAppsList,
					{
						keyName: mutationData.app_key_name,
						happId: mutationData.happId,
						isDeleted: false
					}
				],
				area: LOCAL
			});

			const currentParsedAuthenticatedAppsListData = await fetchAuthenticatedAppsList();

			const newIndex = currentAppsList.length;

			const updatedAppsList = {
				...currentParsedAuthenticatedAppsListData,
				[mutationData.happId]: newIndex
			};

			const pubKeyObject = await deriveSignPubKey(newIndex);

			storageService.set({
				key: AUTHENTICATED_APPS_LIST,
				value: updatedAppsList,
				area: SESSION
			});

			await sendMessageAndHandleResponse({
				sender: SENDER_EXTENSION,
				action: SIGN_UP_SUCCESS,
				payload: {
					pubKey: pubKeyObject.pubKey,
					...(mutationData.email && { email: mutationData.email }),
					...(mutationData.registrationCode && { registrationCode: mutationData.registrationCode })
				}
			});
		},
		onSuccess: handleSuccess(queryClient, [APPLICATION_KEYS])
	});
}

export function createSignInWithKeyMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: async (signInData: { keyName: string; happId: string }) => {
			const { keyName, happId } = signInData;
			const currentAppsList = await fetchAndParseAppsList();

			const appData = currentAppsList.find(
				(app) => app.happId === happId && app.keyName === keyName
			);

			if (!appData) {
				throw new Error('App not found');
			}

			const currentAuthenticatedAppsListData = await fetchAuthenticatedAppsList();

			const newIndex = currentAppsList.findIndex(
				(app) => app.happId === happId && app.keyName === keyName
			);

			const pubKey = await deriveSignPubKey(newIndex);

			storageService.set({
				key: AUTHENTICATED_APPS_LIST,
				value: {
					...currentAuthenticatedAppsListData,
					[happId]: newIndex
				},
				area: SESSION
			});

			await sendMessageAndHandleResponse({
				sender: SENDER_EXTENSION,
				action: SIGN_IN_SUCCESS,
				payload: pubKey
			});
		},
		onSuccess: handleSuccess(queryClient, [APPLICATION_SIGNED_IN_KEY])
	});
}

export function createSignedInApplicationKeysIndexQuery() {
	return (happId: string) => {
		return createQuery({
			queryKey: [APPLICATION_SIGNED_IN_KEY, happId],
			queryFn: async () => {
				const authenticatedAppsListData = await fetchAuthenticatedAppsList(happId);

				return authenticatedAppsListData[happId];
			}
		});
	};
}

export function createApplicationKeysQuery() {
	return (happId: string) => {
		return createQuery({
			queryKey: [APPLICATION_KEYS, happId],
			queryFn: async () => {
				const currentAppsList = await fetchAndParseAppsList();
				return currentAppsList.filter((app) => app.happId === happId);
			}
		});
	};
}
