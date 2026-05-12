# OrDino (Archived Student Demo)

OrDino is an archived front-end productivity/todo web app prototype created for a school assignment.
It combines task organization with light gamification (APPoints tiers and rewards) to encourage consistency.

> Archived demo notice: This repository is preserved as a student project. It is **not production-safe** and uses simplified client-side patterns for learning purposes.

## Original context
- Built as a static website assignment focused on UI, API integration, and gamification concepts.
- Core concept preserved: users sign in, manage Todoist tasks/projects, and track APPoints/reward tiers.

## Features
- Landing page with OrDino branding and app concept.
- Login/Sign-up interface (demo-style, client-side flow).
- Main dashboard with:
  - Project list
  - Active task list
  - Add project/task modals
  - Leaderboard and rewards panels
  - APPoints mechanics

## Tech stack
- HTML5
- CSS3
- JavaScript (ES6)
- jQuery
- Bootstrap 5
- Todoist REST API (user-provided token)
- RestDB.io (user-provided database + API key)
- Moment.js + DateRangePicker
- Ionicons + Lottie assets

## Setup instructions
1. Clone or download this repository.
2. Open `index.html` directly in a browser, or serve the folder with a simple static server.
3. Configure API credentials (see below) before expecting live API features to work.

## API configuration (required for live data)
This project no longer ships with real credentials.

Replace placeholders in JavaScript with your own values:
- `YOUR_RESTDB_API_KEY`
- `YOUR_TODOIST_API_TOKEN`

Current placeholder locations:
- `js/login.js`
- `js/main.js`

Notes:
- Login/sign-up here is demo-style and client-side.
- For real-world usage, move authentication and secret handling to a secure backend.

## Security note
- This is an archived student demo and is **not production-ready**.
- Do not store plaintext passwords or secrets in front-end code.
- Do not expose API keys in public repositories.
- Treat this codebase as educational/reference only.

## Known limitations
- Client-side login architecture is insecure by design.
- API availability depends on your own RestDB/Todoist setup.
- Some gamification rules are prototype-level and not fully hardened.
- External CDN assets (Lottie/JS libs) can fail if upstream URLs change.

## Screenshots / demo
- Add screenshots in this section if you want to document your local demo state.
- Optional: include a hosted demo link if you deploy with your own credentials.

## Credits
- Student creators of the original OrDino assignment.
- Bootstrap, jQuery, Moment.js, DateRangePicker, Ionicons, and Lottie communities.
- Learning references originally included by the student team.
