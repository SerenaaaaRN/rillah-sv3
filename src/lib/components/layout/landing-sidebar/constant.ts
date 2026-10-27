import Certificate from 'phosphor-svelte/lib/Certificate';
import Coffee from 'phosphor-svelte/lib/Coffee';
import House from 'phosphor-svelte/lib/House';
import Rss from 'phosphor-svelte/lib/Rss';
import SignIn from 'phosphor-svelte/lib/SignIn';
import SquaresFour from 'phosphor-svelte/lib/SquaresFour';
import type { Component } from 'svelte';

export type Menu = {
	href: string;
	label: string;
	icon: Component;
	action?: string;
};

export type SidebarMenu = {
	groupLabel?: string;
	menus: Menu[];
};

const generateItems = (isAuthenticated: boolean): Menu[] => {
	return [
		{ href: '/', label: 'Home', icon: House },
		{ href: '/projects', label: 'Project', icon: Coffee },
		{ href: '/certificates', label: 'Certificates', icon: Certificate },
		{ href: '/blog', label: 'Blog', icon: Rss },
		isAuthenticated
			? { href: '/admin', label: 'Dashboard', icon: SquaresFour }
			: { href: '/login', label: 'Login', icon: SignIn }
	];
};

export const getMenu = (isAuthenticated: boolean, mode: 'full' | null = null): SidebarMenu[] => {
	let items = generateItems(isAuthenticated);

	if (mode === null) items = items.filter((item) => !['/login', '/admin'].includes(item.href));

	return [{ groupLabel: '', menus: items }];
};
