import { z } from 'zod';

export const HOLO_KEY_MANAGER_APP_ID = z.literal('holo-key-manager').value;
export const SENDER_WEBAPP = z.literal('webapp').value;
export const SENDER_EXTENSION = z.literal('extension').value;
