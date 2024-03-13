import { SENDER_WEBAPP } from '@sharedConst';
import type { Message } from '@sharedTypes';

import { sendMessage } from './helpers';
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
	happLogo: URL;
	happUiUrl: URL;
	requireRegistrationCode: boolean;
}): IHoloKeyManager => {
	const signUp = async () => {
		try {
			const message: Message = {
				action: 'SignUp',
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
		} catch (error) {
			console.error('Failed to signUp:', error);
			throw error;
		}
	};

	const signIn = async () => {
		try {
			const message: Message = { action: 'SignIn', payload: { happId }, sender: SENDER_WEBAPP };
			return sendMessage(message);
		} catch (error) {
			console.error('Failed to signIn:', error);
			throw error;
		}
	};

	return { signUp, signIn };
};

export default createHoloKeyManager;
