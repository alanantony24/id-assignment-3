# OrDino (Archived Student Demo)

OrDino is an archived front-end productivity/todo app prototype built for a school assignment.
It keeps the original concept: organize tasks/projects and motivate progress through APPoints gamification.

> Archived demo notice: this repository is educational and **not production-secure**.

## Project overview
- Static front-end app (HTML/CSS/JS + jQuery + Bootstrap).
- Login/sign-up demo flow stored in RestDB records.
- Todo management connected to Todoist APIs.
- Leaderboard/reward prototype for APPoints.

## Original context
This codebase was created as a student web assignment and later cleaned up for safe archival/demo use.

## Features
- Landing page and brand identity.
- Login/sign-up page.
- Main app UI with projects, tasks, add modals, leaderboard, and rewards display.
- Todoist-backed project/task CRUD actions.

## Tech stack
- HTML5
- CSS3
- JavaScript (ES6)
- jQuery
- Bootstrap 5
- Todoist API v1 (`https://api.todoist.com/api/v1`)
- RestDB.io
- Moment.js + DateRangePicker

## Setup instructions
1. Clone/download this repository.
2. Open `index.html` locally (or serve with any static server).
3. Configure your own RestDB + Todoist credentials (no real credentials are included in this repo).

## Todoist API token setup (local/demo)
### 1) Generate a personal Todoist API token
- Open Todoist account settings and create/copy your personal API token from Todoist developer/account token settings.
- API docs reference used for this migration: `https://developer.todoist.com/api/v1/`.

### 2) Paste token in app UI
- Go to `login.html`.
- Use the **Todoist API Token** field in Login (or Sign Up).
- On submit, token is stored in `localStorage.API_KEY` for this local demo session.

### 3) Important safety warning
- **Never commit your token**.
- Do not paste tokens into source files.
- Do not paste tokens into `README.md`.

## API v1 migration note
This project was migrated from older Todoist REST patterns to Todoist API v1 paths:
- Base: `https://api.todoist.com/api/v1`
- Projects: `/projects`
- Tasks: `/tasks`
- Task close/reopen/update/delete paths use v1 endpoints.
- Authorization uses `Authorization: Bearer <token>`.

## Security note
- This is a static front-end demo and cannot truly hide API tokens.
- Any token stored in browser storage is user-accessible by design.
- Production-grade auth/secret handling requires a backend.

## Known limitations
- Client-side auth pattern is educational, not secure.
- Static front-end apps cannot safely keep long-lived secrets.
- External CDN dependencies may break independently of this repo.

## Screenshots / demo placeholder
- Add local screenshots here if desired.

## Credits
- Original OrDino student team.
- Bootstrap, jQuery, Todoist docs, Moment.js, and DateRangePicker communities.
