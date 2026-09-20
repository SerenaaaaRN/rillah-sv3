import GithubLogo from 'phosphor-svelte/lib/GithubLogo';
import InstagramLogo from 'phosphor-svelte/lib/InstagramLogo';
import LinkedinLogo from 'phosphor-svelte/lib/LinkedinLogo';
import XLogo from 'phosphor-svelte/lib/XLogo';
import type { Component } from 'svelte';

export interface MediaSocial {
	title: string;
	href: string;
	icon: Component;
}

export const media_socials: MediaSocial[] = [
	{
		title: 'GitHub',
		href: 'https://github.com/SerenaaaaRN',
		icon: GithubLogo
	},
	{
		title: 'LinkedIn',
		href: 'https://linkedin.com/in/duhairillah',
		icon: LinkedinLogo
	},
	{
		title: 'Instagram',
		href: 'https://instagram.com/__rillah',
		icon: InstagramLogo
	},
	{
		title: 'Twitter',
		href: 'https://x.com/kareniaRila',
		icon: XLogo
	}
];
