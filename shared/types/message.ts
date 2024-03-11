import { z } from 'zod';

const BasePayloadSchema = z.object({
	happId: z.string()
});

const SignUpPayloadSchema = BasePayloadSchema.extend({
	happName: z.string(),
	happLogo: z.instanceof(URL),
	happUiUrl: z.instanceof(URL),
	requireRegistrationCode: z.boolean()
});

const MessageSchema = z.discriminatedUnion('action', [
	z.object({
		action: z.literal('SignUp'),
		payload: SignUpPayloadSchema
	}),
	z.object({
		action: z.literal('SignIn'),
		payload: BasePayloadSchema
	}),
	z.object({
		action: z.literal('NoKeyForHapp')
	}),
	z.object({
		action: z.literal('GenericError')
	}),
	z.object({
		action: z.literal('Success')
	}),
	z.object({
		action: z.literal('SuccessWithPayload'),
		payload: z.string()
	})
]);

export type Message = z.infer<typeof MessageSchema>;

export const MessageWithIdSchema = z.intersection(
	MessageSchema,
	z.object({
		id: z.string(),
		appId: z.literal('holo-key-manager')
	})
);

export type MessageWithId = z.infer<typeof MessageWithIdSchema>;

const ResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().optional()
});

export type Response = z.infer<typeof ResponseSchema>;
