# Conversation continuity update

A new concern such as "I also think that I may have an allergy" is now stored separately from an earlier cold and receives allergy-specific follow-up questions. The prior concern is preserved rather than silently overwritten. Additional concerns appear separately in the report. Emergency warning signs still override the conversation. This is deterministic routing, not a connected language model or clinically validated triage system.

For testing a deployed version, clear the site's old stored demo session using Reset, then hard-reload the page. The service worker cache identifier has been updated.
