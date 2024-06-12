import { createMutation, createQuery, QueryClient } from '@tanstack/svelte-query';

import {
	deriveSignPubKey,
	fetchAuthenticatedAppsList,
	getDevicePubKey,
	handleSuccess,
	sendMessageAndHandleResponse,
	signWithDevicePubKey
} from '$helpers';
import { createGetKeysObjectParams, createRegisterKeyBody, getKeys, registerKey } from '$services';
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
import { fetchAndParseAppsList, storageService } from '$shared/services';

export function createApplicationKeyMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: async (mutationData: {
			app_key_name: string;
			happId: string;
			happName: string;
			happLogo: string;
			happUiUrl: string;
			messageId: string;
			origin: string;
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
						happName: mutationData.happName,
						isDeleted: false,
						happLogo: mutationData.happLogo,
						happUiUrl: mutationData.happUiUrl
					}
				],
				area: LOCAL
			});

			const currentParsedAuthenticatedAppsListData = await fetchAuthenticatedAppsList();

			const newIndex = currentAppsList.length;

			const updatedAppsList = {
				...currentParsedAuthenticatedAppsListData,
				[mutationData.happId]: {
					index: newIndex,
					origin: mutationData.origin
				}
			};

			const devicePubKey = await getDevicePubKey();

			const pubKeyObject = await deriveSignPubKey(newIndex);

			const registerKeyBody = createRegisterKeyBody({
				deepkeyAgent: devicePubKey.pubKey,
				newKey: pubKeyObject.pubKey,
				appName: mutationData.happName,
				installedAppId: mutationData.happId,
				appIndex: newIndex,
				dnaHashes: [''],
				keyName: mutationData.app_key_name
			});

			const signedPostMessage = await signWithDevicePubKey(registerKeyBody);

			await registerKey(registerKeyBody, signedPostMessage.signature);

			const getKeysParams = createGetKeysObjectParams({
				deepkeyAgent: devicePubKey.pubKey,
				timestamp: Date.now()
			});

			const signedGetMessage = await signWithDevicePubKey(getKeysParams);

			const fetchedKeys = await getKeys(getKeysParams, signedGetMessage.signature);

			console.log(fetchedKeys);

			await new Promise((resolve) => setTimeout(resolve, 100000));

			storageService.set({
				key: AUTHENTICATED_APPS_LIST,
				value: updatedAppsList,
				area: SESSION
			});

			await sendMessageAndHandleResponse(
				{
					sender: SENDER_EXTENSION,
					action: SIGN_UP_SUCCESS,
					payload: {
						pubKey: pubKeyObject.pubKey,
						...(mutationData.email && { email: mutationData.email }),
						...(mutationData.registrationCode && {
							registrationCode: mutationData.registrationCode
						})
					}
				},
				mutationData.messageId
			);
		},
		onSuccess: handleSuccess(queryClient, [APPLICATION_KEYS])
	});
}

export function createSignInWithKeyMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: async (signInData: {
			keyName: string;
			happId: string;
			messageId: string;
			origin: string;
		}) => {
			const { keyName, happId, messageId, origin } = signInData;
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
					[happId]: {
						index: newIndex,
						origin
					}
				},
				area: SESSION
			});

			await sendMessageAndHandleResponse(
				{
					sender: SENDER_EXTENSION,
					action: SIGN_IN_SUCCESS,
					payload: pubKey
				},
				messageId
			);
		},
		onSuccess: handleSuccess(queryClient, [APPLICATION_SIGNED_IN_KEY])
	});
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

export function createAllApplicationsQuery() {
	return createQuery({
		queryKey: [APPLICATION_KEYS],
		queryFn: async () => {
			const currentAppsList = await fetchAndParseAppsList();

			const appsDetails = currentAppsList.map((app) => ({
				happId: app.happId,
				happName: app.happName,
				happLogo: app.happLogo,
				happUiUrl: app.happUiUrl
			}));

			const uniqueApps = appsDetails.filter(
				(app, index, self) => index === self.findIndex((t) => t.happId === app.happId)
			);

			return uniqueApps;
		}
	});
}
