import Certificate from 'phosphor-svelte/lib/Certificate';
import Coffee from 'phosphor-svelte/lib/Coffee';
import House from 'phosphor-svelte/lib/House';
import Rss from 'phosphor-svelte/lib/Rss';
import SignIn from 'phosphor-svelte/lib/SignIn';
import User from 'phosphor-svelte/lib/User';
import type { Component } from 'svelte';

export type Menu = {
	href: string;
	label: string;
	icon: Component;
	action?: string;
};

export type SidebarMenu = {
	groupLabel: string;
	menus: Menu[];
};

export const publicDashboardMenu: SidebarMenu[] = [
	{
		groupLabel: '',
		menus: [
			{ href: '/', label: 'Home', icon: House },
			{ href: '/projects', label: 'Project', icon: Coffee },
			{ href: '/blog', label: 'Blog', icon: Rss },
			{ href: '/certificates', label: 'Certificates', icon: Certificate }
		]
	}
];

export const mainNavData = (isAuthenticated: boolean): Menu[] => [
	{ href: '/', label: 'Home', icon: House },
	{ href: '/projects', label: 'Project', icon: Coffee },
	{ href: '/certificates', label: 'Certificates', icon: Certificate },
	{
		href: isAuthenticated ? '/profile' : '/login',
		label: isAuthenticated ? 'Profile' : 'Login',
		icon: isAuthenticated ? User : SignIn
	}
];
