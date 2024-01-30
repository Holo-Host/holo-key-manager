# Holo Key Manager JS Client

This is a JavaScript client for the Holo Key Manager.

## Install Holo Key Manager

To fully utilize the Holo Key Manager JS Client, you need to install the Holo Key Manager extension for your browser. Here are the links for each browser:

- [Chrome](https://chrome.google.com/webstore/detail/holo-key-manager/eggfhkdnfdhdpmkfpihjjbnncgmhihce)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/jfecdgefjljjfcflgbhgfkbeofjenceh)
- [Mozilla](https://addons.mozilla.org/en-US/firefox/addon/holo-key-manager/)

## Installation and Usage

### Adding the Library

To add this library as a dependency, download the `tgz` file from the developer. Then, add the following to your `package.json`:

```json
"dependencies": {
  "holo-key-manager-js-client": "file:<path_to_your_downloaded_tgz_file>"
}
```

### Testing

```javascript
import createHoloKeyManager from 'holo-key-manager-js-client';

// Create a new instance of the Holo Key Manager
const keyManager = createHoloKeyManager();

// Use the openWindow method
keyManager
	.openWindow()
	.then(() => {
		console.log('Window opened successfully');
	})
	.catch((error) => {
		console.error('Failed to open window:', error);
	});
```
