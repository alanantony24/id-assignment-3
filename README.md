# OrDino (Archived Student Demo)

OrDino is an archived front-end productivity/todo app prototype built for a school assignment.

## Important archive note
- This project is now a **local demo**.
- Authentication is local-only in browser storage.
- It is not production-secure.

## Current architecture
- Static HTML/CSS/JS + jQuery + Bootstrap.
- No backend required.
- No external auth service.
- Optional Todoist integration (connected after login).

## Local demo authentication flow
- **Sign up:** username + email + password are saved in `localStorage`.
- **Login:** validated against locally stored demo users.
- **Session:** current user stored in `localStorage`.
- **Logout:** clears local session state.

## Todoist integration (optional)
- Login/signup does **not** require Todoist token.
- After login, open `main.html` and use **Connect Todoist** panel.
- Token is stored in `localStorage.API_KEY` only in this browser.
- Never commit API tokens.

## Todoist API details
- Base URL: `https://api.todoist.com/api/v1`
- Auth header: `Authorization: Bearer <token>`
- Project/task requests are only attempted when token exists.

## Leaderboard and gamification notes
- Leaderboard is local-demo only (per-browser data).
- APPoints are stored in localStorage for the logged-in demo user.

## Setup
1. Download/clone repo.
2. Open `index.html` in browser (or run static server).
3. Sign up a local demo user.
4. Log in and optionally connect Todoist.

## Security warning
Static front-end demos cannot truly protect secrets. Do not use this architecture for production authentication.
