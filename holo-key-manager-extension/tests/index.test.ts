import { describe, expect, it } from 'vitest';

import { transformDataToArray } from '$services';
import { type GetKeysResponse } from '$types';

describe('transformDataToIndexedArray', () => {
	it('should transform GetKeysResponse array to ArrayKeyItem array in proper index order', () => {
		const input: GetKeysResponse[] = [
			{
				newKey: 'uhCAk3aVMxWBcaVJO8w4LNoVKLCYjulCDLFPh4RFaJJCI2iz5ynNi',
				appName: 'Cloud Console',
				installedAppId: 'uhCkkSwHw3d3yz-tg26QxvY0ZZyO85pbmhQXYDwj4mdnQrQx4uF6L',
				appIndex: 1,
				metadata: { keyName: 'Dev key 1', happUiUrl: 'https://cloud-console.dev.holotest.net/' }
			},
			{
				newKey: 'uhCAk92DB69aJS2FS4NbzKpaG4HrKQK2MfvmpUopqRE1q2J9rn5No',
				appName: 'Cloud Console',
				installedAppId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				appIndex: 6,
				metadata: {
					keyName: 'production_3',
					happUiUrl: 'https://cloud-console.holo.host/dashboard'
				}
			},
			{
				newKey: 'uhCAkNfo8VXANXSKhg1oAAei_2J-VfJFaCIuniz_Gjxe3rgQUHECX',
				appName: 'Cloud Console',
				installedAppId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				appIndex: 4,
				metadata: {
					keyName: 'production_1',
					happUiUrl: 'https://cloud-console.holo.host/dashboard'
				}
			},
			{
				newKey: 'uhCAkPRUjoZ9pOuH8wWXGmm56gXgSscIpIN_fPmKVBEUX4zSSqMIN',
				appName: 'Cloud Console',
				installedAppId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				appIndex: 9,
				metadata: { keyName: 'BBB2', happUiUrl: 'https://cloud-console.holo.host/happ' }
			},
			{
				newKey: 'uhCAkS2GZSJDKRx8IN8UOOwO8DHT704oirXRHUSAeJ0HZydGAvRt2',
				appName: 'your-happName',
				installedAppId: 'your-happId1231231',
				appIndex: 12,
				metadata: {
					keyName: '3',
					happLogo: 'https://example.com/logo.png',
					happUiUrl: 'https://example.com/description.html'
				}
			},
			{
				newKey: 'uhCAkbTHwjA2NBT_MlMY69wOvqULf-vjG8TinVnrx2J9KMjiHioPR',
				appName: 'Cloud Console',
				installedAppId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				appIndex: 5,
				metadata: {
					keyName: 'production_2',
					happUiUrl: 'https://cloud-console.holo.host/dashboard'
				}
			},
			{
				newKey: 'uhCAkeHiOOLoU7K2gmowwTbiZtUzqLak0AW6_x5jS6_HtJIi0VbBk',
				appName: 'Cloud Console',
				installedAppId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				appIndex: 8,
				metadata: { keyName: 'BBB1', happUiUrl: 'https://cloud-console.holo.host/happ' }
			},
			{
				newKey: 'uhCAkeUCQ-edtkax_JaVOE-9zLc9HadhZ8zJl7HS5poy5LmI8kgae',
				appName: 'your-happName',
				installedAppId: 'your-happId1231231',
				appIndex: 11,
				metadata: {
					keyName: '2',
					happLogo: 'https://example.com/logo.png',
					happUiUrl: 'https://example.com/description.html'
				}
			},
			{
				newKey: 'uhCAkfdQJJL3AQREM1Lua9B6Z8H_bz6OFA2Qy4wBKTdCelgxIfSNe',
				appName: 'Cloud Console',
				installedAppId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				appIndex: 3,
				metadata: { keyName: 'prod 2', happUiUrl: 'https://cloud-console.holo.host/dashboard' }
			},
			{
				newKey: 'uhCAkjXABrfnTEds9Irmf20fW6z9GmFymWnKDL16uLLPlnmN3y4wQ',
				appName: 'Cloud Console',
				installedAppId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				appIndex: 7,
				metadata: { keyName: 'aaaa1', happUiUrl: 'https://cloud-console.holo.host/happ' }
			},
			{
				newKey: 'uhCAkpy0pdRqsD3Nkpt9b7mqOxPFAT15u9cSE3OgOmXuKiIfJE9c3',
				appName: 'Cloud Console',
				installedAppId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				appIndex: 2,
				metadata: { keyName: 'prod 1', happUiUrl: 'https://cloud-console.holo.host/' }
			},
			{
				newKey: 'uhCAkqK-8ErdVyKVN7QGM5EVXLqdFrCkYF4RMCPIwpt8LclEB7bfQ',
				appName: 'your-happName',
				installedAppId: 'your-happId1231231',
				appIndex: 10,
				metadata: {
					keyName: '1',
					happLogo: 'https://example.com/logo.png',
					happUiUrl: 'https://example.com/description.html'
				}
			}
		];

		const expectedOutput = [
			{
				happId: 'uhCkkSwHw3d3yz-tg26QxvY0ZZyO85pbmhQXYDwj4mdnQrQx4uF6L',
				happName: 'Cloud Console',
				happLogo: undefined,
				newKey: 'uhCAk3aVMxWBcaVJO8w4LNoVKLCYjulCDLFPh4RFaJJCI2iz5ynNi',
				keyName: 'Dev key 1',
				happUiUrl: 'https://cloud-console.dev.holotest.net/'
			},
			{
				happId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				happName: 'Cloud Console',
				happLogo: undefined,
				newKey: 'uhCAkpy0pdRqsD3Nkpt9b7mqOxPFAT15u9cSE3OgOmXuKiIfJE9c3',
				keyName: 'prod 1',
				happUiUrl: 'https://cloud-console.holo.host/'
			},
			{
				happId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				happName: 'Cloud Console',
				happLogo: undefined,
				newKey: 'uhCAkfdQJJL3AQREM1Lua9B6Z8H_bz6OFA2Qy4wBKTdCelgxIfSNe',
				keyName: 'prod 2',
				happUiUrl: 'https://cloud-console.holo.host/dashboard'
			},
			{
				happId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				happName: 'Cloud Console',
				happLogo: undefined,
				newKey: 'uhCAkNfo8VXANXSKhg1oAAei_2J-VfJFaCIuniz_Gjxe3rgQUHECX',
				keyName: 'production_1',
				happUiUrl: 'https://cloud-console.holo.host/dashboard'
			},
			{
				happId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				happName: 'Cloud Console',
				happLogo: undefined,
				newKey: 'uhCAkbTHwjA2NBT_MlMY69wOvqULf-vjG8TinVnrx2J9KMjiHioPR',
				keyName: 'production_2',
				happUiUrl: 'https://cloud-console.holo.host/dashboard'
			},
			{
				happId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				happName: 'Cloud Console',
				happLogo: undefined,
				newKey: 'uhCAk92DB69aJS2FS4NbzKpaG4HrKQK2MfvmpUopqRE1q2J9rn5No',
				keyName: 'production_3',
				happUiUrl: 'https://cloud-console.holo.host/dashboard'
			},
			{
				happId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				happName: 'Cloud Console',
				happLogo: undefined,
				newKey: 'uhCAkjXABrfnTEds9Irmf20fW6z9GmFymWnKDL16uLLPlnmN3y4wQ',
				keyName: 'aaaa1',
				happUiUrl: 'https://cloud-console.holo.host/happ'
			},
			{
				happId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				happName: 'Cloud Console',
				happLogo: undefined,
				newKey: 'uhCAkeHiOOLoU7K2gmowwTbiZtUzqLak0AW6_x5jS6_HtJIi0VbBk',
				keyName: 'BBB1',
				happUiUrl: 'https://cloud-console.holo.host/happ'
			},
			{
				happId: 'uhCkkJlEYXJyglP3ECCNBobeeEp-z85CVm_SsViHpxDyPK6Mzzkyp',
				happName: 'Cloud Console',
				happLogo: undefined,
				newKey: 'uhCAkPRUjoZ9pOuH8wWXGmm56gXgSscIpIN_fPmKVBEUX4zSSqMIN',
				keyName: 'BBB2',
				happUiUrl: 'https://cloud-console.holo.host/happ'
			},
			{
				happId: 'your-happId1231231',
				happName: 'your-happName',
				happLogo: 'https://example.com/logo.png',
				newKey: 'uhCAkqK-8ErdVyKVN7QGM5EVXLqdFrCkYF4RMCPIwpt8LclEB7bfQ',
				keyName: '1',
				happUiUrl: 'https://example.com/description.html'
			},
			{
				happId: 'your-happId1231231',
				happName: 'your-happName',
				happLogo: 'https://example.com/logo.png',
				newKey: 'uhCAkeUCQ-edtkax_JaVOE-9zLc9HadhZ8zJl7HS5poy5LmI8kgae',
				keyName: '2',
				happUiUrl: 'https://example.com/description.html'
			},
			{
				happId: 'your-happId1231231',
				happName: 'your-happName',
				happLogo: 'https://example.com/logo.png',
				newKey: 'uhCAkS2GZSJDKRx8IN8UOOwO8DHT704oirXRHUSAeJ0HZydGAvRt2',
				keyName: '3',
				happUiUrl: 'https://example.com/description.html'
			}
		];

		expect(transformDataToArray(input)).toEqual(expectedOutput);
	});
});
