import type { MessageWithId } from '@shared/types';

type IHoloKeyManager = {
	signUp(): Promise<MessageWithId>;
	signIn(): Promise<MessageWithId>;
};
export type { IHoloKeyManager };
