export type Education = {
	id: string;
	title: string;
	subtitle: string;
	duration: string;
	image?: string | null;
	created_at: string;
	updated_at: string;
};

export const educations: Education[] = [
	{
		id: '1',
		title: 'Informatics Engineering',
		subtitle: 'Universitas Sriwijaya',
		duration: 'Aug 2025 - Present',
		created_at: '2026-08-31',
		updated_at: '2026-09-01',
		image: '/logo/unsri.svg'
	},
	{
		id: '2',
		title: 'Social Sciences Student',
		subtitle: 'MAN 1 Palembang',
		duration: 'Aug 2020 - May 2023',
		created_at: '2026-08-31',
		updated_at: '2026-09-01'
	}
];
