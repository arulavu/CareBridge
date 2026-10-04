# CareBridge — real conversational AI setup

The site remains on GitHub Pages, but genuine AI chat requires a separately hosted Node.js backend. It is **not** available merely by uploading this ZIP to GitHub Pages.

1. Deploy `server.mjs`, `triage.js`, and `reaction.js` on a Node.js 20+ hosting service that supports environment variables (for example, Render or Railway). Set the start command to `node server.mjs`.
2. Set `OPENAI_API_KEY` **only on the server**, `OPENAI_MODEL` to a model supported by your account, and `ALLOWED_ORIGIN=https://arulavu.github.io` (no trailing slash). Never commit the API key.
3. Set `window.CAREBRIDGE_API_URL='https://YOUR-BACKEND-HOST'` in `config.js`, commit the frontend to GitHub Pages, and verify `/health` reports `configured:true`.
4. Test new topic switches, medication reaction, suspected fracture, diarrhea/constipation, mental-health questions, and loss of backend connectivity. Hard-refresh or unregister the previous service worker.
5. The existing **summary/report** and simulated booking remain offline rule-based demonstrations. They do not summarize the AI model’s clinical judgment or connect to real doctors. Photo uploads are **local previews only**, not analyzed by AI. The website should not be advertised as clinically validated.

## Privacy and safety

This demo sends the most recent 24 chat turns to the configured backend and an external AI provider. **Never use real patient data** without a suitable privacy, consent, retention, security and regulatory review. The existing localStorage demo history remains on the device. Client and server safety checks are only illustrative, not clinically validated. The server uses strict CORS, limits input size and never exposes the API key, but production use additionally requires authentication, rate limiting, abuse protection, logging policy, secure hosting, medical review and evaluation. Offline mode cannot run this AI model. An unavailable AI service produces a clear error rather than pretending to answer with AI.
