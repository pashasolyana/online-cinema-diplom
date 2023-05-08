import { IMenu } from './menu.types'

const firstMenu: IMenu = {
	title: 'Меню',
	items: [
		{
			icon: 'MdHome',
			link: '/',
			title: 'Главная страница',
		},
		{
			icon: 'MdExplore',
			link: '/genres',
			title: 'Жанры',
		},
		{
			icon: 'MdRefresh',
			link: '/fresh',
			title: 'Новинки',
		},
		{
			icon: 'MdLocalFireDepartment',
			link: '/trending',
			title: 'Популярно сейчас',
		},
	],
}

const userMenu: IMenu = {
	title: 'Основное',
	items: [],
}

export const menus: IMenu[] = [firstMenu, userMenu]
