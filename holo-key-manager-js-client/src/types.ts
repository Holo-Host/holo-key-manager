type HoloKeyManagerConfig = {
	happId: string;
	happName: string;
	happLogo?: string;
	happUiUrl?: string;
	requireRegistrationCode: boolean;
	requireEmail: boolean;
};
type SignUpSuccessPayload = {
	email?: string;
	registrationCode?: string;
	pubKey: Uint8Array;
};

type SignInSuccessPayload = {
	pubKey: Uint8Array;
};

type SignMessageSuccessPayload = Uint8Array;

type RawPayload =
	| { pubKey: string; email: string; registrationCode: string }
	| { pubKey: string }
	| { message: string };

type IHoloKeyManager = {
	signUp(): Promise<SignUpSuccessPayload>;
	signIn(): Promise<SignInSuccessPayload>;
	signMessage: (message: Uint8Array) => Promise<Uint8Array>;
	signOut(): Promise<void>;
};
export type {
	HoloKeyManagerConfig,
	IHoloKeyManager,
	RawPayload,
	SignInSuccessPayload,
	SignMessageSuccessPayload,
	SignUpSuccessPayload
};
