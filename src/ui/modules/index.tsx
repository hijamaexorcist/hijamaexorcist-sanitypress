import AccordionList from './AccordionList'
import BlogFrontpage from './blog/BlogFrontpage'
import BlogList from './blog/BlogList'
import BlogPostContent from './blog/PostContent'
import Breadcrumbs from './Breadcrumbs'
import Callout from './Callout'
import CardList from './CardList'
import CustomHTML from './CustomHTML'
import FlagList from './FlagList'
import Hero from './Hero'
import HeroSplit from './HeroSplit'
import HeroSaaS from './HeroSaaS'
import LogoList from './LogoList'
import RichtextModule from './RichtextModule'
import ScheduleModule from './ScheduleModule'
import SearchModule from './SearchModule'
import StatList from './StatList'
import StepList from './StepList'
import TabbedContent from './TabbedContent'
import TestimonialList from './TestimonialList'
import TestimonialFeatured from './TestimonialFeatured'
import TextHighlightModule from './TextHighlightModule'
import ContactFormModule from './ContactFormModule'
import AppointmentFormModule from './appointmentFormModule'
import CareJourney from './CareJourney'
import CareStandards from './CareStandards'
import ClinicMap from './ClinicMap'
import ClinicianProfile from './ClinicianProfile'
import TraditionGuidance from './TraditionGuidance'
import EducationBento from './EducationBento'
import VideoLibrary from './VideoLibrary'
import dynamic from 'next/dynamic'
import { createDataAttribute } from 'next-sanity'

const MODULE_MAP = {
	'accordion-list': AccordionList,
	'blog-frontpage': BlogFrontpage,
	'blog-list': BlogList,
	'blog-post-content': BlogPostContent,
	breadcrumbs: Breadcrumbs,
	callout: Callout,
	'card-list': CardList,
	'creative-module': dynamic(() => import('./CreativeModule')),
	'custom-html': CustomHTML,
	'flag-list': FlagList,
	hero: Hero,
	'hero.split': HeroSplit,
	'hero.saas': HeroSaaS,
	'logo-list': LogoList,
	'person-list': dynamic(() => import('./PersonList')),
	'pricing-list': dynamic(() => import('./PricingList')),
	'richtext-module': RichtextModule,
	'schedule-module': ScheduleModule,
	'search-module': SearchModule,
	'stat-list': StatList,
	'step-list': StepList,
	'tabbed-content': TabbedContent,
	'testimonial-list': TestimonialList,
	'testimonial.featured': TestimonialFeatured,
	'text-highlight-module': TextHighlightModule,
	'contact-form-module': ContactFormModule,
	'appointment-form-module': AppointmentFormModule,
	'care-journey': CareJourney,
	'care-standards': CareStandards,
	'clinic-map': ClinicMap,
	'clinician-profile': ClinicianProfile,
	'tradition-guidance': TraditionGuidance,
	'education-bento': EducationBento,
	'video-library': VideoLibrary,
} as const

export default function Modules({
	modules,
	page,
	post,
}: {
	modules?: Sanity.Module[]
	page?: Sanity.Page
	post?: Sanity.BlogPost
}) {
	const getAdditionalProps = (module: Sanity.Module) => {
		switch (module._type) {
			case 'blog-post-content':
				return { post }
			case 'breadcrumbs':
				return { currentPage: post || page }
			case 'blog-list':
				return { language: page?.language }
			default:
				return {}
		}
	}

	return (
		<>
			{modules?.map((module) => {
				if (!module) return null
				if (module.options?.hidden) return null

				const Component = MODULE_MAP[
					module._type as keyof typeof MODULE_MAP
				] as React.ComponentType<any>

				if (!Component) return null

				return (
					<Component
						{...module}
						{...getAdditionalProps(module)}
						data-sanity={
							!!page?._id &&
							createDataAttribute({
								id: page._id,
								type: page?._type,
								path: `modules[_key == "${module._key}"]`,
							}).toString()
						}
						key={module._key}
					/>
				)
			})}
		</>
	)
}
