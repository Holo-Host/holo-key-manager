import { createMutation, createQuery, QueryClient } from '@tanstack/svelte-query';

import { DEEP_KEY_AGENT_OFFSET } from '$const';
import {
	deriveSignPubKey,
	deriveSignPubKeyWithExternalEncoding,
	fetchAuthenticatedAppsList,
	fetchKeys,
	getDeepKeyAgentPubKeyWithExternalEncoding,
	handleSuccess,
	sendMessageAndHandleResponse,
	signWithDeepKeyAgent
} from '$helpers';
import { createRegisterKeyBody, registerKey } from '$services';
import {
	APPLICATION_KEYS,
	APPLICATION_SIGNED_IN_KEY,
	AUTHENTICATED_APPS_LIST,
	SENDER_EXTENSION,
	SESSION,
	SIGN_IN_SUCCESS,
	SIGN_UP_SUCCESS
} from '$shared/const';
import { storageService } from '$shared/services';
import type { ArrayKeyItem } from '$types';

export function createApplicationKeyMutation(queryClient: QueryClient) {
	return createMutation({
		mutationFn: async (mutationData: {
			currentAppsList: ArrayKeyItem[];
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
			const currentParsedAuthenticatedAppsListData = await fetchAuthenticatedAppsList();

			const newIndex = mutationData.currentAppsList.length + DEEP_KEY_AGENT_OFFSET;

			const devicePubKeyExternal = await getDeepKeyAgentPubKeyWithExternalEncoding();

			const pubKeyObjectExternal = await deriveSignPubKeyWithExternalEncoding(newIndex);

			const pubKeyObject = await deriveSignPubKey(newIndex);

			const registerKeyBody = createRegisterKeyBody({
				deepkeyAgent: devicePubKeyExternal.pubKey,
				newKey: pubKeyObjectExternal.pubKey,
				appName: mutationData.happName,
				installedAppId: mutationData.happId,
				appIndex: newIndex,
				dnaHashes: [''],
				keyName: mutationData.app_key_name,
				happLogo: mutationData.happLogo,
				happUiUrl: mutationData.happUiUrl
			});

			const signedPostMessage = await signWithDeepKeyAgent(registerKeyBody);

			await registerKey(registerKeyBody, signedPostMessage.signature);

			const updatedAppsList = {
				...currentParsedAuthenticatedAppsListData,
				[mutationData.happId]: {
					index: newIndex,
					origin: mutationData.origin
				}
			};

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
			currentAppsList: ArrayKeyItem[];
			keyName: string;
			happId: string;
			messageId: string;
			origin: string;
		}) => {
			const { currentAppsList, keyName, happId, messageId, origin } = signInData;

			const appData = currentAppsList.find(
				(app) => app.happId === happId && app.keyName === keyName
			);

			if (!appData) {
				throw new Error('App not found');
			}

			const currentAuthenticatedAppsListData = await fetchAuthenticatedAppsList();

			const index = currentAppsList.findIndex(
				(app) => app.happId === happId && app.keyName === keyName
			);

			const appIndex = index + DEEP_KEY_AGENT_OFFSET;

			const pubKey = await deriveSignPubKey(appIndex);

			storageService.set({
				key: AUTHENTICATED_APPS_LIST,
				value: {
					...currentAuthenticatedAppsListData,
					[happId]: {
						index: appIndex,
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

export function createApplicationsListQuery() {
	return createQuery({
		queryKey: [APPLICATION_KEYS],
		queryFn: fetchKeys
	});
}
