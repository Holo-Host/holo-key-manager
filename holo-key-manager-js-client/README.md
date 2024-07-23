# Holo Key Manager JS Client

This JavaScript client library facilitates interactions with the Holo Key Manager, streamlining user signup processes and other key management functionalities. For full functionality, ensure the Holo Key Manager browser extension is installed.

## Prerequisites

Before using this library, install the Holo Key Manager extension for your browser:

- Chrome: [Install from Chrome Web Store](https://chrome.google.com/webstore/detail/holo-key-manager/eggfhkdnfdhdpmkfpihjjbnncgmhihce)
- Edge: [Install from Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/jfecdgefjljjfcflgbhgfkbeofjenceh)
- Mozilla: [Install from Firefox Browser Add-ons](https://addons.mozilla.org/en-US/firefox/addon/holo-key-manager/)

## Installation

To install the Holo Key Manager JS Client, you can use npm, yarn, or pnpm as follows:

- Using npm:

  ```
  npm install @holo-host/holo-key-manager-js-client
  ```

- Using yarn:

  ```
  yarn add @holo-host/holo-key-manager-js-client
  ```

- Using pnpm:
  ```
  pnpm add @holo-host/holo-key-manager-js-client
  ```

## Usage

To use the library, import and initialize the Holo Key Manager JS Client with your application's details. Then, use the `signUp` method to initiate the signup process.

### Basic Setup

```typescript
import createHoloKeyManager from '@holo-host/holo-key-manager-js-client';

const holoKeyManagerConfig = {
	happId: 'your-happId',
	happName: 'your-happName',
	happLogo: 'https://example.com/happLogo.png',
	happUiUrl: 'https://example.com/ui',
	requireRegistrationCode: true,
	requireRegistrationCode: true
};
const initiateSignUp = async () => {
	const { signUp } = createHoloKeyManager(holoKeyManagerConfig);
	try {
		const { email, registrationCode, pubKey } = await signUp();
		console.log(
			'SignUp successful. Email:',
			email,
			'Registration Code:',
			registrationCode,
			'Public Key:',
			pubKey
		);
	} catch (error) {
		handleError(error);
	}
};

const initiateSignIn = async () => {
	const { signIn } = createHoloKeyManager(holoKeyManagerConfig);
	try {
		const { pubKey } = await signIn();
		console.log('SignIn successful. Public Key:', pubKey);
	} catch (error) {
		handleError(error);
	}
};

const initiateSignOut = async () => {
	const { signOut } = createHoloKeyManager(holoKeyManagerConfig);
	try {
		await signOut();
		console.log('SignOut successful');
	} catch (error) {
		handleError(error);
	}
};

const initiateSignMessage = async (message: Uint8Array) => {
	const { signMessage } = createHoloKeyManager(holoKeyManagerConfig);
	try {
		const signedMessage = await signMessage(message);
		console.log('Message signed successfully:', signedMessage);
	} catch (error) {
		handleError(error);
	}
};
```

### Error Handling

```typescript
const handleError = (error) => {
	const errorMessage = getGenericErrorMessage(error);
	console.error(errorMessage);
};

const getGenericErrorMessage = (error) => {
	const errorMessages = {
		'not installed': 'Install the Holo Key Manager extension in Chrome/Edge to proceed.',
		NeedsSetup:
			'Instruct the user to set up the extension, grant necessary permissions, and then reload the page.',
		NoKeyForHapp: 'No existing key found for this happ; initiate the signup flow.',
		AppNotAuthenticated: 'App is not authenticated. Please sign in.',
		ExtensionNotAuthenticated: 'Extension is not authenticated. Please sign in to extension.'
	};

	return (
		Object.entries(errorMessages).find(([key, message]) => error.message.includes(key))?.[1] ||
		'An unknown error occurred.'
	);
};
```

## API reference

```typescript
class HoloKeyManagerExtensionClient {
    constructor({happId: string, happName: String, happLogo: Url, happUiUrl: Url, requireRegistrationCode: boolean, requireEmail:boolean})

    async signIn(): Promise<pubKey: Uint8Array> {} // throws errors

    async signUp(): Promise<{ email?: string, registration_code?: string, pubkey: Uint8Array }> {} // returns Promise of email and registration code if required in constructor, throws errors
    async logOut() {} // throws errors

    async signMessage(payload: Uint8Array): Promise<Uint8Array> {} // returns Promise of signature, throws errors

    on('authorized', (Uint8Array, boolean) => void): UnsubscribeFunction {}
    on('rejected', () => void): UnsubscribeFunction {}
}

type UnsubscribeFunction = () => void;
```

## Working on holo-key-manager-js-client

If you want to work on the interaction between the extension and the client, you need to run the `buildPack` script inside the `holo-key-manager-js-client` directory. This will create a `.tgz` file that you can link to your new web app.

1. **Build the client package:**

   ```sh
   cd holo-key-manager-js-client
   pnpm buildPack
   ```

2. **Create a new web app:**

   You can use any framework of your choice. Here are examples for Create React App and a new Svelte project.

   **Create React App:**

   ```sh
   npx create-react-app my-holo-app
   cd my-holo-app
   ```

   **New Svelte Project:**

   ```sh
   npx degit sveltejs/template my-holo-app
   cd my-holo-app
   pnpm install
   ```

3. **Link the `.tgz` file:**

   After building the client package, link the generated `.tgz` file to your new web app.

   ```sh
   pnpm add ../holo-key-manager-js-client/holo-key-manager-js-client-1.0.0.tgz
   ```

4. **Call API functions:**

   You can now call the API functions defined in the `README` of `holo-key-manager-js-client`. Here is an example of how to use the API in your new web app.

By following these steps, you can set up a new web app and interact with the Holo Key Manager extension using the `holo-key-manager-js-client` API.
