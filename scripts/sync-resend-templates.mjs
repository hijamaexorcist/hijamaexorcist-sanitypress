#!/usr/bin/env node
/**
 * Create or update the four Hijama Exorcist Resend templates, then publish them.
 * Usage: node --env-file=.env.local scripts/sync-resend-templates.mjs
 */

const FROM = 'Hijama Exorcist <hello@hijamaexorcist.com>'
const REPLY_TO = 'hello@hijamaexorcist.com'

function shell({ title, preheader, intro, body, footer }) {
	return `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
  </head>
  <body style="margin:0;background:#f4f2eb;font-family:Arial,Helvetica,sans-serif;color:#173c32">
    <div lang="en" dir="ltr">
      <div style="display:none;max-height:0;overflow:hidden">${preheader}</div>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f4f2eb">
        <tr>
          <td align="center" style="padding:32px 16px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="620" style="max-width:620px;width:100%">
              <tr>
                <td style="background:#173c32;border-radius:18px 18px 0 0;padding:24px 28px;color:#f8f5ed">
                  <p style="margin:0 0 8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#c9d6cf">Hijama Exorcist</p>
                  <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;color:#f8f5ed">${title}</h1>
                </td>
              </tr>
              <tr>
                <td style="background:#ffffff;border:1px solid #d9ded8;border-top:0;border-radius:0 0 18px 18px;padding:28px">
                  <p style="margin:0 0 24px;color:#52605a;font-size:16px;line-height:1.7">${intro}</p>
                  ${body}
                  <p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #e3e7e2;color:#6b746f;font-size:13px;line-height:1.6">${footer}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`
}

function detailsTable(rows) {
	const body = rows
		.map(
			([label, value], index) => `
        <tr>
          <th scope="row" style="padding:10px 12px 10px 0;border-top:${index === 0 ? '0' : '1px solid #edf0ed'};color:#6b746f;font-size:13px;font-weight:normal;text-align:left;vertical-align:top">${label}</th>
          <td style="padding:10px 0;border-top:${index === 0 ? '0' : '1px solid #edf0ed'};color:#173c32;font-size:16px;line-height:1.5">${value}</td>
        </tr>`,
		)
		.join('')
	return `<table role="table" cellpadding="0" cellspacing="0" border="0" width="100%">${body}</table>`
}

