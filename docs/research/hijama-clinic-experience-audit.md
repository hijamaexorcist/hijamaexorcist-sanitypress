# Hijama Clinic Content and Experience Audit

**Date:** 2026-08-10  
**Decision:** Replace the current template-led homepage with a clinician-led, safety-conscious booking journey. Add useful care information before adding decorative interface components.

## Brief

This audit asks what information and interaction design would make the Hijama clinic website more helpful and distinctive without turning it into a generic wellness site, making unsupported health claims, or showing graphic treatment imagery. The primary audiences are first-time and returning clients who already understand Hijama but need to understand the practitioner, the process, and how to book confidently.

## Answer First

The site does not need more generic modules. It needs a stronger **trust narrative**:

1. who the practitioner is and why a client can trust the clinical setting;
2. what an appointment actually feels like, before, during, and after;
3. who should pause and discuss suitability before booking;
4. how Sunnah guidance fits respectfully alongside personal suitability and hygiene; and
5. a booking path that lets a person choose confidently rather than decode a form.

The visual distinction should come from calm composition, an authentic practitioner presence, and carefully choreographed reassurance—not repeated cup imagery, “healing” claims, or an inventory of effects.

## Current Audit

The rendered homepage and booking page were inspected locally on 2026-08-10.

### Remove or rewrite immediately

- **Template hero:** The live homepage uses the upstream `HeroSaaS` module. It is centered, generic, opens with blog-led copy, and presents two same-weight calls to action. It bypasses the clinic-focused hero styling already applied to the other hero variants.
- **Default and conflicting calls to action:** `Read the Blog on Hijama` and `Book a Hijama Appointment` compete. The hero should have one primary action, `Book a session`, plus one low-emphasis supporting link, `Meet the practitioner` or `What to expect`.
- **Emoji-led navigation:** `🌟 Book An Appointment` undermines a private, clinical tone. Use a plain, persistent booking action.
- **Placeholder clinician card:** `Photo, name, training background, certifications` must never render as public content. It creates the strongest possible trust gap on a clinician-led site.
- **Template and debug leakage:** `Visit your Studio`, `Read the docs`, and `©2025 My Website` appear in the rendered homepage. Remove these from public production content before any visual work continues.
- **Overstated medical language:** Remove or clinically review phrases such as `detox`, `release stagnation`, `body releases toxins`, blanket lists of symptoms the service “relieves,” and `very safe`. NCCIH says the evidence base is low quality, evidence of pain reduction is not strong, and wet cupping has real infection and blood-loss risks [S1].
- **Generic social proof:** `Real Stories. Real Healing.` makes an outcome promise. Use consented, specific client feedback only if it is genuine, and never position it as medical evidence.
- **Generic pricing language:** `Simple Pricing for Sunnah-Based Healing` reads like a product tier. Present session options as care choices: who it is for, expected duration, what the session includes, price, and booking availability.

### Keep, but change the role

- **Sunnah dates:** Keep as gentle booking guidance. Explain that dates are an optional spiritual practice and suitability is discussed separately.
- **FAQ:** Expand it into practical first-time client education, not claims defense.
- **Blog:** Keep as secondary education and search content. It should not be the first offer on the homepage.
- **Booking metadata:** Location, deposit, and preparation content are useful. Reframe them as part of a calm appointment summary.

## Content to Add

All clinical copy must be reviewed and approved by the practitioner before publication.

| Priority | Content | Why it earns space | Format |
| --- | --- | --- | --- |
| P0 | Practitioner profile | The primary first-visit trust question is who is carrying out the treatment. | Portrait, real name, training/certifications, approach, and a short personal note. |
| P0 | Hygiene and consent standard | Wet cupping involves blood; visible safety practice is more reassuring than decorative imagery. | “How we keep your session safe” with single-use equipment, cleaning/disposal process, consent, and when to seek medical advice. Only publish statements the clinic can document. |
| P0 | First-session walk-through | Replaces vague “healing journey” language with certainty about the visit. | Consultation → treatment → aftercare timeline, expected duration, privacy, what clients can ask. |
| P0 | Suitability and pause-before-booking guide | Helps people make a safer decision and prevents a bad booking experience. | A concise, practitioner-reviewed checklist with a clear “contact us before booking” path. Do not self-diagnose visitors. |
| P1 | Treatment guide | Lets visitors select a service without needing a sales conversation. | Care-choice cards with purpose, session length, inclusions, price, and gentle next step. |
| P1 | Preparation and aftercare guide | Useful enough to save/share; also reduces day-of uncertainty. | Printable or mobile-friendly guide covering food, hydration, clothing, marks, and follow-up expectations. |
| P1 | Sunnah context | Keeps the practice’s character without using religion as a health claim. | A carefully sourced short note, specific hadith reference only after scholarly review, Hijri date explanation, and optional recommended dates. |
| P1 | Clinic practicalities | Visitors should know what arriving feels like. | Exact address, parking/transit, accessibility, women/family/privacy arrangements where applicable, cancellation and deposit policy. |
| P2 | Real client perspectives | Social proof works only when specific, consented, and non-medical. | Initials/consent level, service context, experience-focused quote—not a promised result. |
| P2 | Focused education hub | Makes the blog useful rather than promotional. | Three curated paths: first visit, preparation, and Sunnah dates; articles stay clearly secondary to booking. |

