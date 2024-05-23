export const PBKDF2_ITERATIONS = 600000;
export const HOLO_KEY_MANAGER_APP_ID = 'holo-key-manager';
export const SENDER_WEBAPP = 'webapp';
export const SENDER_EXTENSION = 'extension';
export const SENDER_BACKGROUND_SCRIPT = 'background-script';

export const HOLO_KEY_MANAGER_EXTENSION_MARKER_ID = 'user-holo-key-manager-extension-marker';

export const relevantKeys = [
	'happId',
	'happName',
	'happUiUrl',
	'happLogo',
	'requireEmail',
	'requireRegistrationCode',
	'message',
	'messageId'
] as const;
