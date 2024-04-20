// eslint-disable-next-line
const init = require('@holo-host/wasm-key-manager/wasm-key-manager.js');
// eslint-disable-next-line
const wasmKeyManager = require('@holo-host/wasm-key-manager/wasm-key-manager_bg.wasm');

wasmKeyManager()
	.then(({ instance }) => init(instance))
	.then(() => {
		// The functions are now available on the global scope
		self.KeyManager = init.KeyManager;
		self.deriveSeedFrom = init.deriveSeedFrom;
	});
