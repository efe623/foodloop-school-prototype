# FoodLoop school CS prototype

FoodLoop is an interactive school prototype built from the supplied CS DESIGN.docx and FoodLoop mind map. Everything shown—food, businesses, profiles, collections, locations and statistics—is fictional demonstration content.

## Open for presentation

Double-click the accompanying **FoodLoop.html** file and open it in a modern browser. The complete app, photographs and fixed map are embedded. No installation, server, internet connection or account is required. Each fresh launch starts with Student, Business / Donor or Ms. Watson selection.

Use **Switch role** in Profile or the desktop sidebar to inspect both modes. Use **Profile → Settings → Reset Demo** before a presentation to restore the original data. Browser storage normally preserves claims, collections, preferences and listings. If a browser blocks storage for local files, the app still works in memory for that session.

**Ms. Watson** appears as a wide green option below the Student and Business cards, with a clipboard icon and badges for both interfaces. It enters review mode, whose top control switches directly between the complete Student and Business interfaces while preserving the same local demo data. It is a presentation option, not an account. The supplied FoodLoop logo uses a white background and dark “Food” lettering on the role-selection screen. The desktop sidebar and mobile header use a transparent version with white “Food” lettering, so the logo blends into their dark backgrounds. Both versions retain the green leaves and “Loop” styling. The small disclaimer and footer text were removed from the role-selection screen as requested.

## Teacher walkthrough

1. Choose Student. Search for `fruit`, try Bakery and a distance filter, and switch between Map, List and Grid.
2. Open Mixed Pastries. Read its description, allergens, collection window, location and fictional donor. Claim one portion and confirm. Inspect My Claims.
3. Open the new claim and mark it as collected. Confirm, then check Past Claims.
4. Explore Profile, food preferences, local notification switches, settings, demo directions and help. Donor call/message controls show local simulations only.
5. Switch role and choose Business / Donor. Open Share Food, use an example photo, enter fictional food details, quantity and allergens, choose a collection window and one of the fixed demo locations.
6. Review the listing, publish locally and inspect the success state. Manage the listing by editing, pausing, resuming, completing or deleting it.
7. Switch to Student, clear any filters and find the newly created demo listing. It can be claimed just like the predefined examples.

## Develop the source

Requires Node.js 22.13 or newer. In this folder:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Check and build:

```sh
npm run check
npm run build
node scripts/package-offline.mjs
```

The last command generates the single-file FoodLoop.html in the parent directory. `npm run preview` serves the static build if needed.

## Source structure

- `src/data/mockListings.ts`: all predefined foods, categories, allergens, mock distances, demo collection points and photo choices.
- `src/state.tsx`: typed React context/reducer, atomic claims, collected status, local listings, favorites, filters and preferences. Storage key `foodloop-demo-v1`.
- `src/App.tsx`: role selection, main navigation, confirmation dialogs and success states.
- `src/Home.tsx`: discovery, search, filters, sorting and view controls.
- `src/Details.tsx`: food information, collection details and demo directions.
- `src/Claims.tsx`: Upcoming and Past tabs.
- `src/Share.tsx`: five-step local listing form and review.
- `src/Business.tsx`: donor dashboard and listing management.
- `src/Profile.tsx`: preset fictional profiles, preferences, settings, impact and help.
- `src/ui.tsx`: reusable listing cards, fixed local map and controls.
- `src/styles.css`: responsive desktop/mobile FoodLoop styling.
- `ASSETS.md`: stock photography and OpenStreetMap credits.

## Design and flow decisions

The mind map defines Home, Food Details, Claim Flow, My Claims, Share Food and Profile. Information nodes remain inside their parent screens, filters are inline controls, and confirmations are dialogs. Food Details and Collection Details scroll. Desktop uses the supplied dark green sidebar; mobile uses bottom navigation. Share Food combines collection time and location in one step as in the desktop design and preserves all mobile flow fields.

The user’s instructions intentionally replace historical onboarding with Choose Role. No splash, welcome, registration, sign-in, passwords, real personal-information forms or location permission screens exist. Profile editing uses preset fictional names and avatars. Language is English. Payment/payout interfaces were optional and are omitted; all food is free.

## Data and network boundaries

This is a static client application. There is no production backend, database, authentication, payment integration, real marketplace, telemetry or external messaging. File selection in the share form prepares example photos locally. Publish only updates browser state. Fixed map imagery is included locally; collection markers and distances are fictional. The copyright link opens OpenStreetMap only when clicked.

The optional browser WebMCP tools expose reading demo food, choosing a role, opening details and staging a claim confirmation using the same visible UI. They are feature-detected and do not require a service or account.
