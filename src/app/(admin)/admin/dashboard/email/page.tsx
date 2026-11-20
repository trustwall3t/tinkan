import EmailForm from '@/app/(admin)/components/form/EmailForm';
import { getAllUsers } from '@/actions/admin/users';

export default async function AdminEmailPage({
	searchParams,
}: {
	searchParams: Promise<{ to?: string; userId?: string }>;
}) {
	const users = await getAllUsers();
	const params = await searchParams;

	const defaultUser = params.userId
		? users.find((u) => u.id === params.userId)
		: undefined;

	const defaultTo = params.to ?? defaultUser?.email;

	return (
		<div className='w-full bg-gray-100/50 py-5 px-5 rounded-lg'>
			<h1 className='text-2xl font-bold mb-2'>Send email</h1>
			<p className='text-sm text-gray-600 mb-6'>
				Email a registered user or any custom address. Messages use the
				standard TinkanTrust email layout.
			</p>
			<div className='bg-white rounded-lg p-6 shadow-sm'>
				<EmailForm
					users={users}
					defaultTo={defaultTo}
					defaultUserId={defaultUser?.id ?? params.userId}
				/>
			</div>
		</div>
	);
}
