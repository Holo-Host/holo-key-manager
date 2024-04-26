import {
	SENDER_WEBAPP,
	SIGN_IN,
	SIGN_IN_SUCCESS,
	SIGN_MESSAGE,
	SIGN_MESSAGE_SUCCESS,
	SIGN_OUT,
	SIGN_OUT_SUCCESS,
	SIGN_UP,
	SIGN_UP_SUCCESS
} from '@shared/const';
import { base64ToUint8Array, uint8ArrayToBase64 } from '@shared/helpers';
import { type PubKey, type SignUpSuccessPayload, type SuccessMessageSigned } from '@shared/types';

import {
	checkContentScriptAndBrowser,
	parseMessageAndCheckAction,
	parseMessagePayload,
	sendMessage
} from './helpers';
import type { HoloKeyManagerConfig, IHoloKeyManager } from './types';

const createHoloKeyManager = ({
	happId,
	happName,
	happLogo,
	happUiUrl,
	requireRegistrationCode,
	requireEmail
}: HoloKeyManagerConfig): IHoloKeyManager => {
	const performSignUpAction = async () => {
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

		const { pubKey, email, registrationCode } = parseMessagePayload<SignUpSuccessPayload>(
			response,
			SIGN_UP_SUCCESS
		);

		return {
			pubKey: base64ToUint8Array(pubKey),
			email,
			registrationCode
		};
	};

	const performSignInAction = async () => {
		checkContentScriptAndBrowser();
		const response = await sendMessage({
			action: SIGN_IN,
			payload: {
				happId
			},
			sender: SENDER_WEBAPP
		});

		const { pubKey } = parseMessagePayload<PubKey>(response, SIGN_IN_SUCCESS);

		return {
			pubKey: base64ToUint8Array(pubKey)
		};
	};

	const performSignMessageAction = async (messageToSign: Uint8Array) => {
		checkContentScriptAndBrowser();
		const encodedMessage = uint8ArrayToBase64(messageToSign);
		const response = await sendMessage({
			action: SIGN_MESSAGE,
			payload: {
				message: encodedMessage,
				happId
			},
			sender: SENDER_WEBAPP
		});

		const { signature } = parseMessagePayload<SuccessMessageSigned>(response, SIGN_MESSAGE_SUCCESS);

		return base64ToUint8Array(signature);
	};

	const performSignOutAction = async () => {
		checkContentScriptAndBrowser();
		const response = await sendMessage({
			action: SIGN_OUT,
			payload: {
				happId
			},
			sender: SENDER_WEBAPP
		});

		parseMessageAndCheckAction(response, SIGN_OUT_SUCCESS);
	};

	return {
		signUp: performSignUpAction,
		signIn: performSignInAction,
		signOut: performSignOutAction,
		signMessage: performSignMessageAction
	};
};
export default createHoloKeyManager;
