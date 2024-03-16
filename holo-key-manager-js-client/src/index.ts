import { SENDER_WEBAPP, SIGN_IN, SIGN_UP } from '@sharedConst';
import type { Message } from '@sharedTypes';

import { checkContentScriptAndBrowser, sendMessage } from './helpers';
import type { IHoloKeyManager } from './types';

const createHoloKeyManager = ({
	happId,
	happName,
	happLogo,
	happUiUrl,
	requireRegistrationCode
}: {
	happId: string;
	happName: string;
	happLogo: string;
	happUiUrl: string;
	requireRegistrationCode: boolean;
}): IHoloKeyManager => {
	const signUp = async () => {
		checkContentScriptAndBrowser();
		const message: Message = {
			action: SIGN_UP,
			payload: {
				happId,
				happName,
				happLogo,
				happUiUrl,
				requireRegistrationCode
			},
			sender: SENDER_WEBAPP
		};
		return sendMessage(message);
	};

	const signIn = async () => {
		checkContentScriptAndBrowser();
		const message: Message = { action: SIGN_IN, payload: { happId }, sender: SENDER_WEBAPP };
		return sendMessage(message);
	};

	return { signUp, signIn };
};

export default createHoloKeyManager;
