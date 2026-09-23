import Brain from 'phosphor-svelte/lib/Brain';
import Code from 'phosphor-svelte/lib/Code';
import Database from 'phosphor-svelte/lib/Database';
import HardDrive from 'phosphor-svelte/lib/HardDrive';
import Monitor from 'phosphor-svelte/lib/Monitor';
import Robot from 'phosphor-svelte/lib/Robot';
import type { Component } from 'svelte';

export interface SkillCategory {
	name: string;
	skills: string[];
	icon: Component;
}

export const skills_data: SkillCategory[] = [
	{
		name: 'Frontend Development',
		skills: ['React.js', 'Next.js', 'SvelteKit', 'TanStack', 'Tailwind CSS'],
		icon: Monitor
	},
	{
		name: 'Backend Development',
		skills: ['Bun', 'Elysia.js', 'FastAPI'],
		icon: HardDrive
	},
	{
		name: 'Programming Languages',
		skills: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C++'],
		icon: Code
	},
	{
		name: 'Databases',
		skills: ['PostgreSQL', 'MySQL', 'Supabase', 'Drizzle ORM'],
		icon: Database
	},
	{
		name: 'Data Science',
		skills: ['Pandas', 'Scikit-learn', 'Seaborn', 'Matplotlib', 'PyTorch', 'Keras', 'Gradio'],
		icon: Brain
	},
	{
		name: 'AI Tools',
		skills: ['OpenCode', 'Antigravity', 'Claude Code', 'Cursor'],
		icon: Robot
	}
];

export const skills_data_top = [
	'Python',
	'Typescript',
	'Javascript',
	'FastAPI',
	'React.js',
	'Next.js',
	'Tailwind CSS',
	'SvelteKit',
	'Java',
	'Bun',
	'Elysia.js',
	'Claude Code'
];

export const skills_data_bottom = [
	'PostgreSQL',
	'MySQL',
	'Python',
	'Java',
	'SvelteKit',
	'FastAPI',
	'Elysia.js',
	'OpenCode',
	'Antigravity'
];

export const getAllSkills = (): string[] => {
	return skills_data.reduce((acc, category) => {
		return [...acc, ...category.skills];
	}, [] as string[]);
};

export const getSkillsByCategory = (categoryName: string): string[] => {
	const category = skills_data.find((cat) => cat.name === categoryName);
	return category ? category.skills : [];
};

export const searchSkills = (query: string): string[] => {
	const allSkills = getAllSkills();
	return allSkills.filter((skill) => skill.toLowerCase().includes(query.toLowerCase()));
};

export const getRandomSkills = (count: number): string[] => {
	const allSkills = getAllSkills();
	const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
};

export const skillsStats = {
	totalSkills: getAllSkills().length,
	totalCategories: skills_data.length,
	averageSkillsPerCategory: Math.round(getAllSkills().length / skills_data.length),
	categoryWithMostSkills: skills_data.reduce((prev, current) =>
		prev.skills.length > current.skills.length ? prev : current
	).name,
	categoryWithLeastSkills: skills_data.reduce((prev, current) =>
		prev.skills.length < current.skills.length ? prev : current
	).name
};
