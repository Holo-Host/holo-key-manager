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
		const { email, registrationCode } = await signUp();
	} catch (error) {
		handleSignUpError(error);
	}
};
```

### Error Handling

```javascript
const handleSignUpError = (error) => {
	const errorMessage = getErrorMessage(error);
	console.error(errorMessage);
};

const getErrorMessage = (error) => {
	const errorMessages = {
		'permissions are not granted':
			'Ensure the extension is installed and permissions are granted in Firefox.',
		'not installed': 'Install the Holo Key Manager extension in Chrome/Edge to proceed.',
		NeedsSetup: 'Instruct the user to set up the extension before proceeding.',
		NoKeyForHapp: 'No existing key found for this happ; initiate the signup flow.'
	};

	return (
		Object.entries(errorMessages).find(([key, message]) => error.message.includes(key))?.[1] ||
		'An unknown error occurred.'
	);
};
```
