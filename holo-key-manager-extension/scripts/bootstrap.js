// eslint-disable-next-line
const { KeyManager, deriveSeedFrom } = require('@holo-host/wasm-key-manager');
// eslint-disable-next-line
const wasm = require('@holo-host/wasm-key-manager/wasm-key-manager_bg.wasm');

// Initialize the WebAssembly module
wasm().then(() => {
	// The functions are now available on the global scope
	self.KeyManager = KeyManager;
	self.deriveSeedFrom = deriveSeedFrom;
});
