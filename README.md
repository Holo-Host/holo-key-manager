# Holo Key Manager

![Client Build](https://github.com/holo-host/holo-key-manager/actions/workflows/client.yaml/badge.svg)
![Chrome Release](https://github.com/holo-host/holo-key-manager/actions/workflows/extension.yaml/badge.svg?job=chrome-release)
![Firefox Release](https://github.com/holo-host/holo-key-manager/actions/workflows/extension.yaml/badge.svg?job=firefox-release)
![Edge Release](https://github.com/holo-host/holo-key-manager/actions/workflows/extension.yaml/badge.svg?job=edge-release)
![License](https://img.shields.io/badge/license-MIT-blue)

## Description

Holo Key Manager is a browser extension for generating and managing Holochain application keys, and using them with applications hosted on the Holo Network. Users install the extension and perform a one-time setup. They can then use a "passwordless" sign up and log in with compatible applications. Non-sensitive data is cloud-synced so that a user can maintain the same set of keys across multiple devices.

## Usage

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

## Testing

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
