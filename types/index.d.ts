type Message = {
	action: string;
};

type Response = {
	success: boolean;
	message?: string;
};

export type { Message, Response };
