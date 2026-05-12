# OrDino (Archived Student Demo)

OrDino is a static productivity/todo student project demo (HTML/CSS/JS/jQuery/Bootstrap) with optional Todoist sync and local demo auth.

## What’s included
- Local demo signup/login (browser storage only).
- Post-login dashboard with:
  - Inbox (projects + tasks)
  - Add Project/Add Task modals
  - Leaderboard (local demo points)
  - Rewards/Redeem store tab
- Optional **Connect Todoist** panel in the main app.

## Setup
1. Open `index.html` (or serve the folder with any static server).
2. Sign up and log in (local demo account).
3. In the main app, optionally connect Todoist by pasting your personal API token.

## Required/optional integrations
- **Todoist (optional):**
  - Base URL used: `https://api.todoist.com/api/v1`
  - Auth header: `Authorization: Bearer <token>`
  - Token is stored only in `localStorage.API_KEY` in your browser.
- **RestDB:** not required for current local demo auth flow.

## Security note
- This archived project is **not production-secure**.
- Do not commit API tokens or credentials.
- localStorage auth/token storage is for demo use only.

## Known limitations
- Leaderboard and APPoints are local-demo state.
- Some gamification/redeem behavior is intentionally simplified.
- Comments/reschedule flows are partially demo placeholders.

## UI cleanup in this pass
- Store/redeem cards improved for spacing, readability, and responsive behavior.
- Better loading/empty/error states for projects/tasks.
- Cleaner section hierarchy and reduced alert-based interruptions.
