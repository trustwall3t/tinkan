import { z } from 'zod';

export const adminEmailSchema = z.object({
	to: z.string().email('Enter a valid email address'),
	subject: z.string().min(1, 'Subject is required').max(200),
	message: z.string().min(1, 'Message is required').max(10000),
});
