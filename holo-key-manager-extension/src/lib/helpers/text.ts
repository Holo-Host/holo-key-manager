export const isValidEmail = (email: string) =>
	/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(email);
