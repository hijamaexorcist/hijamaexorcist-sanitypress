# Hijama Exorcist

Private Hijama care in Piscataway, New Jersey. Next.js App Router, Tailwind CSS, and an embedded Sanity Studio.

- Site: https://www.hijamaexorcist.com
- Studio: https://www.hijamaexorcist.com/admin
- Sanity project: [rgteya6w](https://www.sanity.io/manage/project/rgteya6w)

## Local development

```sh
npm install
npm run dev
```

- Website: http://localhost:3000
- Sanity Studio: http://localhost:3000/admin

Copy `.env.example` to `.env.local` and fill in the values.

```ini
NEXT_PUBLIC_BASE_URL="" # https://hijamaexorcist.com
NEXT_PUBLIC_SANITY_PROJECT_ID="" # rgteya6w
NEXT_PUBLIC_SANITY_DATASET="" # production
SANITY_API_READ_TOKEN="" # Viewer token from https://sanity.io/manage
```

## Content

Publish the required `site` and `page` documents in Studio:

| Document        | Slug           | Use             | Required? |
| --------------- | -------------- | --------------- | :-------: |
| `site`          |                | Global settings |    yes    |
| `page`          | `index`        | Homepage        |    yes    |
| `page`          | `404`          | Page not found  |           |
| `page`          | `blog`         | Journal listing |           |
| `global-module` | `blog/` (path) | Journal posts   |           |

## Mail

Forms send through Resend from `hello@hijamaexorcist.com`. See `.env.example` for `RESEND_*` and `FORM_NOTIFICATION_EMAIL`.
