'use client';

import { adminEmailSchema } from '../../../../../schema/adminEmailSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormItem,
	FormField,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTransition } from 'react';
import { sendAdminEmail } from '@/actions/admin/sendAdminEmail';
import { Loader } from '@/components/Loader';
import { toast } from 'sonner';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type UserOption = {
	id: string;
	name: string;
	email: string;
};

type EmailFormProps = {
	users: UserOption[];
	defaultTo?: string;
	defaultUserId?: string;
};

const EmailForm = ({ users, defaultTo, defaultUserId }: EmailFormProps) => {
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof adminEmailSchema>>({
		resolver: zodResolver(adminEmailSchema),
		defaultValues: {
			to: defaultTo ?? '',
			subject: '',
			message: '',
		},
	});

	const applyUserRecipient = (userId: string) => {
		if (userId === '__custom__') {
			form.setValue('to', '');
			return;
		}
		const user = users.find((u) => u.id === userId);
		if (user) {
			form.setValue('to', user.email, { shouldValidate: true });
		}
	};

	const onSubmit = (data: z.infer<typeof adminEmailSchema>) => {
		startTransition(async () => {
			const result = await sendAdminEmail(data);
			if (result.error) {
				toast.error(result.error, { position: 'top-right' });
				return;
			}
			toast.success(result.success ?? 'Email sent', {
				position: 'top-right',
			});
			form.reset({
				to: data.to,
				subject: '',
				message: '',
			});
		});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6 max-w-2xl'
			>
				<div className='space-y-2'>
					<FormLabel>Send to user (optional)</FormLabel>
					<Select
						defaultValue={defaultUserId ?? '__custom__'}
						onValueChange={applyUserRecipient}
					>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='Choose a user or enter email below' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='__custom__'>
								Custom email address
							</SelectItem>
							{users.map((user) => (
								<SelectItem
									key={user.id}
									value={user.id}
								>
									{user.name} ({user.email})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<FormField
					control={form.control}
					name='to'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Recipient email</FormLabel>
							<FormControl>
								<Input
									type='email'
									placeholder='user@example.com'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='subject'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Subject</FormLabel>
							<FormControl>
								<Input
									placeholder='Email subject'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='message'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Message</FormLabel>
							<FormControl>
								<textarea
									placeholder='Write your message...'
									rows={10}
									className={cn(
										'border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm',
										'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
									)}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					disabled={isPending}
					className='min-w-[140px]'
				>
					{isPending ? <Loader /> : 'Send email'}
				</Button>
			</form>
		</Form>
	);
};

export default EmailForm;
