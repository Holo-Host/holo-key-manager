import { z } from 'zod';

export const HappIdSchema = z.object({
	happId: z.string()
});

export const HappDetailsSchema = HappIdSchema.extend({
	happName: z.string(),
	happLogo: z.string().optional(),
	happUiUrl: z.string().optional()
});
