import { z } from 'zod';

const GithubContributionDaySchema = z.object({
	color: z.string(),
	contributionCount: z.number(),
	date: z.string()
});

const GithubWeekSchema = z.object({
	firstDay: z.string(),
	contributionDays: z.array(GithubContributionDaySchema)
});

const GithubMonthSchema = z.object({
	firstDay: z.string(),
	name: z.string(),
	totalWeeks: z.number()
});

export const GithubCalendarSchema = z.object({
	colors: z.array(z.string()),
	totalContributions: z.number(),
	months: z.array(GithubMonthSchema),
	weeks: z.array(GithubWeekSchema)
});

export type GithubContributionDay = z.infer<typeof GithubContributionDaySchema>;
export type GithubWeek = z.infer<typeof GithubWeekSchema>;
export type GithubMonth = z.infer<typeof GithubMonthSchema>;
export type GithubCalendar = z.infer<typeof GithubCalendarSchema>;
