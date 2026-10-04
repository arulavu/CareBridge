# Version 7: contextual pain safety repair

The previous release detected the phrase “leg hurts” as pain but the guidance engine fell back to `general`. This version resolves location-specific guidance for legs, backs, headaches and hands; shows related questions; includes the selected warning-sign answer in assessment; gives initial guidance without requiring the report button; and allows unlimited follow-up questions.

No autonomous diagnosis, live AI model, photo analysis or real booking. The rule-based library is not medically validated and must not be used with real patient information. The service worker now uses network-first caching and a new cache name. Old fictional consultations use a different localStorage key so prior sessions cannot contaminate demonstrations.
