import { SIGN_IN, SIGN_MESSAGE, SIGN_UP } from '@shared/const';
import { uint8ArrayToBase64 } from '@shared/helpers';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { parseMessagePayload, sendMessage } from '../src/helpers';
import createHoloKeyManager from '../src/index';
import { config, createMessage, createMockResponse } from './helpers';

vi.mock('../src/helpers', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...(typeof actual === 'object' && actual !== null ? actual : {}),
		sendMessage: vi.fn(),
		parseMessagePayload: vi.fn(),
		checkContentScriptAndBrowser: vi.fn()
	};
});

describe('createHoloKeyManager', () => {
	let holoKeyManager: ReturnType<typeof createHoloKeyManager>;
	let sendMessageMock: Mock;
	let parseMessagePayloadMock: Mock;

	beforeEach(() => {
		holoKeyManager = createHoloKeyManager(config);
		sendMessageMock = vi.mocked(sendMessage);
		parseMessagePayloadMock = vi.mocked(parseMessagePayload);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should send proper message to sign up', async () => {
		const signUpMessage = createMessage(SIGN_UP, {
			happId: config.happId,
			happName: config.happName,
			happLogo: config.happLogo,
			happUiUrl: config.happUiUrl,
			requireRegistrationCode: config.requireRegistrationCode,
			requireEmail: config.requireEmail
		});
		const { mockResponse, mockResponseParsed } = createMockResponse(SIGN_UP);

		parseMessagePayloadMock.mockReturnValueOnce(mockResponse);

		const result = await holoKeyManager.signUp();

		expect(sendMessageMock).toHaveBeenCalledWith(signUpMessage);
		expect(result).toEqual(mockResponseParsed);
	});

	it('should send proper message to sign in', async () => {
		const signInMessage = createMessage(SIGN_IN, { happId: config.happId });
		const { mockResponse, mockResponseParsed } = createMockResponse(SIGN_IN);

		parseMessagePayloadMock.mockReturnValueOnce(mockResponse);

		const result = await holoKeyManager.signIn();

		expect(sendMessageMock).toHaveBeenCalledWith(signInMessage);
		expect(result).toEqual(mockResponseParsed);
	});

	it('should send proper message object to sign message', async () => {
		const message = Uint8Array.from([1, 2, 3]);
		const signMessageMessage = createMessage(SIGN_MESSAGE, {
			happId: config.happId,
			message: uint8ArrayToBase64(message)
		});
		const { mockResponse, mockResponseParsed } = createMockResponse(SIGN_MESSAGE, message);

		parseMessagePayloadMock.mockReturnValueOnce(mockResponse);

		const result = await holoKeyManager.signMessage(message);

		expect(sendMessageMock).toHaveBeenCalledWith(signMessageMessage);
		expect(result).toEqual(mockResponseParsed);
	});
});