## Homepage: Recommended Narrative

1. **Clinician-led hero** — clear promise, practitioner portrait or a dignified clinic/environmental photograph, location, and one booking action.
2. **A visit in three calm moments** — consultation, treatment, aftercare. This is the first reassurance section.
3. **Meet the practitioner** — real credentials, approach, and a replacement-friendly image field.
4. **Care choices** — session options described as choices, not pricing tiers.
5. **Safety, consent, and comfort** — concise, documented practices with a link to the fuller guide.
6. **Sunnah and preparation** — quiet contextual panel; not a conversion gimmick.
7. **Practical clinic details** — location, deposit/confirmation expectations, and a final book action.
8. **Education** — only three deliberately selected articles, after the booking narrative.

Do not place testimonials, pricing, FAQ, and blog all at the same visual weight. That is the current reason the page feels long but still bare: its sections are not telling a single story.

## Hero Specification

### Structure

- **Left:** an eyebrow such as `Hijama care in Piscataway, NJ`, a human headline, 2–3 lines about the practitioner-led experience, one primary booking action, and a text link for first-time visitors.
- **Right:** a large portrait of the practitioner or a quiet detail of the clinic—linen, sunlight, a consultation setting, clean equipment laid out before treatment. Do not use blood, skin incisions, or close-up cups in the hero.
- **Trust note:** one small, truthful detail below the image, such as certification/training or appointment-only privacy. It must be supplied by the clinic, not invented.
- **Mobile:** text first, image second; keep the primary action visible without stacking multiple buttons.

### Copy direction

Avoid phrases such as “detox,” “toxins,” “guaranteed healing,” and “exorcist to the rescue.” Prefer direct, human language: *“A considered Hijama appointment, with time to ask questions.”* The actual practitioner name and qualifications should do the credibility work.

## Interaction and Affordances

### Worth building

- **First-visit chooser:** a small two-path affordance in the hero or immediately below it: `I’m new to Hijama` scrolls to the process; `I know what I need` starts booking. This is orientation, not a quiz.
- **Appointment summary:** once a service/date/time is selected, show a quiet persistent summary and what happens after submission.
- **Date guidance:** keep the Hijri date and Sunnah-day note contextual to a selected date, as the booking page now does.
- **Preparation disclosure:** an accessible accordion that remembers it was opened during the session and is downloadable/printable when the content is ready.
- **Map and arrival help:** an explicit external directions action plus parking/accessibility detail. Never bury this in footer links.
- **FAQ as decision help:** group questions by “before booking,” “during your visit,” and “aftercare,” rather than a random accordion list.

### Do not build

- A fake assessment, chatbot, medical symptom checker, “detox score,” or conversion countdown.
- Auto-playing video, parallax on form controls, animated blood/cup imagery, or a glossy wellness “before/after” carousel.
- A shader or animation on every section.

## 21st Component Strategy

21st publicly catalogues shaders, animated heroes, accordions, calendars, progress indicators, maps, image blocks, buttons, and cards [S2–S4]. The correct strategy is **one meaningful interaction pattern per moment**, not one component from every catalogue category.

| Site moment | 21st pattern to evaluate | How to use it tastefully | Do not use it for |
| --- | --- | --- | --- |
| Hero atmosphere | `Neural Noise` or a very low-motion `Wave`/`Oceanic` shader | A barely perceptible olive/mist canvas behind the hero image at low opacity; static fallback and reduced-motion mode required. | The entire page background, vivid gradients, or motion behind text. |
| Hero entrance | `Glow Horizon` or `Aether Ribbon Mesh` concepts | Borrow the staged text/image reveal timing only; keep the visual treatment original and restrained. | Bright neon beams or tech-product effects. |
| First-session journey | `Steps` or `Timeline` | Three clear, numbered appointment moments with an active/hover state. | A long scrolling “story” with performative animation. |
| Booking | `Calendar`, `Select`, and `Progress` | Improve date/time choice and show booking progress only if booking becomes a genuine multi-step flow. | Replacing the native date input until availability is truly integrated. |
| Safety and preparation | `Accordion` | Progressive disclosure for practical, practitioner-approved information. | Hiding essential safety information. |
| Clinic location | `Map` | Provide a calm location visual and an explicit external directions action. | A decorative world map. |
| Treatments and practitioner | `Image` and `Card` patterns | Reusable framed imagery with a very small amount of supporting copy. | A homogeneous SaaS card grid. |

