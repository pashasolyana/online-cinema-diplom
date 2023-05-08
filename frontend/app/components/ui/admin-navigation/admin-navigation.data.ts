import { getAdminHomeUrl, getAdminUrl } from '@/configs/url.config'

import { INavItem } from './admin-navigation.interface'

export const navItems: INavItem[] = [
	{
		title: 'Статистика',
		link: getAdminHomeUrl(),
	},
	{
		title: 'Пользователи',
		link: getAdminUrl('users'),
	},
	{
		title: 'Фильмы',
		link: getAdminUrl('movies'),
	},
	{
		title: 'Актёры',
		link: getAdminUrl('actors'),
	},
	{
		title: 'Жанры',
		link: getAdminUrl('genres'),
	},
]
