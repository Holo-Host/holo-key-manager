import { describe, expect, it } from 'vitest';

import { transformDataToArray } from '../lib/services/key-manager-store';
import { type GetKeysResponse } from '../lib/types';

describe('transformDataToArray', () => {
	it('should transform GetKeysResponse array to ArrayKeyItem array', () => {
		const input: GetKeysResponse[] = [
			{
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
				happId: 'app1-id',
				happName: 'App1',
				keyName: 'key1',
				happLogo: 'logo1.png',
				happUiUrl: 'http://app1.com'
			},
			{
				happId: 'app2-id',
				happName: 'App2',
				keyName: 'key2',
				happLogo: 'logo2.png',
				happUiUrl: 'http://app2.com'
			},
			{
				happId: 'app4-id',
				happName: 'App4',
				keyName: 'key4',
				happLogo: 'logo4.png',
				happUiUrl: 'http://app4.com'
			},
			{
				happId: 'app3-id',
				happName: 'App3',
				keyName: 'key1',
				happLogo: 'logo1.png',
				happUiUrl: 'http://app1.com'
			},

			{
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