The public catalogue names `Neural Noise`, `Oceanic`, `Wave`, `Glow Horizon`, `Aether Ribbon Mesh`, `Animated Gradient`, and `Lamp` under shaders/animated heroes [S3, S4]. Evaluate them live through the 21st MCP after restarting Codex, but only adopt patterns that pass the accessibility and motion constraints above.

## Implementation Order

1. **Content correction pass:** remove public debug/template strings, replace placeholder practitioner content, and submit all medical/safety claims for practitioner review.
2. **Replace `HeroSaaS`:** build a dedicated clinic hero module with CMS fields for portrait, credential note, primary booking action, and first-visit link. Do not keep the default Sanity CTA treatment.
3. **Build the P0 trust sequence:** practitioner, what to expect, hygiene/consent, and suitability guide.
4. **Complete booking affordances:** appointment summary, richer preparation guide, clearer confirmation timing, and accessible client-side validation.
5. **Add one motion layer:** prototype a muted shader behind the home hero with a no-WebGL/static fallback and `prefers-reduced-motion` support.
6. **Only then** add P1/P2 content and selected article routes.

## Evidence and Limits

- **VERIFIED:** NCCIH says research on cupping is generally low quality; pain evidence is not strong; cupping can have side effects including infection; contaminated equipment can transmit bloodborne disease [S1]. This supports adding a specific, documented hygiene/consent section and avoiding efficacy promises.
- **VERIFIED:** 21st’s public catalogue includes the component categories and pattern names listed above [S2–S4]. This supports using it as a pattern source rather than a component dumping ground.
- **UNVERIFIED:** Competitor site comparison is incomplete. Public search access in this session did not yield reliable representative Muslim/Hijama clinic pages, so this report does not claim market-wide competitor findings. A targeted round can be run once a shortlist of three clinics or regions is supplied.

## Implementation Audit — 2026-09-03

### Current assessment

The public experience now has a consistent design language: mineral canvas, deep olive ink and actions, eucalyptus/mist surfaces, restrained clay focus accents, DM Serif Display for editorial headings, and Instrument Sans for body and controls. The characteristic element is the softly framed clinic shell used for imagery, care information, and forms. This reads as a quiet clinical ritual rather than a SaaS template.

The active homepage is intentionally short: one clinic-led hero, a three-part visit journey, and three care standards. Template hero variants, placeholder practitioner content, unverified pricing/testimonials/FAQ, and the empty article list are hidden. The remaining visual limitation is content, not layout: the hero uses a replaceable environmental image because no approved practitioner portrait or verified credentials were supplied.

### Completed in this pass

- Corrected Sanity preview behavior so draft/stega data appears only in Next draft mode.
- Applied module `hidden` options consistently and corrected module visual-editing paths.
- Prevented CMS-only properties from leaking onto DOM elements.
- Added persistent labels, autocomplete hints, announced states, 48px controls, and clinic styling to the contact form.
- Added meaningful/empty image alternatives, safer external-link relations, and accessible navigation target sizes.
- Verified one main landmark, one H1, labelled controls, image alternatives, and no horizontal overflow at desktop and 390px mobile widths across Home, About, Booking, Contact, Ruqyah, Journal, and 404.
- Moved the three existing articles back to drafts because they contain unreviewed health, fertility, postpartum mental-health, detoxification, and outcome claims. The journal now presents a clear review-pending state and is removed from primary navigation.

### Clinic CMS component inventory

The local project contains all 24 modules from the original starter template at commit `fbc2f0d` (2026-05-30), plus five clinic-specific modules, for 29 total. Every schema module has a public renderer.

Recommended for this project: Hero, Hero Split, restrained Hero SaaS, Richtext, Accordion list, Card list, Flag list, Step list, Blog list/frontpage, Contact form, Appointment form, Care journey, Care standards, and Text highlight. Pricing and testimonials should be used only after facts and consent are verified. Logo/stat/reputation modules need real evidence. Custom HTML, dense SaaS compositions, and decorative shader-heavy patterns should generally be avoided.

### Owner-confirmation launch blockers

- Confirm the clinic location conflict: Booking says Piscataway, New Jersey; Contact says Bronx, New York.
- Confirm every price, session duration, time slot, deposit rule, payment recipient, phone number, address, and preparation instruction before launch.
- Supply the practitioner’s real name, approved portrait, training/certifications, scope of practice, and documented hygiene/disposal process before publishing practitioner or safety claims.
- Have a qualified clinical reviewer and an appropriate religious reviewer approve the three draft articles before republishing them.
- Confirm the production domain, then add that exact origin to Sanity CORS and production environment configuration.

## Sources

- **[S1]** National Center for Complementary and Integrative Health, “Cupping,” accessed 2026-08-10. https://www.nccih.nih.gov/health/cupping
- **[S2]** 21st, public component catalogue, accessed 2026-08-10. https://21st.dev/community/components
- **[S3]** 21st, shader component category, accessed 2026-08-10. https://21st.dev/community/components/s/shader
- **[S4]** 21st, animated hero component category, accessed 2026-08-10. https://21st.dev/community/components/s/animated-hero
