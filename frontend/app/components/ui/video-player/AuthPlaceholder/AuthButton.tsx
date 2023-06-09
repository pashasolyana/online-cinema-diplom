import { getMovieUrl } from '@/configs/url.config'
import Link from 'next/link'
import { FC } from 'react'

import styles from './AuthPlaceholder.module.scss'

const AuthButton: FC<{ slug: string }> = ({ slug }) => {
	return (
		<Link href={`/auth?redirect=${getMovieUrl(slug)}`}>
			<a className={styles.btn}>Войти</a>
		</Link>
	)
}

export default AuthButton
