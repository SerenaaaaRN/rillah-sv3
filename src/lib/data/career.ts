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
		title: 'Member — Frontend Developer',
		company: 'GDGoC UNSRI',
		subtitle: 'GDGoC Unsri',
		duration: 'Jan 2026 - Nov 2026',
		created_at: '2026-08-31',
		updated_at: '2026-09-01',
		image: '/logo/gdglogo.avif'
	},
	{
		id: '2',
		title: 'Academic Division Staff',
		company: 'HMIF Unsri',
		subtitle: 'HMIF Unsri',
		duration: 'Feb 2026 - Dec 2026',
		created_at: '2026-08-31',
		updated_at: '2026-09-01',
		image: '/logo/hmif.avif'
	},
	{
		id: '3',
		title: 'PIC Web Development | HMIF Website',
		company: 'HMIF Unsri',
		subtitle:
			'Built official digital platform for HMIF UNSRI 2026 centralizing organizational info, academic opportunities, and internal management systems using TypeScript & Next.js',
		duration: 'Mar 2026 - Apr 2026',
		created_at: '2026-11-06',
		updated_at: '2026-11-06',
		image: null
	},
	{
		id: '4',
		title: 'Curriculum Coordinator',
		company: 'GDGoC Unsri',
		subtitle:
			'Managed curriculum redesign challenge for participants, organized repository, and created module guidelines for participants',
		duration: 'Jun 2026 - Jul 2026',
		created_at: '2026-09-21',
		updated_at: '2026-09-21',
		image: null
	},
	{
		id: '5',
		title: 'Competition Machine Learning Srifoton 2026',
		company: 'HMIF Unsri',
		subtitle:
			'Developed baseline notebooks and designed specialized challenge materials for participants. Evaluated participant submissions focusing on EDA quality, model performance, and adherence to ML best practices',
		duration: 'July 2026 - Okt 2026',
		created_at: '2026-11-06',
		updated_at: '2026-11-06',
		image: null
	},
	{
		id: '6',
		title: 'PIC Programming Training Event',
		company: 'HMIF Unsri',
		subtitle:
			'Vice Chair of HMIF official Java programming initiative for freshmen. Coordinated 10 mentors across 6 weeks of sessions to establish strong coding fundamentals and prepare 150+ participants for upcoming academic coursework',
		duration: 'Sept 2026 - Okt 2026',
		created_at: '2026-11-06',
		updated_at: '2026-11-06',
		image: null
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
