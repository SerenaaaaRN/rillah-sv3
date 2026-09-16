export type Menu = {
	href: string;
	label: string;
	icon: string;
};

export type SidebarMenu = {
	groupLabel: string;
	menus: Menu[];
};

export const publicDashboardMenu: SidebarMenu[] = [
	{
		groupLabel: '',
		menus: [
			{ href: '/', label: 'Home', icon: 'House' },
			{ href: '/projects', label: 'Project', icon: 'Coffee' },
			{ href: '/blog', label: 'Blog', icon: 'Rss' },
			{ href: '/certificates', label: 'Certificates', icon: 'Award' }
		]
	}
];

export const mainNavData = (isHaveToken: boolean): Menu[] => [
	{ href: '/', icon: 'House', label: 'Home' },
	{ href: '/projects', icon: 'Coffee', label: 'Project' },
	{ href: '/blog', icon: 'Rss', label: 'Blog' },
	{
		href: isHaveToken ? '/profile' : '/login',
		icon: isHaveToken ? 'User' : 'LogIn',
		label: isHaveToken ? 'Profile' : 'Login'
	}
];
