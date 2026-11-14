// Kind, ADHD-aware messages. {goal}, {focused} (time focused today) and {left} are filled in.

export const CHEERS = [
  "You're still on “{goal}”. That's the whole game — staying. 💚",
  "{focused} of real focus today. Your future self is quietly grateful.",
  "Progress, not perfection. One more small piece of “{goal}”.",
  "Your brain isn't broken — it just needs one thing at a time. You're doing exactly that.",
  "Every MCQ you do now is one you won't panic over in the exam hall. Keep going.",
  "Starting was the hardest part, and you already did it. ✨",
  "{left} left. You can do almost anything for {left}.",
  "Tiny steps still count. Especially tiny steps.",
  "You chose this task on purpose. That version of you knew what mattered.",
  "If it feels boring right now, that's normal. Boring is where the marks are.",
  "Remember why: JRF means doing the research you love, and getting paid for it. 📚",
  "You've already beaten the hardest bit of ADHD today: you started.",
  "Done is better than perfect. Messy notes still teach you.",
  "Check in with your body: shoulders down, sip of water, back in. 💧",
  "You're building a streak of keeping promises to yourself. That's huge.",
  "Notice how calm it is when only one thing is open? That's yours.",
  "Your pace is fine. Slow and steady still reaches the exam hall.",
  "Historians read one source at a time too. You're in good company.",
  "One page, one question, one paragraph. Then the next one.",
  "You don't have to feel motivated to keep going. You just have to keep going. 🌱",
  "You are not behind. You're exactly where today's work begins.",
  "Be proud of the focus you've already given “{goal}”.",
  "Shabaash! Keep this rhythm going. 💪",
  "Thoda aur — just a little more, then a proper break."
];

export const NUDGES = [
  "Hey, you've been browsing outside a session. Want to start a 25-minute one? You've got this.",
  "No pressure — just a soft check: what did you open Chrome for?",
  "Wandering is normal for ADHD brains. Coming back is the skill. Open a new tab to pick one thing.",
  "A 10-minute session counts. Want to try one tiny piece of JRF prep?",
  "Your goals are still waiting kindly for you. Pick one small thing? 🌱"
];

export const CELEBRATE = [
  "Done! 🎉 That's a real win.",
  "Ticked off! Your brain just got a little dopamine — you earned it. ✨",
  "Yes! One less thing in your head. 💚",
  "Look at you finishing things! 🙌",
  "Small step, done. That's how big things get built.",
  "Boom. Next tiny step? 🚀"
];

export const COMEBACK = [
  "Nice catch 💚 Choosing your task over the detour is the hard part, and you just did it.",
  "Welcome back! Noticing the drift is a superpower.",
  "That was your focus muscle working. Back to it ✨"
];

export const HYDRATE = [
  "You've been at it a long time — hyperfocus alert! Water, stretch, 2 minutes away from the screen. 💧",
  "Long stretch of work 👏 Your body needs a minute: water, stand up, look out of a window."
];

export const STUCK_TIPS = [
  "Make it smaller: what's the first 2-minute action? Just open the file / read the first question.",
  "5-minute rule: set a 5-minute timer and only promise yourself those 5 minutes.",
  "Write the ugliest first draft possible. You'll fix it later.",
  "Switch to an easier part of the same task for 10 minutes, then come back.",
  "Say the next step out loud, like you're explaining to a friend.",
  "Body double: put on a 'study with me' video or call a friend who studies too.",
  "Move your body for 2 minutes (walk, jumping jacks), then sit back down.",
  "If you're tired or hungry, that's not laziness — eat something, then try again."
];

export const pick = (list) => list[Math.floor(Math.random() * list.length)];

export const fill = (text, vars) =>
  text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""));
