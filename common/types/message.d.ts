type BasePayload = {
	happId: string;
};

type SignUpPayload = BasePayload & {
	happName: string;
	happLogo: URL;
	happUiUrl: URL;
	requireRegistrationCode: boolean;
};

type Message =
	| {
			action: 'SignUp';
			payload: SignUpPayload;
	  }
	| {
			action: 'SignIn';
			payload: BasePayload;
	  }
	| {
			action: 'NoKeyForHapp';
	  }
	| {
			action: 'GenericError';
	  }
	| {
			action: 'Success';
	  }
	| {
			action: 'SuccessWithPayload';
			payload: string;
	  };

type Response = {
	success: boolean;
	message?: string;
};

export type { Message, Response };
