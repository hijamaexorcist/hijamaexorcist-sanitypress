export default {
	missingBaseUrl:
		'Missing base url.\n\n' +
		'Solution: Set your website URL as NEXT_PUBLIC_BASE_URL in your environment variables (including https://).',

	missingSiteSettings:
		'Missing Site settings.\n\n' +
		'Solution: Publish the Site document in Sanity Studio.',

	missingHomepage:
		'Missing homepage.\n\n' +
		'Solution: Add a Page document in Sanity Studio with the slug "index".',

	missingBlogTemplate:
		'Missing blog template.\n\n' +
		'Solution: Add a Global module document in Sanity Studio with the path "blog/".\n' +
		'Also add the Blog post content module to display blog post content.',
}
