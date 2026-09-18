export type Scene = {
	id: string;
	focus: string;
	text: string;
	image: string;
};

export const SCENES: Scene[] = [
	{
		id: 'scene-1',
		focus: 'OBSERVATION',
		text: 'I pay attention to how people interact with systems. Not the features they use. But the moments when they hesitate.',
		image: '/scroll/scroll1.avif'
	},
	{
		id: 'scene-2',
		focus: 'BEHAVIOR',
		text: 'Crowds behave like software. Many intentions. One shared space. I started watching before I started building.',
		image: '/scroll/scroll2.avif'
	},
	{
		id: 'scene-3',
		focus: 'CLARITY',
		text: "I didn't start with code. I started with questions about clarity. Patterns repeat when the environment stays the same.",
		image: '/scroll/scroll3.avif'
	},
	{
		id: 'scene-4',
		focus: 'EMPATHY',
		text: 'Code became a way to care. For users I may never meet. For teammates I may never see. Empathy, without performance.',
		image: '/scroll/scroll4.avif'
	}
];
