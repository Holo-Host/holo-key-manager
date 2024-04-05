import { SENDER_WEBAPP, SIGN_IN, SIGN_IN_SUCCESS, SIGN_UP, SIGN_UP_SUCCESS } from '@shared/const';
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
	const handleSignUpResponse = (response: MessageWithId): SignUpSuccessPayload => {
		const parsedMessageSchema = parseMessageSchema(response);

		if (parsedMessageSchema.data.action === SIGN_UP_SUCCESS) {
			return parsedMessageSchema.data.payload as SignUpSuccessPayload;
		} else {
			throw new Error(parsedMessageSchema.data.action);
		}
	};

	const handleSignInResponse = (response: MessageWithId): void => {
		const parsedMessageSchema = parseMessageSchema(response);

		if (parsedMessageSchema.data.action !== SIGN_IN_SUCCESS) {
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
		return handleSignUpResponse(response);
	};

	const performSignInAction = async (): Promise<void> => {
		checkContentScriptAndBrowser();
		const response = await sendMessage({
			action: SIGN_IN,
			payload: {
				happId
			},
			sender: SENDER_WEBAPP
		});
		return handleSignInResponse(response);
	};

	return { signUp: performSignUpAction, signIn: performSignInAction };
};
export default createHoloKeyManager;
