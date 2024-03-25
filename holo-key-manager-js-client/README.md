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
	requireRegistrationCode: true
};

const initiateSignUp = async () => {
	const { signUp } = createHoloKeyManager(holoKeyManagerConfig);
	try {
		const response = await signUp();
		handleSignUpResponse(response);
	} catch (error) {
		handleSignUpError(error);
	}
};
```

### Handling Responses

```javascript
const handleSignUpResponse = (response) => {
	switch (response.action) {
		case 'NeedsSetup':
			// Prompt the user to complete the extension setup, then retry signup.
			break;
		case 'SignUpStarted':
			// Notify the user to follow the extension's instructions, then redirect to login on success.
			break;
		default:
			// Handle other actions or statuses.
			break;
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
	if (error.message.includes('permissions are not granted')) {
		return 'Ensure the extension is installed and permissions are granted in Firefox.';
	} else if (error.message.includes('not installed')) {
		return 'Install the Holo Key Manager extension in Chrome/Edge to proceed.';
	} else {
		return 'An unexpected error occurred. Please try again.';
	}
};
```
