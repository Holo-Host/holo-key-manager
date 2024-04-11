import {
	SENDER_WEBAPP,
	SIGN_IN,
	SIGN_IN_SUCCESS,
	SIGN_OUT,
	SIGN_OUT_SUCCESS,
	SIGN_UP,
	SIGN_UP_SUCCESS
} from '@shared/const';
import { parseMessageSchema } from '@shared/helpers';
import { type MessageWithId, type SignUpSuccessPayload } from '@shared/types';

import { checkContentScriptAndBrowser, sendMessage } from './helpers';
import type { HoloKeyManagerConfig, IHoloKeyManager } from './types';

const createHoloKeyManager = ({
	happId,
	happName,
	happLogo,
	happUiUrl,
	requireRegistrationCode,
	requireEmail
}: HoloKeyManagerConfig): IHoloKeyManager => {
	const handleResponseWithData = <T>(response: MessageWithId, action: string): T => {
		const parsedMessageSchema = parseMessageSchema(response);

		if ('payload' in parsedMessageSchema.data && parsedMessageSchema.data.action === action) {
			return parsedMessageSchema.data.payload as T;
		} else {
			throw new Error(parsedMessageSchema.data.action);
		}
	};

	const handleResponse = (response: MessageWithId, expectedAction: string): void => {
		const parsedMessageSchema = parseMessageSchema(response);

		if (parsedMessageSchema.data.action !== expectedAction) {
			throw new Error(parsedMessageSchema.data.action);
		}
	};

	const performSignUpAction = async (): Promise<SignUpSuccessPayload> => {
		checkContentScriptAndBrowser();
		const response = await sendMessage({
			action: SIGN_UP,
			payload: {
				happId,
				happName,
				happLogo,
				happUiUrl,
				requireRegistrationCode,
				requireEmail
			},
			sender: SENDER_WEBAPP
		});
		return handleResponseWithData(response, SIGN_UP_SUCCESS);
	};

	const performSignInAction = async (): Promise<SignUpSuccessPayload> => {
		checkContentScriptAndBrowser();
		const response = await sendMessage({
			action: SIGN_IN,
			payload: {
				happId
			},
			sender: SENDER_WEBAPP
		});
		return handleResponseWithData(response, SIGN_IN_SUCCESS);
	};

	const performSignOutAction = async (): Promise<void> => {
		checkContentScriptAndBrowser();
		const response = await sendMessage({
			action: SIGN_OUT,
			payload: {
				happId
			},
			sender: SENDER_WEBAPP
		});
		return handleResponse(response, SIGN_OUT_SUCCESS);
	};

	return {
		signUp: performSignUpAction,
		signIn: performSignInAction,
		signOut: performSignOutAction
	};
};
export default createHoloKeyManager;
