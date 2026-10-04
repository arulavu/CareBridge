# CareBridge: suggested choices + real AI chat

The website now shows clickable, context-aware topic suggestions while preserving free text. GitHub Pages alone cannot run a language model. Deploy server.mjs separately and set config.js to its public HTTPS URL. Configure OPENAI_API_KEY as a secret on the backend, never in GitHub. Follow AI_SETUP.md.

When the AI backend is unavailable, the interface explicitly states this instead of pretending fixed keyword responses are a full conversation. Basic emergency keyword warnings remain, but are not clinically validated.

The report, catalog, fictional clinicians, and photo preview remain demonstrations. The report is not generated from medically validated AI analysis. Do not enter real patient information into this prototype. This is not a clinical triage service.
