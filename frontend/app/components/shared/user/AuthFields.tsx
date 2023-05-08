import { FC } from 'react'
import { FormState, UseFormRegister } from 'react-hook-form'

import Field from '@/components/ui/form-elements/Field'

import { validEmail } from '@/shared/regex'

interface IAuthFields {
	register: UseFormRegister<any>
	formState: FormState<any>
	isPasswordRequired?: boolean
}

const AuthFields: FC<IAuthFields> = ({
	register,
	formState: { errors },
	isPasswordRequired = false,
}) => {
	return (
		<>
			<Field
				{...register('email', {
					required: 'Почта обязательна.',
					pattern: {
						value: validEmail,
						message: 'Пожалуйста, введите корректную почту.',
					},
				})}
				placeholder="Почта"
				error={errors.email}
			/>
			<Field
				{...register(
					'password',
					isPasswordRequired
						? {
								required: 'Пароль обязателен.',
								minLength: {
									value: 6,
									message: 'Пароль должен быть больше 6 символов.',
								},
						  }
						: {}
				)}
				placeholder="Пароль"
				type="password"
				error={errors.password}
			/>
		</>
	)
}

export default AuthFields
