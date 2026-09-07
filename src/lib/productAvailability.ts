import { stegaClean } from 'next-sanity'

export type ProductAvailability = NonNullable<Sanity.Product['availability']>

type ProductAvailabilitySource = Pick<
	Sanity.Product,
	'availability' | 'available'
>

/**
 * Resolves current availability while preserving legacy product documents.
 *
 * Explicit availability wins. A legacy false value remains unavailable;
 * every other missing value defaults to enquire rather than claiming stock.
 */
export function resolveProductAvailability({
	availability,
	available,
}: ProductAvailabilitySource): ProductAvailability {
	const explicitAvailability = stegaClean(availability)

	if (explicitAvailability) return explicitAvailability
	return available === false ? 'unavailable' : 'enquire'
}
