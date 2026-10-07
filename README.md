# FoodLoop school CS project.

FoodLoop is an app built for the Computer Science project that we took Olio as an example; I have built this app with Base44, did the designs by myself in Figma, and the reason all these files are on GitHub is because the preview link in Base44 was not working for me, so I pushed the app from Base44 to GitHub and got a .vercel.app domain from vercel.com . This app has palce holder foods that are there because no one uses the app and no one uploaded any foods, and I don't want the home screen to be empty.
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

The optional browser WebMCP tools expose reading demo food, choosing a role, opening details and staging a claim confirmation using the same visible UI. They are feature-detected and do not require a service or account.
