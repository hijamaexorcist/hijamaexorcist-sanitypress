import { clinicJsonLdFromContact, getClinicContact } from '@/lib/clinicContact'
import JsonLd from '@/ui/JsonLd'

export default async function ClinicJsonLd() {
	const contact = await getClinicContact()
	return <JsonLd data={clinicJsonLdFromContact(contact)} />
}
