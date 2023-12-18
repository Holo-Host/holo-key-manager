import type { Message } from '../../types';
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

const createHoloKeyManager = (): IHoloKeyManager => {
	const sendMessage = (message: Message): Promise<Response> =>
		new Promise((resolve, reject) => {
			chrome.runtime.sendMessage(getBrowserId(), message, (response: Response) => {
				chrome.runtime.lastError
					? reject(new Error(chrome.runtime.lastError.message))
					: resolve(response);
			});
		});

	const openWindow = async (): Promise<void> => {
		try {
			const message: Message = { action: 'openWindow' };
			await sendMessage(message);
		} catch (error) {
			console.error('Failed to open window:', error);
			throw error;
		}
	};

	return { openWindow };
};

export default createHoloKeyManager;
