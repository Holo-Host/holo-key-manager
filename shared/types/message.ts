import { z } from 'zod';

import {
	APP_NOT_AUTHENTICATED,
	BACKGROUND_SCRIPT_RECEIVED_DATA,
	EXTENSION_NOT_AUTHENTICATED,
	EXTENSION_SESSION_INFO,
	GENERIC_ERROR,
	GET_EXTENSION_SESSION,
	HOLO_KEY_MANAGER_APP_ID,
	NEEDS_SETUP,
	NO_KEY_FOR_HAPP,
	SENDER_BACKGROUND_SCRIPT,
	SENDER_EXTENSION,
	SENDER_WEBAPP,
	SETUP_EXTENSION_SESSION,
	SIGN_IN,
	SIGN_IN_SUCCESS,
	SIGN_MESSAGE,
	SIGN_MESSAGE_SUCCESS,
	SIGN_OUT,
	SIGN_OUT_SUCCESS,
	SIGN_UP,
	SIGN_UP_SUCCESS,
	UNKNOWN_ACTION
} from '../const';
import { HappDetailsSchema, HappIdSchema } from './general';

const ExtensionSessionPayload = z.string().optional();

export const SuccessMessageSignedSchema = z.object({
	signature: z.string()
});

export type SuccessMessageSigned = z.infer<typeof SuccessMessageSignedSchema>;

export const MessageToSignSchema = HappIdSchema.extend({
	message: z.string()
});

export const SignMessageSchema = MessageToSignSchema.extend({
	session: ExtensionSessionPayload
});

export type SignMessage = z.infer<typeof SignMessageSchema>;

export const PubKeySchema = z.object({
	pubKey: z.string()
});

export type PubKey = z.infer<typeof PubKeySchema>;

const HoloKeyManagerConfigSchema = HappDetailsSchema.extend({
	requireRegistrationCode: z.boolean(),
	requireEmail: z.boolean()
});

export type HoloKeyManagerConfig = z.infer<typeof HoloKeyManagerConfigSchema>;

const SignUpSuccessPayloadSchema = z
	.object({
		email: z.string().optional(),
		registrationCode: z.string().optional()
	})
	.merge(PubKeySchema);

export type SignUpSuccessPayload = z.infer<typeof SignUpSuccessPayloadSchema>;

const MessageBaseSchema = z.object({
	sender: z.union([
		z.literal(SENDER_WEBAPP),
		z.literal(SENDER_EXTENSION),
		z.literal(SENDER_BACKGROUND_SCRIPT)
	])
});

const ActionPayloadSchema = z.union([
	z.object({ action: z.literal(BACKGROUND_SCRIPT_RECEIVED_DATA) }),
	z.object({ action: z.literal(GENERIC_ERROR) }),
	z.object({ action: z.literal(NEEDS_SETUP) }),
	z.object({ action: z.literal(NO_KEY_FOR_HAPP) }),
	z.object({ action: z.literal(APP_NOT_AUTHENTICATED) }),
	z.object({ action: z.literal(EXTENSION_NOT_AUTHENTICATED) }),
	z.object({ action: z.literal(SIGN_MESSAGE), payload: MessageToSignSchema }),
	z.object({ action: z.literal(SETUP_EXTENSION_SESSION), payload: ExtensionSessionPayload }),
	z.object({ action: z.literal(GET_EXTENSION_SESSION) }),
	z.object({ action: z.literal(EXTENSION_SESSION_INFO), payload: ExtensionSessionPayload }),
	z.object({ action: z.literal(SIGN_MESSAGE_SUCCESS), payload: SuccessMessageSignedSchema }),
	z.object({ action: z.literal(SIGN_IN), payload: HappIdSchema }),
	z.object({ action: z.literal(SIGN_IN_SUCCESS), payload: PubKeySchema }),
	z.object({ action: z.literal(SIGN_OUT), payload: HappIdSchema }),
	z.object({ action: z.literal(SIGN_OUT_SUCCESS) }),
	z.object({ action: z.literal(SIGN_UP), payload: HoloKeyManagerConfigSchema }),
	z.object({ action: z.literal(SIGN_UP_SUCCESS), payload: SignUpSuccessPayloadSchema }),
	z.object({ action: z.literal(UNKNOWN_ACTION) })
]);

export type ActionPayload = z.infer<typeof ActionPayloadSchema>;

export const MessageSchema = z.intersection(MessageBaseSchema, ActionPayloadSchema);

export type Message = z.infer<typeof MessageSchema>;

export const MessageWithIdSchema = z.intersection(
	MessageSchema,
	z.object({
		id: z.string(),
		appId: z.literal(HOLO_KEY_MANAGER_APP_ID),
		origin: z.string().optional()
	})
);

export type MessageWithId = z.infer<typeof MessageWithIdSchema>;

const ResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().optional()
});

export type Response = z.infer<typeof ResponseSchema>;
