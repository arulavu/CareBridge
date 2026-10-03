# AI Clinic — Premium hackathon demonstration

A premium, responsive **static, offline-first** healthcare consultation-preparation demonstration, designed to deploy directly to GitHub Pages. No npm install or secret keys required.

## Run

```sh
python3 -m http.server 8080
# open http://localhost:8080
```

Deploy: upload the **contents** of this folder to the root of your GitHub Pages repository (replace old files), Settings → Pages → deploy `main` `/ (root)`. If the old version remains cached, clear site data and reload. Test offline only after loading online at least once. The remote Google Fonts import is optional and may not load offline; system fonts provide a fallback.

## Demo flow

1. Fictional name Joan; say "My hand hurts after I hit it hard and it is swollen."
2. Answer conversational follow-up prompts. Select a warning sign to demonstrate escalation, or none to see non-emergency educational information. **No diagnosis is generated.**
3. Analyse consultation: read the structured report, limitations, general offline information and source links.
4. Choose a fictional clinician and simulated date/time; confirm a demo-only reservation.
5. Consent and share to the simulated clinic inbox; download summary or delete local data.
6. Reopen offline after one online load. Medical source links themselves require internet.

## Important implementation boundaries

- **This is not a medical device, clinical triage tool, diagnostic model, or real booking system.** It has not been clinically validated. Do not enter real patient information.
- Follow-up questions are a fixed rule-based sequence. Guidance comes from a tiny local reviewed-topic *prototype* (`guidance.js`) with references to NHS/MedlinePlus. PubMed is linked for further reading. **No live medical APIs or PubMed/MedlinePlus retrieval, no citation-to-sentence verification.** No server or API key is used.
- Photographs receive a local preview only. They are **not analyzed or uploaded**. Do not claim image-assisted medical assessment.
- Simple keyword detection identifies a few possible emergency phrases; it is not exhaustive or clinically validated. It can miss emergencies. Users must contact local emergency services for emergencies regardless of this demo's output.
- Fictional clinician profiles, dates and booking confirmations are browser-only. No real doctor connection, appointment inventory, video consultation, or secure record transmission.
- Demo text, reports and booking state persist in unencrypted `localStorage` for demonstration convenience, so only invented data is appropriate. The photo preview is not persisted.
- The language selector offers limited Kazakh intake messaging; most guided interaction remains English. Full Kazakh localization and clinically reviewed local-language content are future work.
- Static GitHub Pages cannot securely host protected API keys or a patient-data backend. Real MedlinePlus/PubMed integrations and multimodal clinical image analysis require a separate secure server, licensing/usage checks, clinician oversight, and privacy/security review.

## Research sources

- NHS: https://www.nhs.uk/symptoms/hand-pain/
- MedlinePlus: https://medlineplus.gov/firstaid.html
- MedlinePlus: https://medlineplus.gov/woundsandinjuries.html
- PubMed: https://pubmed.ncbi.nlm.nih.gov/

Links provide context, not evidence of clinical validation or live API integration.

## Multi-turn update
After completing the four intake prompts, the chat stays open for unlimited follow-up questions and additional reported symptoms. A limited reviewed hand-injury educational card provides general first-aid and activity-avoidance information, while unknown concerns abstain. The report incorporates all follow-ups and refreshes on further questions. This is keyword/rule-based guidance, not a conversational LLM, diagnosis or clinically validated triage.


## Added demo features
- Fictional local profile (display name only), NOT actual authentication. No PIN or password is saved. Do not use real data.
- Microphone recording with playback, discard and download using browser MediaRecorder. No speech-to-text, automatic medical analysis or upload. Browser microphone permission and HTTPS required.
- Accessibility controls: larger text, high contrast, reduced motion, text-first mode, and optional browser speech synthesis. Text remains the primary mode for Deaf/hard-of-hearing users. These controls are not a WCAG conformance certification.
- Prominent Schedule online appointment button scrolls to fictional demonstration clinicians. Bookings are local simulations only.
- References: https://www.w3.org/TR/WCAG22/ ; https://www.w3.org/WAI/media/av/ ; https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

## Voice input update
The microphone records a local audio copy and attempts speech-to-text using the browser's SpeechRecognition API. Review/edit the transcript and press **Send transcript to consultation** to process it through the same existing chat flow as typed input. Speech recognition support varies by browser, language, and connection; many browsers send speech to their speech recognition provider, so it is NOT guaranteed offline or private. The app does not upload or send raw audio, provide a clinician voice-message inbox, or implement server speech-to-text. Use only fictional demonstration data.

## Contextual consultation update
The intake selects different question sequences for respiratory symptoms, mental wellbeing, routine check-ups, injuries and unknown concerns. After the intake, multiple follow-up messages receive limited topic-specific educational guidance. This is deterministic keyword matching and a curated offline library, not a generative medical model, clinical triage or live retrieval. If a concern is unknown, the app offers consultation preparation rather than fabricated treatment. Emergency keywords trigger escalation text; keyword matching can miss important warning signs. Use fictional data only.
