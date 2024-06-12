import { ZodSchema } from 'zod';

import {
	type GetKeysObjectParams,
	GetKeysObjectParamsSchema,
	type RegisterKeyInput,
	RegisterKeySchema
} from '$types';

const validateInput = <T>(schema: ZodSchema<T>, input: unknown): T => {
	const validationResult = schema.safeParse(input);
	if (!validationResult.success) {
		throw new Error(`Invalid input: ${validationResult.error.message}`);
	}
	return validationResult.data;
};

const fetchWithValidation = async (url: string, options: RequestInit, errorMessage: string) => {
	const response = await fetch(url, options);
	if (!response.ok) {
		throw new Error(errorMessage);
	}
	return response;
};

export const createRegisterKeyBody = (input: unknown) =>
	validateInput<RegisterKeyInput>(RegisterKeySchema, input);

export const registerKey = async (input: RegisterKeyInput, signature: string) => {
	await fetchWithValidation(
		'https://key-manager-store.holo.host/api/v1/register-key',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: signature
			},
			body: JSON.stringify(input)
		},
		'Failed to register key'
	);
};

export const createGetKeysObjectParams = (input: unknown): GetKeysObjectParams =>
	validateInput<GetKeysObjectParams>(GetKeysObjectParamsSchema, input);

export const getKeys = async (params: GetKeysObjectParams, signature: string) => {
	const { deepkeyAgent, timestamp } = params;

	const response = await fetchWithValidation(
		`https://key-manager-store.holo.host/api/v1/data-object/${deepkeyAgent}?timestamp=${timestamp}`,
		{
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: signature
			}
		},
		'Failed to fetch data object'
	);

	return response.json();
};
