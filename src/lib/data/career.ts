export type Career = {
	id: string;
	title: string;
	company: string;
	subtitle: string;
	duration: string;
	image: string | null;
	created_at: string;
	updated_at: string;
};

export const careers: Career[] = [
	{
		id: '1',
		title: 'Staff Academic PTI',
		company: 'Universitas Sriwijaya',
		subtitle: 'Universitas Sriwijaya',
		duration: 'Feb 2026 - Present',
		created_at: '2026-08-31',
		updated_at: '2026-09-01',
		image: '/logo/hmif.png'
	},
	{
		id: '2',
		title: 'Member — Frontend Developer',
		company: 'GDGoC UNSRI',
		subtitle: 'GDGoC UNSRI',
		duration: 'Jan 2026 - Present',
		created_at: '2026-08-31',
		updated_at: '2026-09-01',
		image: '/logo/gdglogo.png'
	}
];

export type CompanyGroup = {
	name: string;
	items: Career[];
};

export function groupCareersByCompany(list: Career[]): CompanyGroup[] {
	const groups = new Map<string, CompanyGroup>();

	for (const career of list) {
		const key = career.company.trim().toLowerCase();
		const existing = groups.get(key);

		if (existing) {
			existing.items.push(career);
		} else {
			groups.set(key, { name: career.company.trim(), items: [career] });
		}
	}

	return [...groups.values()];
}
