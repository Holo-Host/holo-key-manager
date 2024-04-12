# Holo Key Manager JS Client

This JavaScript client library facilitates interactions with the Holo Key Manager, streamlining user signup processes and other key management functionalities. For full functionality, ensure the Holo Key Manager browser extension is installed.

## Prerequisites

Before using this library, install the Holo Key Manager extension for your browser:

- Chrome: [Install from Chrome Web Store](https://chrome.google.com/webstore/detail/holo-key-manager/eggfhkdnfdhdpmkfpihjjbnncgmhihce)
- Edge: [Install from Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/jfecdgefjljjfcflgbhgfkbeofjenceh)
- Mozilla: [Install from Firefox Browser Add-ons](https://addons.mozilla.org/en-US/firefox/addon/holo-key-manager/)

## Installation

1. Download the `tgz` file provided by the developer.
2. Include the library in your project by adding the following to your `package.json`:

   ```json
   "dependencies": {
     "holo-key-manager-js-client": "file:<path_to_downloaded_tgz_file>"
   }
   ```

## Usage

To use the library, import and initialize the Holo Key Manager JS Client with your application's details. Then, use the `signUp` method to initiate the signup process.

### Basic Setup

```javascript
import createHoloKeyManager from 'holo-key-manager-js-client';

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
```

### Error Handling

```javascript
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
		NotAuthenticated: 'User is not authenticated. Please sign in.'
	};

	return (
		Object.entries(errorMessages).find(([key, message]) => error.message.includes(key))?.[1] ||
		'An unknown error occurred.'
	);
};
```
