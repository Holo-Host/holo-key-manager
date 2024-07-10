import { ZodSchema } from 'zod';

import {
	type ArrayKeyItem,
	ArrayKeyItemSchema,
	type GetKeysObjectParams,
	GetKeysObjectParamsSchema,
	type GetKeysResponse,
	GetKeysResponseSchema,
	type RegisterKeyInput,
	RegisterKeySchema
} from '$types';

const validateData = <T>(schema: ZodSchema<T>, data: unknown): T => {
	const validationResult = schema.safeParse(data);
	if (!validationResult.success) {
		throw new Error(`Invalid data: ${validationResult.error.message}`);
	}
	return validationResult.data;
};

const fetchWithValidation = async (url: string, options: RequestInit, errorMessage: string) => {
	const response = await fetch(url, options);
	if (!response.ok) {
		throw new Error(`${errorMessage}. Status: ${response.status}`);
	}
	return response;
};

const createRequestBody = <T>(schema: ZodSchema<T>, data: unknown): T =>
	validateData<T>(schema, data);

const sendRequest = async (
	url: string,
	method: string,
	body: unknown,
	signature: string,
	errorMessage: string
) =>
	fetchWithValidation(
		url,
		{
			method,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: signature
			},
			body: JSON.stringify(body)
		},
		errorMessage
	);

export const createRegisterKeyBody = (data: unknown) =>
	createRequestBody<RegisterKeyInput>(RegisterKeySchema, data);

export const registerKey = async (data: RegisterKeyInput, signature: string) => {
	await sendRequest(
		'https://key-manager-store.holo.host/api/v1/register-key',
		'POST',
		data,
		signature,
		'Failed to register key'
	);
};

export const createGetKeysObjectParams = (data: unknown): GetKeysObjectParams =>
	createRequestBody<GetKeysObjectParams>(GetKeysObjectParamsSchema, data);

const mapItemToNewItem = (item: GetKeysResponse): ArrayKeyItem => ({
	newKey: item.newKey,
	happId: item.installedAppId,
	happName: item.appName,
	keyName: item.metadata.keyName,
	happLogo: item.metadata.happLogo,
	happUiUrl: item.metadata.happUiUrl
});

const sortByAppIndex = (a: GetKeysResponse, b: GetKeysResponse) => a.appIndex - b.appIndex;

const transformItem = (item: GetKeysResponse): ArrayKeyItem => {
	const newItem = mapItemToNewItem(item);
	ArrayKeyItemSchema.parse(newItem);
	return newItem;
};

export const transformDataToArray = (data: GetKeysResponse[]): ArrayKeyItem[] =>
	data.sort(sortByAppIndex).map(transformItem);

export const getKeys = async (params: GetKeysObjectParams, signature: string) => {
	try {
		const response = await sendRequest(
			'https://key-manager-store.holo.host/api/v1/data-object',
			'POST',
			params,
			signature,
			'Failed to fetch data object'
		);

		const json = await response.json();
		const data = validateData<GetKeysResponse[]>(GetKeysResponseSchema.array(), json);

		return transformDataToArray(data);
	} catch (error) {
		if (error instanceof Error && error.message.includes('Status: 404')) {
			return [];
		}
		throw error;
	}
};
