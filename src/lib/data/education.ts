export type Education = {
	id: string;
	title: string;
	subtitle: string;
	duration: string;
	image: string | null;
	created_at: string;
	updated_at: string;
};

export const educations: Education[] = [
	{
		id: '1',
		title: 'Informatics Engineering',
		subtitle: 'Universitas Sriwijaya',
		duration: '2025 - Present',
		created_at: '2026-08-31',
		updated_at: '2026-09-01',
		image: '/logo/unsri.svg'
	}
];
