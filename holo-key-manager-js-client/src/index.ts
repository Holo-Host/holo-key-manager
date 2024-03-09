import type { Message } from '../../common/types/message';
import type { IHoloKeyManager } from '../types';
// @ts-ignore: The browserConfig will be provided during the prebuild script
import { browserConfig } from './browserConfig';

const getBrowserId = () => {
	if (navigator.userAgent.indexOf('Chrome') !== -1) {
		return browserConfig.ChromeID;
	} else if (navigator.userAgent.indexOf('Firefox') !== -1) {
		return browserConfig.FirefoxID;
	} else if (navigator.userAgent.indexOf('Edge') !== -1) {
		return browserConfig.EdgeID;
	}
	throw new Error('Unsupported browser');
};

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
	const sendMessage = (message: Message): Promise<Message> =>
		new Promise((resolve, reject) => {
			chrome.runtime.sendMessage(getBrowserId(), message, (response: Message) => {
				chrome.runtime.lastError
					? reject(new Error(chrome.runtime.lastError.message))
					: resolve(response);
			});
		});

	const signUp = async (): Promise<void> => {
		try {
			const message: Message = {
				action: 'SignUp',
				payload: { happId, happName, happLogo, happUiUrl, requireRegistrationCode }
			};
			const response = await sendMessage(message);
			console.log('response:', response);
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
		} catch (error) {
			console.error('Failed to signIn:', error);
			throw error;
		}
	};

	return { signUp, signIn };
};

export default createHoloKeyManager;
