import { describe, expect, it } from 'vitest';

import { transformDataToArray } from '$services';
import { type GetKeysResponse } from '$types';

describe('transformDataToIndexedArray', () => {
	it('should transform GetKeysResponse array to ArrayKeyItem array in proper index order', () => {
		const input: GetKeysResponse[] = [
			{
				newKey: 'newKey2',
				appName: 'App2',
				installedAppId: 'app2-id',
				appIndex: 1,
				metadata: {
					keyName: 'key2',
					happLogo: 'logo2.png',
					happUiUrl: 'http://app2.com'
				}
			},
			{
				newKey: 'newKey1',
				appName: 'App1',
				installedAppId: 'app1-id',
				appIndex: 0,
				metadata: {
					keyName: 'key1',
					happLogo: 'logo1.png',
					happUiUrl: 'http://app1.com'
				}
			},
			{
				newKey: 'newKey3',
				appName: 'App3',
				installedAppId: 'app3-id',
				appIndex: 3,
				metadata: {
					keyName: 'key1',
					happLogo: 'logo1.png',
					happUiUrl: 'http://app1.com'
				}
			},
			{
				newKey: 'newKey4',
				appName: 'App4',
				installedAppId: 'app4-id',
				appIndex: 2,
				metadata: {
					keyName: 'key4',
					happLogo: 'logo4.png',
					happUiUrl: 'http://app4.com'
				}
			},
			{
				newKey: 'newKey5',
				appName: 'App5',
				installedAppId: 'app5-id',
				appIndex: 4,
				metadata: {
					keyName: 'key5',
					happLogo: 'logo5.png',
					happUiUrl: 'http://app5.com'
				}
			}
		];

		const expectedOutput = [
			{
				newKey: 'newKey1',
				happId: 'app1-id',
				happName: 'App1',
				keyName: 'key1',
				happLogo: 'logo1.png',
				happUiUrl: 'http://app1.com'
			},
			{
				newKey: 'newKey2',
				happId: 'app2-id',
				happName: 'App2',
				keyName: 'key2',
				happLogo: 'logo2.png',
				happUiUrl: 'http://app2.com'
			},
			{
				newKey: 'newKey4',
				happId: 'app4-id',
				happName: 'App4',
				keyName: 'key4',
				happLogo: 'logo4.png',
				happUiUrl: 'http://app4.com'
			},
			{
				newKey: 'newKey3',
				happId: 'app3-id',
				happName: 'App3',
				keyName: 'key1',
				happLogo: 'logo1.png',
				happUiUrl: 'http://app1.com'
			},

			{
				newKey: 'newKey5',
				happId: 'app5-id',
				happName: 'App5',
				keyName: 'key5',
				happLogo: 'logo5.png',
				happUiUrl: 'http://app5.com'
			}
		];

		expect(transformDataToArray(input)).toEqual(expectedOutput);
	});
});
