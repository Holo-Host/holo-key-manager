import { Message } from '../../common/types/message';
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

export const sendMessage = (message: Message) =>
	chrome.runtime.sendMessage(getBrowserId(), message);
