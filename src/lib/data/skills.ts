export interface SkillCategory {
	name: string;
	skills: string[];
	icon: string;
	color: string;
}

export const skills_data: SkillCategory[] = [
	{
		name: 'Frontend Development',
		skills: ['ReactJS', 'NextJS', 'Typescript', 'SvelteKit', 'Tailwind CSS', 'Shadcn UI'],
		icon: 'Monitor',
		color: 'from-blue-500 to-cyan-400'
	},
	{
		name: 'Backend Development',
		skills: ['FastAPI', 'Elysia.js'],
		icon: 'Server',
		color: 'from-green-500 to-emerald-400'
	},
	{
		name: 'Programming Languages',
		skills: ['Python', 'Typescript', 'Javascript', 'Java', 'Go', 'C++'],
		icon: 'Code2',
		color: 'from-violet-500 to-purple-400'
	},
	{
		name: 'Databases',
		skills: ['PostgreSQL', 'MySQL', 'Supabase', 'DrizzleORM'],
		icon: 'Database',
		color: 'from-orange-500 to-amber-400'
	},
	{
		name: 'Data Science',
		skills: [
			'NumPy',
			'Pandas',
			'Scikit-learn',
			'PyTorch',
			'Keras',
			'Matplotlib',
			'Seaborn',
			'Gradio'
		],
		icon: 'Brain',
		color: 'from-fuchsia-500 to-pink-400'
	}
];

export const skills_data_top = [
	'React',
	'Next.js',
	'Typescript',
	'Javascript',
	'Python',
	'Tailwind CSS',
	'Shadcn UI',
	'Java',
	'SvelteKit',
	'FastAPI',
	'Bun',
	'Elysia.js'
];

export const skills_data_bottom = [
	'PostgreSQL',
	'MySQL',
	'Go',
	'Python',
	'Java',
	'SvelteKit',
	'FastAPI',
	'Bun',
	'Elysia.js'
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
