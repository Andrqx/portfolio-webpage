# Andrew's Voice: Style Guide for Claude Code

This governs all copy on the portfolio site: headers, body text, project descriptions, captions, page titles, everything user-facing. It does not apply to code comments.

## Absolute rule: no em dashes. Ever.
Not in headers, not in body text, not in a "clever aside," not once, no exceptions, no judgment calls. If a sentence wants an em dash, make it two sentences, or use a comma, colon, or period. Don't reflexively swap in a hyphen or colon and move on, rewrite the sentence structure.

This includes structural spots that aren't full sentences: date ranges (use a hyphen, e.g. "June 2025 - Present"), eyebrow-style labels (use a middle dot, e.g. "Mechanical Engineer · McMaster University"), and page `<title>` metadata (use a pipe, e.g. "Project Title | Andrew Evans"). None of those are em dashes, so all are fine.

## How Andrew actually writes and talks (the raw material)
- Always lowercase when typing fast, drops apostrophes ("im," "dont," "cant"), chains clauses with "so"/"and"/"but" instead of stopping at a period, opens with a throat-clearing connector ("okay so," "i mean"). None of this belongs in finished site copy, it's fast-typing texture, not voice.
- Ends technical asks as short, direct questions with no preamble.
- When explaining something he actually knows well (e.g. the FSAE chassis work), the voice gets denser but stays informal: self-interrupts, corrects mid-sentence, leans on "like"/"basically"/"kinda" as connective tissue. This density and honest self-correction is what should transfer to technical writing, not the filler words themselves.
- **Understates his own work by default.** The significance has to be visible in the numbers and facts, not asserted with adjectives. This is the single most important trait for the portfolio, since AI-generated writing does the opposite by default.
- No em dashes anywhere in any real sample. Matches the hard rule above, it's not an invented constraint.

## What transfers to the portfolio, and what doesn't
| Raw trait | Portfolio equivalent |
|---|---|
| Lowercase, dropped apostrophes | Standard grammar. Not a loss of voice, just a fast-typing habit. |
| Run-ons chained by "so"/"and"/"but" | Short declarative sentences, same order of information: cause, then effect, then result. Don't add subordinate clauses he wouldn't use. |
| Throat-clearing opener ("okay so," "i mean") | Cut entirely. Lead straight with the concrete fact or number. |
| Dense, self-correcting explanation when he knows the material | This transfers. Numbers, process, honest correction of his own claims, no added polish. |
| Understatement | Transfers directly. Resist adding adjectives he wouldn't use about his own work. |
| "bro claude," blunt frustration | Not relevant to third-person hiring-manager content. |
| No em dashes | Absolute, everywhere on the site. |

## Banned words and phrases
Kill on sight: passionate about, leveraged, cutting-edge, innovative solution, seamlessly, robust, dive into, unlock, elevate, game-changing, state-of-the-art (unless quoting an actual spec), journey (as in "my engineering journey").

Test: could this sentence describe literally any project by anyone? If yes, delete it. It's not saying anything specific about this project.

## Structure for project/case-study pages
1. Lead with the concrete result or number. No scene-setting intro paragraph.
2. Order: problem, then what he built or decided, then what the data showed, then where it was wrong and why, then what he'd change next.
3. Never present a simplification as a deliberate choice if it was actually a constraint (tool limit, time, license). State the constraint plainly.
4. No invented technical content. If a number isn't confirmed in his notes, mark it `[CONFIRM: ...]` inline rather than filling the gap with something plausible-sounding.

## Calibration example

Wrong (generic AI portfolio tone): "Leveraging advanced composite engineering principles, I engineered an innovative quasi-isotropic layup that seamlessly balanced weight savings with structural performance, achieving impressive results that pushed the boundaries of what's possible in FSAE chassis design."

Right (his voice): "C9 is a 4-layer quasi-isotropic layup over foam core: 45° biaxial twill, 0° UD, 90° UD, then a combined 0/90 layer. It matches or beats the old 5-layer C5 panel's stiffness at about 20% less weight. Simulated torsional stiffness came out to 4500 N·m/deg against a measured 3900 N·m/deg."

## Self-check before finalizing any page
1. Scan for the "—" character. If found, rewrite the sentence structure, don't just swap in a hyphen or colon.
2. Run the banned-phrase list against the draft. If more than one survives, rewrite from the numbers up.
3. Read it out loud. If it sounds like a brochure, it's wrong. If it sounds like Andrew explaining what he did and what went wrong, it's right.
