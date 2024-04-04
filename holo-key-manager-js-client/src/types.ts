type HoloKeyManagerConfig = {
	happId: string;
	happName: string;
	happLogo: string;
	happUiUrl: string;
	requireRegistrationCode: boolean;
};
type SignUpSuccessPayload = {
	email: string;
	registrationCode: string;
};

type IHoloKeyManager = {
	signUp(): Promise<SignUpSuccessPayload>;
	signIn(): Promise<void>;
};
export type { HoloKeyManagerConfig, IHoloKeyManager };
