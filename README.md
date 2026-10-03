# CareBridge — Small AI for Development (Health)

**Hackathon pilot only. Not a medical device. Never enter real patient information.**

An offline-first bilingual (English/Kazakh) administrative clinic-intake demonstration. A bundled, on-device multinomial Naive Bayes model classifies *administrative requests only* into appointment, clinic information, records handover and follow-up. Unrecognized or uncertain messages are flagged for human review. This is actual local machine learning, but it is **not** medical AI, symptom analysis, clinical triage, diagnosis or specialist selection.

## Run

Requires Python 3 for local server; Node 18+ for tests.

```bash
python3 -m http.server 8080
# visit http://localhost:8080
node --test tests/*.test.js
```

Alternatively publish this folder to GitHub Pages (Settings → Pages → Deploy from branch → root). **HTTPS or localhost is required for offline service worker caching.** Open the site online once, then reload with browser DevTools network set to Offline to verify the cache. GitHub Pages URL is the live project URL.

## Demo (fictional data only)

1. Visit online once to cache the application; turn network off.
2. Choose Kazakh. Enter nickname `Demo Noor`, request `Дәрігерге жазылғым келеді`, optional duration.
3. Generate an offline summary. The bundled model assigns an *administrative* category; it does not assess the patient's condition.
4. Check consent and click send while offline; see the queued status.
5. Reconnect. The in-browser simulated clinician dashboard receives the summary. No data is sent to any server.
6. Delete local data. Repeat in English with an ambiguous message and demonstrate abstention.

## Architecture and constraints

- **Existing device:** smartphone browser; shared-device use with a community health worker is proposed, not implemented with multiuser security.
- **Offline core:** local HTML/CSS/JS, cached service worker, bundled small model and training examples. No API key or external dependencies.
- **Local language:** Kazakh UI and example training utterances; English also supported. No voice feature is claimed.
- **AI value:** converts variable free-text administrative requests into structured categories; this is not achievable by a fixed-form-only interface for arbitrary text. Very small demo dataset means generalization is limited.
- **Human-in-loop:** no diagnosis, no clinical triage, no automated referral. Unknown categories are handed to humans.
- **Photographs:** optional local preview only; not analyzed, stored or sent. A future clinician-reviewed workflow is out of scope.
- **Consent:** simulated handover is disabled until explicit checkbox approval; no external transmission occurs.
- **Privacy:** localStorage is **not encrypted** and is unsuitable for actual patient records. Never use real patient data. Production requires encryption, authentication, secure transport, consent withdrawal, medical governance, clinician-reviewed emergency workflows and appropriate legal compliance.
- **Connectivity:** queued demo handover survives refresh in localStorage; on reconnection it enters an **in-browser simulated** clinician inbox only, not an external clinic. Simulated inbox is not persistent.
- **Safety:** prominent instructions to seek immediate real-world help for urgent needs. No clinical accuracy claims.

## Data and model card

`model.js` contains 24 manually authored **synthetic** English and Kazakh administrative training examples (6 per category). License for our original sample text: MIT as part of this repository. No patient records or external datasets. Tiny multinomial Naive Bayes with Laplace smoothing; probability is a classifier confidence, **not** clinical confidence. The model abstains if fewer than two known tokens match or maximum posterior <0.62. The limited dataset does not represent diverse accents, dialects, misspellings or less-supported languages. The current model is a technical demonstration, not validated on independent real-world data.

Suggested evidence sources for the problem statement: World Bank Service Delivery Indicators, WHO Global Health Observatory, GSMA Mobile Gender Gap Report. **Retrieve and cite an actual country and year before making numerical claims.**

## Future roadmap (not implemented)

Clinician-approved multilingual voice intake; encrypted patient record; secure queue to verified clinics; provider availability integration; clinician-only photo review; licensed online mental health consultations. No independent diagnosis or unvalidated medical risk scoring.

## Submission

Track **04a — World Bank: Small AI for development (Track A: Health)**. Repository URL: add after pushing. Live URL: GitHub Pages deployment URL. Record requested short MP4/MOV sections according to the current submission portal; see `SUBMISSION.md`.
