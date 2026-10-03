# CareBridge v2 demo — limitations
- New Analyse / Send generates a preliminary informational card and questions for clinician discussion. It is NOT an AI medical consultation, diagnosis, or validated triage system.
- Source-backed offline reference cards: NHS hand pain and US National Library of Medicine MedlinePlus. Links are provided to original sites when online. No live database/API connection is made, no external medical content fetched or stored. Content is limited and must be reviewed and localized by clinical professionals before deployment.
- Warning signs use explicit checkbox answers and limited text pattern detection. This is NOT comprehensive emergency screening. No result should be interpreted as safe to wait.
- Fictional doctor names, schedules and local appointment requests. No real reservation, remote clinician or messaging backend.
- Photos are local preview only, not analyzed, stored or transmitted.
- Never use actual patient information. localStorage is not encrypted. GitHub Pages is static hosting.
- After uploading all files to GitHub repository root, refresh GitHub Pages twice (service worker v2), test in incognito and DevTools offline after an online load.
