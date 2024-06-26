import { SENDER_WEBAPP, SIGN_IN, SIGN_MESSAGE, SIGN_UP } from '@shared/const';
import { base64ToUint8Array, uint8ArrayToBase64 } from '@shared/helpers';

import { type HoloKeyManagerConfig } from '../src/types';

export const config: HoloKeyManagerConfig = {
	happId: 'test-happ-id',
	happName: 'test-happ-name',
	happLogo: 'test-happ-logo',
	happUiUrl: 'test-happ-ui-url',
	requireRegistrationCode: true,
	requireEmail: true
};

export const createMessage = (action: string, payload: object) => ({
	action,
	payload,
	sender: SENDER_WEBAPP
});

export const createMockResponse = (type: string, message?: Uint8Array) => {
	switch (type) {
		case SIGN_UP:
			return {
				mockResponse: {
					pubKey: 'mockPubKey',
					email: 'mockEmail',
					registrationCode: 'mockRegistrationCode'
				},
				mockResponseParsed: {
					pubKey: base64ToUint8Array('mockPubKey'),
					email: 'mockEmail',
					registrationCode: 'mockRegistrationCode'
				}
			};
		case SIGN_IN:
			return {
				mockResponse: { pubKey: 'mockPubKey' },
				mockResponseParsed: { pubKey: base64ToUint8Array('mockPubKey') }
			};
		case SIGN_MESSAGE:
			return {
				mockResponse: { signature: uint8ArrayToBase64(message!) },
				mockResponseParsed: base64ToUint8Array(uint8ArrayToBase64(message!))
			};
		default:
			throw new Error('Invalid type');
	}
};
