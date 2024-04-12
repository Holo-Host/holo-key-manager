type HoloKeyManagerConfig = {
	happId: string;
	happName: string;
	happLogo: string;
	happUiUrl: string;
	requireRegistrationCode: boolean;
	requireEmail: boolean;
};
type SignUpSuccessPayload = {
	email?: string;
	registrationCode?: string;
	pubKey: string;
};

type SignInSuccessPayload = {
	pubKey: string;
};

type IHoloKeyManager = {
	signUp(): Promise<SignUpSuccessPayload>;
	signIn(): Promise<SignInSuccessPayload>;
	signMessage: (message: string) => Promise<string>;
	signOut(): Promise<void>;
};
export type { HoloKeyManagerConfig, IHoloKeyManager };