const templates = [
	{
		name: 'Appointment request · clinic',
		alias: 'appointment-clinic',
		from: FROM,
		reply_to: REPLY_TO,
		subject: '[{{{REFERENCE}}}] New appointment request',
		html: shell({
			title: 'New appointment request',
			preheader: 'Reference {{{REFERENCE}}}. Reply to this email to respond to the client.',
			intro: 'Reply to this email to respond directly to {{{CUSTOMER_NAME}}}. The request is not confirmed until you reply with availability.',
			body: detailsTable([
				['Name', '{{{CUSTOMER_NAME}}}'],
				['Email', '{{{USER_EMAIL}}}'],
				['Phone', '{{{CUSTOMER_PHONE}}}'],
				['Preferred contact', '{{{PREFERRED_CONTACT}}}'],
				['Session', '{{{SESSION_NAME}}}'],
				['Preferred date', '{{{PREFERRED_DATE}}}'],
				['Preferred time', '{{{PREFERRED_TIME}}}'],
				['Practical notes', '{{{PRACTICAL_NOTES}}}'],
			]),
			footer: 'Reference: <strong>{{{REFERENCE}}}</strong><br>Reply to this email to continue the conversation.',
		}),
		variables: [
			{ key: 'REFERENCE', type: 'string' },
			{ key: 'CUSTOMER_NAME', type: 'string' },
			{ key: 'USER_EMAIL', type: 'string' },
			{ key: 'CUSTOMER_PHONE', type: 'string' },
			{ key: 'PREFERRED_CONTACT', type: 'string', fallbackValue: 'email' },
			{ key: 'SESSION_NAME', type: 'string' },
			{ key: 'PREFERRED_DATE', type: 'string' },
			{ key: 'PREFERRED_TIME', type: 'string' },
			{ key: 'PRACTICAL_NOTES', type: 'string', fallbackValue: 'None provided' },
		],
	},
	{
		name: 'Appointment request · client',
		alias: 'appointment-confirmation',
		from: FROM,
		reply_to: REPLY_TO,
		subject: 'We received your appointment request · {{{REFERENCE}}}',
		html: shell({
			title: 'As-salāmu ʿalaykum, {{{CUSTOMER_NAME}}}',
			preheader: 'Your appointment request {{{REFERENCE}}} has been received. It is not confirmed yet.',
			intro: 'Your request has been received. It is not confirmed yet — the clinic will reply personally with availability and next steps.',
			body: detailsTable([
				['Session', '{{{SESSION_NAME}}}'],
				['Preferred date', '{{{PREFERRED_DATE}}}'],
				['Preferred time', '{{{PREFERRED_TIME}}}'],
			]),
			footer: 'Reference: <strong>{{{REFERENCE}}}</strong><br>Reply to this email if you need to add a note before the clinic writes back.',
		}),
		variables: [
			{ key: 'REFERENCE', type: 'string' },
			{ key: 'CUSTOMER_NAME', type: 'string' },
			{ key: 'SESSION_NAME', type: 'string' },
			{ key: 'PREFERRED_DATE', type: 'string' },
			{ key: 'PREFERRED_TIME', type: 'string' },
		],
	},
	{
		name: 'Clinic enquiry · clinic',
		alias: 'enquiry-clinic',
		from: FROM,
		reply_to: REPLY_TO,
		subject: '[{{{REFERENCE}}}] New clinic enquiry',
		html: shell({
			title: 'New private enquiry',
			preheader: 'Reference {{{REFERENCE}}}. Reply to this email to respond to the sender.',
			intro: 'Reply to this email to respond directly to {{{CUSTOMER_NAME}}}.',
			body: detailsTable([
				['Name', '{{{CUSTOMER_NAME}}}'],
				['Email', '{{{USER_EMAIL}}}'],
				['Reason', '{{{ENQUIRY_REASON}}}'],
				['Message', '{{{MESSAGE_BODY}}}'],
			]),
			footer: 'Reference: <strong>{{{REFERENCE}}}</strong><br>Reply to this email to continue the conversation.',
		}),
		variables: [
			{ key: 'REFERENCE', type: 'string' },
			{ key: 'CUSTOMER_NAME', type: 'string' },
			{ key: 'USER_EMAIL', type: 'string' },
			{ key: 'ENQUIRY_REASON', type: 'string' },
			{ key: 'MESSAGE_BODY', type: 'string' },
		],
	},
	{
		name: 'Clinic enquiry · client',
		alias: 'enquiry-confirmation',
		from: FROM,
		reply_to: REPLY_TO,
		subject: 'We received your message · {{{REFERENCE}}}',
		html: shell({
			title: 'As-salāmu ʿalaykum, {{{CUSTOMER_NAME}}}',
			preheader: 'Your message {{{REFERENCE}}} has been received. The clinic will reply personally.',
			intro: 'Thank you for contacting Hijama Exorcist. The clinic will reply personally as soon as possible.',
			body: `<p style="margin:0;color:#52605a;font-size:16px;line-height:1.7">Your {{{ENQUIRY_REASON}}} enquiry is now with the clinic.</p>`,
			footer: 'Reference: <strong>{{{REFERENCE}}}</strong><br>Reply to this email if you need to add a note before the clinic writes back.',
		}),
		variables: [
			{ key: 'REFERENCE', type: 'string' },
			{ key: 'CUSTOMER_NAME', type: 'string' },
			{ key: 'ENQUIRY_REASON', type: 'string' },
		],
	},
]

async function api(path, { method = 'GET', body } = {}) {
	const key = process.env.RESEND_API_KEY
	if (!key) throw new Error('RESEND_API_KEY is missing')
	const response = await fetch(`https://api.resend.com${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${key}`,
			'Content-Type': 'application/json',
			'User-Agent': 'HijamaExorcist/1.0',
		},
		body: body ? JSON.stringify(body) : undefined,
	})
	const text = await response.text()
	let data
	try {
		data = text ? JSON.parse(text) : null
	} catch {
		data = { raw: text }
	}
	if (!response.ok) {
		throw new Error(`${method} ${path} ${response.status}: ${text}`)
	}
	return data
}

async function main() {
	const listed = await api('/templates?limit=100')
	const existing = new Map(
		(listed.data || []).map((item) => [item.alias || item.name, item]),
	)

	for (const template of templates) {
		const current = existing.get(template.alias)
		let id = current?.id
		if (id) {
			await api(`/templates/${id}`, {
				method: 'PATCH',
				body: {
					name: template.name,
					from: template.from,
					reply_to: template.reply_to,
					subject: template.subject,
					html: template.html,
					variables: template.variables,
				},
			})
			console.log(`updated ${template.alias} (${id})`)
		} else {
			const created = await api('/templates', {
				method: 'POST',
				body: template,
			})
			id = created.id
			console.log(`created ${template.alias} (${id})`)
		}
		await api(`/templates/${id}/publish`, { method: 'POST' })
		console.log(`published ${template.alias}`)
	}
}

main().catch((error) => {
	console.error(error.message || error)
	process.exit(1)
})
