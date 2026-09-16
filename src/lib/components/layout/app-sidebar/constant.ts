import Certificate from 'phosphor-svelte/lib/Certificate';
import FolderOpen from 'phosphor-svelte/lib/FolderOpen';
import Globe from 'phosphor-svelte/lib/Globe';
import SignOut from 'phosphor-svelte/lib/SignOut';
import SquaresFour from 'phosphor-svelte/lib/SquaresFour';
import type { Component } from 'svelte';

export type NavItem = {
	title: string;
	url: string;
	icon: Component;
	action?: string;
};

export const nav: { title: string; items: NavItem[] }[] = [
	{
		title: 'Menu Utama',
		items: [
			{
				title: 'Dashboard',
				url: '/admin',
				icon: SquaresFour
			},
			{
				title: 'Projects',
				url: '/admin/projects',
				icon: FolderOpen
			},
			{
				title: 'Certificates',
				url: '/admin/certificates',
				icon: Certificate
			}
		]
	},
	{
		title: 'Lainnya',
		items: [
			{
				title: 'Lihat Website',
				url: '/',
				icon: Globe
			},
			{
				title: 'Logout',
				url: '/logout',
				icon: SignOut,
				action: '/logout'
			}
		]
	}
];
