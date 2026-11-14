# Focus Gate — a Chrome extension that asks "What are you here for?"

Every new tab asks what you're here for: **JRF prep, an assignment, submitting an assignment, a form, a boxed opportunity hunt, or something else**. You type the exact task and how long it will take. After that, only the sites for that task open until the timer ends.

## Install (2 minutes)

1. Download this folder (`focus-extension/`) to your computer. On GitHub: **Code → Download ZIP**, then unzip it.
2. In Chrome, open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and choose the `focus-extension` folder.
4. On the Focus Gate card, open **Details** and turn on **Allow in Incognito**. Without this, Incognito is a way around the blocking.
5. Pin it: click the puzzle-piece icon, then the pin next to Focus Gate.

## What it does

| Feature | How it works |
|---|---|
| **The gate** | Every new tab asks what you're here for. Opening a site with no session running sends you to the gate first. |
| **Study sources** | Each session type opens a list of sites. JRF prep includes NTA/UGC, IGNOU eGyanKosh, SWAYAM, e-PG Pathshala, Shodhganga, NPTEL, NCERT, archive.org, Wikipedia, Britannica, JSTOR, Testbook, Unacademy, Adda247, StudyIQ, YouTube, JRF Sadhana, Google Docs/Drive, Notion and Quizlet. **If you add a site on the gate page, it's remembered for next time.** You can also edit the lists in Settings. |
| **Detours** | If you open a site that isn't on the list, you get a "Not part of this session" page. To open it anyway, you write why you need it. Without AI, the site opens after a 30-second wait. With AI on, Claude decides. You can tick "Always allow for JRF prep" for real sources. |
| **AI gatekeeper** (optional) | With an Anthropic API key, Claude checks each detour **and each Google/YouTube search** against the goal you typed. If it says no, you can still override after a 90-second wait, and the override is logged. |
| **YouTube study mode** | Lectures, playlists and search work. The home feed and Shorts are blocked during a session. |
| **AI-chat cap** | ChatGPT, Gemini, Claude and Perplexity are capped at 15 minutes per session. You get a warning 3 minutes before the cap. |
| **Boxed opportunity hunt** | 20 minutes, once a day. When it ends, you save each opportunity with its link and deadline in the **Opportunity list**, so you don't have to search for it again. If an "I should look for fellowships" thought comes up during study, click 🎯 to save it and keep going. |
| **Parking lot** | When a random thought comes up, type it in and go back to work. It waits for you on the dashboard. |
| **Time log** | Time per site and per goal for today, the last 7 days, every session with the note "what I finished", and every detour you asked for. Time only counts when Chrome is focused and you've been active in the last 2 minutes. |
| **Warnings** | 5 minutes before the session ends; when the AI-chat cap is close; after 1 hour on any one site in a day; after your third detour in a session ("your brain may want a break, not a new tab"). |
| **Check-in** | When time is up, you write one line about what you finished. Then you can start the next session, add 15 minutes, or stop. |
| **Breaks** | 3 breaks of 10 minutes a day, when everything opens. When a break ends, the gate comes back by itself. |

## Anti-loophole setup (ADHD edition)

The blocker isn't the main defence. The goal is to make giving in **slower than the urge**. An ADHD urge usually fades in 2–5 minutes, so every escape route has a wait built in:

- **Detours wait 30 seconds or need an AI yes.** Overriding the AI waits 90 seconds and is logged.
- **Settings are locked during a session.** You can't loosen the rules while you're in the middle of an urge.
- **Pausing the blocker takes 5 minutes.** You have to write a reason and keep the Settings page open. If you walk away, the request expires.
- **Breaks are allowed** (3 a day), so you don't need to break the tool to get some rest.

The main way to get around it is removing the extension at `chrome://extensions`, and Chrome doesn't let an extension stop that. Ways to close it off:

1. **Use a separate Chrome profile for study** that has Focus Gate installed. Keep fun browsing on your phone or in another browser you don't open while studying. That way there's never a reason to turn the gate off.
2. **Make Chrome the only browser on the study laptop.** Uninstall Edge or Firefox, or hide them from the taskbar.
3. **Turn Incognito off completely** (stronger than "Allow in Incognito"):
   - Windows: run `reg add HKLM\SOFTWARE\Policies\Google\Chrome /v IncognitoModeAvailability /t REG_DWORD /d 1 /f` in an admin Command Prompt.
   - Mac: run `defaults write com.google.Chrome IncognitoModeAvailability -integer 1`, then restart Chrome.
4. **Find an accountability buddy.** Each Sunday, send a friend a screenshot of your dashboard. Knowing someone will see the log is surprisingly strong.
5. **Notice the loop.** The dashboard shows which blocked site you tried to open most. That site is what your habit reaches for, so it's worth knowing.

For a harder lock you can't undo in the moment, add **Cold Turkey Blocker** (Windows/Mac). It runs outside the browser and can lock its own block until a set time. Use it together with Focus Gate.

## On your phone

Chrome on Android and iPhone **doesn't support extensions**, so use the phone's built-in tools to get the same "why are you here?" flow:

**Android**
- **Digital Wellbeing → Focus mode:** pick the distracting apps (Instagram, YouTube, Chrome if needed) and set a study-hours schedule.
- **App timers** (Digital Wellbeing → Dashboard): give ChatGPT and Instagram 15–20 minutes a day each.
- **one sec** app (free tier): when you open a chosen app, it asks you to take a breath and say why you're opening it. This is the same idea as the gate. Use it on ChatGPT, Instagram and YouTube.
- Optional: install **Firefox for Android** with the **LeechBlock NG** add-on, which supports per-site schedules and a lockdown. Then turn off Chrome's app timer so Chrome can't be used for browsing.

**iPhone**
- **Settings → Screen Time → App Limits:** 15 minutes for ChatGPT and social apps. Have a friend set the Screen Time passcode so you don't know it. This is the iPhone equivalent of locked settings.
- **Focus → Study:** allow only the apps you study with and silence everything else. Schedule it for study hours.
- **one sec** works on iPhone too, through a Shortcuts automation.

**Both phones:** keep the JRF Sadhana link (and your other study sites) on your home screen. Move social apps off the home screen into a folder on the last page. One extra swipe cuts down a lot of automatic opening.

## Your data

Everything (logs, notes, the opportunity list, your API key) is stored only in Chrome on this computer, in the extension's local storage. The API key is sent only to `api.anthropic.com`, and only when AI checks are on. Use **Settings → Download my log** for a backup. The download leaves out your API key.

## Files

| File | What it is |
|---|---|
| `manifest.json` | Extension definition (Manifest V3) |
| `background.js` | Blocks sites, tracks time, sends warnings, ends sessions |
| `common.js` | Session types, default site lists, URL matching |
| `ai.js` | Optional Claude check (Claude Opus 5.5 by default; Sonnet 5.5 or Haiku 5.5 in Settings for lower cost) |
| `gate.html/js` | New tab: ask, running session, blocked page, check-in |
| `dashboard.html/js` | Time log, opportunity list, parked thoughts, session history |
| `options.html/js` | Settings, pause with a cooling-off wait, data export |
| `popup.html/js` | Toolbar popup: current goal and time left |
