'use server';

import { getAdminSession } from '@/lib/admin-auth';
import { sendCustomEmail } from '@/lib/email';
import { adminEmailSchema } from '../../../schema/adminEmailSchema';
import { z } from 'zod';

export async function sendAdminEmail(data: z.infer<typeof adminEmailSchema>) {
	const session = await getAdminSession();
	if (!session) {
		return { error: 'Unauthorized' };
	}

	const parsed = adminEmailSchema.safeParse(data);
	if (!parsed.success) {
		return { error: parsed.error.errors[0]?.message ?? 'Invalid fields' };
	}

	const result = await sendCustomEmail(
		parsed.data.to,
		parsed.data.subject,
		parsed.data.message
	);

	if (!result.success) {
		return {
			error: result.details
				? `${result.error}: ${result.details}`
				: result.error,
		};
	}

	return { success: 'Email sent successfully' };
}
