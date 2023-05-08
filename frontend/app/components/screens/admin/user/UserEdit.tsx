import { useUserEdit } from './useUserEdit'
import { IUserEditInput } from './user-edit.interface'
import { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

import AuthFields from '@/components/shared/user/AuthFields'

import AdminNavigation from '@/ui/admin-navigation/AdminNavigation'
import Button from '@/ui/form-elements/Button'
import Heading from '@/ui/heading/Heading'
import SkeletonLoader from '@/ui/skeleton-loader/SkeletonLoader'

import { Meta } from '@/utils/meta'

const UserEdit: FC = () => {
	const { handleSubmit, register, formState, setValue, control } =
		useForm<IUserEditInput>({
			mode: 'onChange',
		})

	const { isLoading, onSubmit } = useUserEdit(setValue)

	return (
		<Meta title="Изменение данных о пользователеr">
			<AdminNavigation />
			<Heading title="Изменение данных о пользователе" />
			<form onSubmit={handleSubmit(onSubmit)} className="admin-form">
				{isLoading ? (
					<SkeletonLoader count={3} />
				) : (
					<>
						<AuthFields
							register={register}
							formState={formState}
							isPasswordRequired={false}
						/>
						<Controller
							name="isAdmin"
							control={control}
							render={({ field }) => (
								<button
									onClick={(e) => {
										e.preventDefault()
										field.onChange(!field.value)
									}}
									className="text-link block mb-7"
								>
									{field.value ? 'Пользователь' : 'Администратор'}
								</button>
							)}
						/>
					</>
				)}

				<Button>Обновить</Button>
			</form>
		</Meta>
	)
}

export default UserEdit
