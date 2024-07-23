# Holo Key Manager

![Client Build](https://github.com/holo-host/holo-key-manager/actions/workflows/client.yaml/badge.svg)
![Chrome Release](https://img.shields.io/github/actions/workflow/status/holo-host/holo-key-manager/extension.yaml?label=Chrome%20Release&logo=google-chrome&style=flat-square&job=chrome-release)
![Firefox Release](https://img.shields.io/github/actions/workflow/status/holo-host/holo-key-manager/extension.yaml?label=Firefox%20Release&logo=firefox-browser&style=flat-square&job=firefox-release)
![Edge Release](https://img.shields.io/github/actions/workflow/status/holo-host/holo-key-manager/extension.yaml?label=Edge%20Release&logo=microsoft-edge&style=flat-square&job=edge-release)
![License](https://img.shields.io/badge/license-MIT-blue)

## Description

Holo Key Manager is a browser extension for generating and managing Holochain application keys, and using them with applications hosted on the Holo Network. Users install the extension and perform a one-time setup. They can then use a "passwordless" sign up and log in with compatible applications. Non-sensitive data is cloud-synced so that a user can maintain the same set of keys across multiple devices.

## Usage

### User Installation

To install the Holo Key Manager Extension, follow the instructions for your browser:

- Chrome: [Install from Chrome Web Store](https://chrome.google.com/webstore/detail/holo-key-manager/eggfhkdnfdhdpmkfpihjjbnncgmhihce)
- Edge: [Install from Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/jfecdgefjljjfcflgbhgfkbeofjenceh)
- Mozilla: [Install from Firefox Browser Add-ons](https://addons.mozilla.org/en-US/firefox/addon/holo-key-manager/)

### Interacting with the Extension

A javascript client library is available at `@holo-host/holo-key-manager-js-client`. See client documentation [here](holo-key-manager-js-client/README.md)

## Architecture

Holo Key Manager is expected to be used for Holo-hosted applications in conjunction with the Chaperone connection manager. The diagram below provides context of how Holo Key Manager interfaces with the rest of the Holo Hosting stack. Note that Deepkey is not currently implemented and is currently substituted by a centralised store.

![Holo Hosting Architecture Diagram](./arch_1.png)

The diagram below depicts the architecture of the Holo Key Manager itself. It demonstrates the client's interaction with the extension and outlines the communication schema between the webapp and the extension API.

![Holo Key Manager Architecture Diagram](./arch_2.png)

## Roadmap

The priority items are:

1. Replace the centralised Cloud Sync component with Deepkey
2. Implement features to interact with Deepkey for key revocation and rotation

## Development Setup

To set up the development environment for the Holo Key Manager monorepo, follow these steps:

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v16 or higher)
- pnpm (v7 or higher)

### Initial Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/holo-host/holo-key-manager.git
   cd holo-key-manager
   ```

2. **Install dependencies:**
   ```sh
   pnpm install
   ```

### Building the Projects

The monorepo consists of two main projects: `holo-key-manager-extension` and `holo-key-manager-js-client`, and a shared directory. You can build these projects using the following commands:

1. **Build the extension:**

   ```sh
   pnpm buildExtension
   ```

   Build artifacts are in the `./holo-key-manager-extension/build` folder

2. **Build the client:**

   ```sh
   pnpm buildClient
   ```

   Build artifacts are in the `./holo-key-manager-js-client/lib` folder

3. **Build both projects for development:**
   ```sh
   pnpm build
   ```

### Linting and Formatting

To ensure code quality and consistency, use the following commands:

1. **Lint the code:**

   ```sh
   pnpm lint
   ```

2. **Format the code:**

   ```sh
   pnpm format
   ```

3. **Run linting and formatting together:**
   ```sh
   pnpm lintAndFormat
   ```

### Project Structure

- **holo-key-manager-js-client:** Contains the JavaScript client library for interacting with the key manager and stored keys.
- **holo-key-manager-extension:** Contains the browser extension for managing Holo keys.

### Workspaces

The monorepo uses pnpm workspaces to manage dependencies and scripts across multiple projects. The workspaces are defined in the root `package.json`:

By following these steps, you should be able to set up and start developing on the Holo Key Manager monorepo. If you encounter any issues or have questions, feel free to reach out to the maintainers.

## Testing

There are three types of tests in this repository:

1. **Unit Tests** for `holo-key-manager-js-client`:

   - Run the unit tests using the command:
     ```sh
     cd holo-key-manager-js-client && pnpm test
     ```

2. **Unit Tests** for `holo-key-manager-extension`:

   - Run the unit tests using the command:
     ```sh
     cd holo-key-manager-extension && pnpm test
     ```

3. **End-to-End (e2e) Tests** for the whole repository:
   - To run e2e tests, you need to create a `.env` file with `CHROME_ID=eggfhkdnfdhdpmkfpihjjbnncgmhihce`
   - The rest of the variables in `.env.example` are for deployment and not necessary for testing
   - Run the e2e tests using the commands:
     ```sh
     pnpm install
     pnpm build
     pnpm e2e-tests
     ```

## License

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Contact

For any questions or support, please contact:

- [@mrruby](https://github.com/mrruby)
- [@alastairong](https://github.com/alastairong)

Feel free to reach out with any questions or suggestions.
