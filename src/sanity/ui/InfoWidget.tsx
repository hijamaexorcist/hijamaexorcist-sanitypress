'use client'

import { Box, Card, Heading, Label, Stack, Text } from '@sanity/ui'
import type { DashboardWidget, LayoutConfig } from '@sanity/dashboard'

export function InfoWidget({
	layout,
}: {
	layout?: LayoutConfig
	version?: string
} = {}): DashboardWidget {
	return {
		name: 'Guide',
		layout: layout ?? { width: 'medium' },
		component: () => (
			<Card paddingY={4}>
				<Stack space={4}>
					<Box paddingX={3} as="header">
						<Heading size={1} as="h2">
							Hijama Exorcist
						</Heading>
					</Box>

					{linkGroups.map((group, i) => (
						<Stack space={3} key={i}>
							<Card borderBottom padding={3}>
								<Label size={0} muted>
									{group.title}
								</Label>
							</Card>

							{group.links.map((link, key) => (
								<Stack space={4} paddingX={3} key={key}>
									<Text size={1}>
										<a href={link.url} target="_blank" rel="noreferrer">
											{link.label}
										</a>
									</Text>
								</Stack>
							))}
						</Stack>
					))}
				</Stack>
			</Card>
		),
	}
}

const linkGroups: Array<{
	title: string
	links: { label: string; url: string }[]
}> = [
	{
		title: 'Clinic',
		links: [
			{ label: 'Live site', url: 'https://www.hijamaexorcist.com' },
			{ label: 'Booking', url: 'https://www.hijamaexorcist.com/booking' },
			{ label: 'Contact', url: 'https://www.hijamaexorcist.com/contact' },
			{
				label: 'Instagram',
				url: 'https://www.instagram.com/hijama_exorcist/',
			},
		],
	},
	{
		title: 'Studio',
		links: [
			{
				label: 'Sanity project',
				url: 'https://www.sanity.io/manage/project/rgteya6w',
			},
			{
				label: 'GitHub',
				url: 'https://github.com/hijamaexorcist/hijamaexorcist',
			},
		],
	},
]
