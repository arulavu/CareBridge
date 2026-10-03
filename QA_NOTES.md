# World Bank demo QA notes
This is a static, fictional-data educational prototype, not a clinically validated medical system. No live PubMed/MedlinePlus retrieval, real user accounts, medical image interpretation, actual audio transfer to clinicians, or real doctor bookings. The web browser's speech recognition may require connectivity and browser support. Test voice and service-worker caching in Chrome using invented information.

Updates: five concern-specific question paths (respiratory, mental health, checkups, injuries, general); follow-up conversations; topic-specific offline guidance; corrected progress, summary field names, and directory explanation; reduced false alarms for explicit negative warning-sign choices; bumped service-worker cache version.

Known limitations: Keyword matching can misinterpret complex free text, including nuanced negations; red-flag detection is not validated and is not safe for actual triage. Unrecognized topics get general preparation advice instead of invented condition-specific treatment. Mental-health emergency help is informational only. All clinicians, bookings, and handovers are fictional.

Demo cases: 'I caught a cold'; 'I feel stressed'; 'I want an annual checkup'; 'My hand hurts after I hit it'; 'I have chest pain'. Test each with a fresh reset. For offline, first load the site online, then switch DevTools Network to Offline and refresh.
