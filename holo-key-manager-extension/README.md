# Holo Key Manager Extension

Holo Key Manager is a secure key manager for creating and managing Holochain keys. Get easy access to all your keys. You can set up and manage one or more keys for each application.

## Overview

The Holo Key Manager Extension is a browser extension designed to manage Holochain keys securely. It facilitates communication between web applications and the Holo Key Manager, ensuring that keys are handled safely and efficiently.

### Features

- Secure key management for Holochain applications.
- Cross-browser compatibility.
- Easy integration with web applications.
- Secure communication between content scripts and web pages.

## Building Extension

```
cd holo-key-manager-extension
pnpm build
```

## Loading Extension Files into Chrome Browser

After building the extension, you need to load it into your Chrome browser to test and use it. Follow these steps:

1. **Open Chrome and navigate to the Extensions page:**

   Open Chrome and go to `chrome://extensions/` or click on the three dots in the upper right corner, then go to `More tools` > `Extensions`.

2. **Enable Developer Mode:**

   In the top right corner of the Extensions page, toggle the switch to enable Developer Mode.

3. **Load the unpacked extension:**

   Click on the "Load unpacked" button that appears after enabling Developer Mode. This will open a file dialog.

4. **Select the build folder:**

   Navigate to the `holo-key-manager-extension/build` directory in your file system and select it. This will load the extension into Chrome.

5. **Verify the extension is loaded:**

   You should see the Holo Key Manager extension listed on the Extensions page. Ensure there are no errors and the extension is enabled.

By following these steps, you can load and test the Holo Key Manager extension in your Chrome browser. If you encounter any issues, check the console for error messages and ensure that the build process completed successfully.

