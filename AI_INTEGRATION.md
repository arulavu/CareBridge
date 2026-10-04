# AI and photo analysis: required deployment work (NOT included in this static demo)

This GitHub Pages site is a **local, deterministic demonstration**, not a general-purpose medical AI or validated triage tool. No API key or clinical service can safely be embedded in public browser JavaScript. Its offline topic routing and safety rules are incomplete and must never be marketed as supporting all conditions or ruling out emergencies.

## Production architecture

1. Host a separate HTTPS backend and add explicit informed consent, privacy notices, data minimization, access controls, deletion, rate limits, and relevant jurisdictional compliance before accepting actual health data. The demo currently warns users to use fictional data only.
2. Backend `POST /consultation/message` accepts a pseudonymous session ID, latest message, prior turns and explicitly consented history. Use a hosted multimodal model behind the backend to **extract** symptoms, duration, body location, severity, history, user questions, uncertain details, and possible red flags into a validated structured schema. Do not let the model independently certify a patient as safe.
3. Apply a separately reviewed clinical escalation rules engine to every message, after extraction and again before sending a response. Ambiguous, conflicting, missing or potentially serious information requires clarification or conservative human assessment, not reassurance. In suspected poisoning or anaphylaxis, surface emergency/poison-service guidance immediately.
4. Ask a single relevant question at a time. Store turn history only after explicit consent. Permit new concerns, corrections and follow-up questions after any recommendation; recompute escalation on every new turn.
5. Backend `POST /consultation/image` should accept **explicitly consented** images only, with size/type checks, short retention and a qualified clinician escalation pathway. A model may describe observable features with uncertainty; it cannot diagnose or override reported symptoms. If image and text appear inconsistent, ask clarifying questions about the image, onset, medical history and whether the photo is current. For high-risk symptoms, do not delay urgent advice for an image.
6. Retrieval: curate a reviewed allowlist of specific documents from WHO, MedlinePlus, NHS, CDC and relevant local health authorities; check access rights, freshness and regional applicability. Store source title, URL, publication/review date, excerpt and version. Return precise citations attached to each supported recommendation. Do not claim to access *all* medical websites. PubMed research articles and medical handbooks are not automatic patient-care instructions.
7. Clinician matching: route to an appropriate *category* (primary care, emergency, allergy, etc.). Real availability and booking require authenticated, authorized clinic integrations. Existing appointments are fictional.
8. Translation: interface translation can be provided by a supported translation service with consent; medically significant symptom terms and safety messages require professionally reviewed translations. Browser speech recognition may require internet access.
9. Before public patient use: clinician-authored pathways, multilingual safety evaluation, adversarial testing for negation and conflicting photo/text, accessibility testing, medical governance, incident response and clinical/regulatory review.

## User-supplied background references (review and licensing needed)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC3933835/
- https://deptmedicine.utoronto.ca/sites/default/files/assets/files/medical-consult-handbook.pdf
- https://www.youtube.com/watch?v=STnLNbRHYhw
- https://bjgp.org/content/64/620/150

These references are listed for subsequent clinical review; this build does not claim to have extracted or integrated their contents.
