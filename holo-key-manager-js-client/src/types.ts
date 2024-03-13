import type { MessageWithId } from '@sharedTypes';

type IHoloKeyManager = {
	signUp(): Promise<MessageWithId>;
	signIn(): Promise<MessageWithId>;
};
export type { IHoloKeyManager };
