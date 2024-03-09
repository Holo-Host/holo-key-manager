import type { Message } from '../../common/types/message';
import type { IHoloKeyManager } from '../types';
import { sendMessage } from './helpers';

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
	const signUp = async (): Promise<void> => {
		try {
			const message: Message = {
				action: 'SignUp',
				payload: { happId, happName, happLogo, happUiUrl, requireRegistrationCode }
			};
			const response = await sendMessage(message);
			console.log('response:', response);
			return response;
		} catch (error) {
			console.error('Failed to signUp:', error);
			throw error;
		}
	};

	const signIn = async (): Promise<void> => {
		try {
			const message: Message = { action: 'SignIn', payload: { happId } };
			const response = await sendMessage(message);
			if (response.action === 'NoKeyForHapp') {
				throw new Error('No key for happ');
			}
			console.log('response:', response);
			return response;
		} catch (error) {
			console.error('Failed to signIn:', error);
			throw error;
		}
	};

	return { signUp, signIn };
};

export default createHoloKeyManager;
