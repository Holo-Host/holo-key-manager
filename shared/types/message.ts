import { z } from 'zod';

import { HOLO_KEY_MANAGER_APP_ID, SENDER_EXTENSION, SENDER_WEBAPP } from '../const';

const BasePayloadSchema = z.object({
	happId: z.string()
});

const SignUpPayloadSchema = BasePayloadSchema.extend({
	happName: z.string(),
	happLogo: z.instanceof(URL),
	happUiUrl: z.instanceof(URL),
	requireRegistrationCode: z.boolean()
});

const MessageBaseSchema = z.object({
	sender: z.union([z.literal(SENDER_WEBAPP), z.literal(SENDER_EXTENSION)])
});

const ActionPayloadSchema = z.union([
	z.object({ action: z.literal('SignUp'), payload: SignUpPayloadSchema }),
	z.object({ action: z.literal('SignIn'), payload: BasePayloadSchema }),
	z.object({ action: z.literal('NoKeyForHapp') }),
	z.object({ action: z.literal('GenericError') }),
	z.object({ action: z.literal('Success') }),
	z.object({ action: z.literal('SuccessWithPayload'), payload: z.string() })
]);

export type ActionPayload = z.infer<typeof ActionPayloadSchema>;

export const MessageSchema = z.intersection(MessageBaseSchema, ActionPayloadSchema);

export type Message = z.infer<typeof MessageSchema>;

export const MessageWithIdSchema = z.intersection(
	MessageSchema,
	z.object({
		id: z.string(),
		appId: z.literal(HOLO_KEY_MANAGER_APP_ID)
	})
);

export type MessageWithId = z.infer<typeof MessageWithIdSchema>;

const ResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().optional()
});

export type Response = z.infer<typeof ResponseSchema>;
