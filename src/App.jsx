import { useState, useEffect } from "react";

const EXAMS = {
  stats: { label: "AP Stats", color: "#f472b6", softColor: "#fce7f3", icon: "📊" },
  apush: { label: "APUSH", color: "#fb923c", softColor: "#ffedd5", icon: "🏛️" },
  psych: { label: "AP Psych", color: "#c084fc", softColor: "#f3e8ff", icon: "🧠" },
};

const XP_TABLE = {
  stats: [
    { id: "mcq", label: "10 MCQs", xp: 10, emoji: "✏️" },
    { id: "frq", label: "FRQ practice", xp: 20, emoji: "📝" },
    { id: "video", label: "Unit review video + notes", xp: 15, emoji: "🎬" },
    { id: "error", label: "Error log fix session", xp: 20, emoji: "🔍" },
  ],
  apush: [
    { id: "sfi", label: "SFI dump", xp: 10, emoji: "🗂️" },
    { id: "mcq", label: "20 MCQs", xp: 15, emoji: "✏️" },
    { id: "dbq", label: "DBQ/LEQ outline", xp: 25, emoji: "📜" },
    { id: "gizmo", label: "Gizmo full review", xp: 15, emoji: "💻" },
  ],
  psych: [
    { id: "video", label: "10-min video + flashcards", xp: 10, emoji: "🎬" },
    { id: "mcq", label: "10 MCQs / recall", xp: 10, emoji: "✏️" },
  ],
};

const SCHEDULE = [
  { date: "4/21", day: "Tue", missions: { stats: "Unit 1: Top 10 tips + 10 MCQs", apush: "Period 1: SFI dump (1491–1607)", psych: "Video: Unit 1 (Bio Bases)" }, buffer: false, boss: false },
  { date: "4/22", day: "Wed", missions: { stats: "Unit 2: Slope/r² + 10 MCQs", apush: "Period 2 (1607–1754)", psych: "Video: Unit 2 (Sensation)" }, buffer: false, boss: false },
  { date: "4/23", day: "Thu", missions: { stats: "Buffer / Error log: Units 1–2", apush: "Period 3 (1754–1800)", psych: "OFF ✨" }, buffer: true, boss: false },
  { date: "4/24", day: "Fri", missions: { stats: "Unit 3: Exp. design + 10 MCQs", apush: "Period 4 (1800–1848)", psych: "Video: Unit 3 (Consciousness)" }, buffer: false, boss: false },
  { date: "4/25", day: "Sat", missions: { stats: "Unit 4: Prob / Binomial / Geometric", apush: "Period 5 (1844–1877)", psych: "Video: Unit 4 (Learning)" }, buffer: false, boss: false },
  { date: "4/26", day: "Sun", missions: { stats: "Buffer / Error log: Units 3–4", apush: "Period 6 (1865–1898)", psych: "OFF ✨" }, buffer: true, boss: false },
  { date: "4/27", day: "Mon", missions: { stats: "Unit 5: Sampling distributions", apush: "Period 7 (1890–1945)", psych: "Video: Unit 5 (Cognition)" }, buffer: false, boss: false },
  { date: "4/28", day: "Tue", missions: { stats: "Unit 6: Inference proportions", apush: "Period 8 (1945–1980)", psych: "Video: Unit 6 (Developmental)" }, buffer: false, boss: false },
  { date: "4/29", day: "Wed", missions: { stats: "Buffer / Error log: Units 5–6", apush: "Period 9 (1980–pres)", psych: "OFF ✨" }, buffer: true, boss: false },
  { date: "4/30", day: "Thu", missions: { stats: "Unit 7: Inference means", apush: "SFI dump: Periods 1–5", psych: "Video: Unit 7 (Motiv/Emot)" }, buffer: false, boss: false },
  { date: "5/1", day: "Fri", missions: { stats: "Unit 8: Chi-square", apush: "SFI dump: Periods 6–9", psych: "Video: Unit 8 (Disorders)" }, buffer: false, boss: false },
  { date: "5/2", day: "Sat", missions: { stats: "Buffer / Error log: Units 7–8", apush: "DBQ practice: annotation skills", psych: "OFF ✨" }, buffer: true, boss: false },
  { date: "5/3", day: "Sun", missions: { stats: "Unit 9: Slope inference + decision tree", apush: "LEQ practice: outline 3 prompts", psych: "Video: Unit 9 (Social Psych)" }, buffer: false, boss: false },
  { date: "5/4", day: "Mon", missions: { stats: "⚔️ Boss Fight: Full MCQ sim", apush: "⚔️ Boss Fight: Full MCQ sim", psych: "OFF ✨" }, buffer: false, boss: true },
  { date: "5/5", day: "Tue", missions: { stats: "Calculator blitz + cheat sheet", apush: "Timeline: key dates & acts", psych: "OFF ✨" }, buffer: false, boss: false },
  { date: "5/6", day: "Wed", missions: { stats: "Final polish: FRQ verbs", apush: "Mental maps: era connections", psych: "OFF ✨" }, buffer: false, boss: false },
  { date: "5/7", day: "Thu", missions: { stats: "🌸 EXAM DAY: AP Stats", apush: "Light pre-exam review", psych: "Restart: Units 1–3" }, buffer: false, boss: true, exam: "stats" },
  { date: "5/8", day: "Fri", missions: { stats: "✅ Done!", apush: "🌸 EXAM DAY: APUSH", psych: "Restart: Units 4–6" }, buffer: false, boss: true, exam: "apush" },
  { date: "5/9", day: "Sat", missions: { stats: "—", apush: "—", psych: "Full Sim 1 + vocab blitz" }, buffer: false, boss: false },
  { date: "5/10", day: "Sun", missions: { stats: "—", apush: "—", psych: "Full Sim 2 + error log" }, buffer: false, boss: false },
  { date: "5/11", day: "Mon", missions: { stats: "—", apush: "—", psych: "Final vocab cram + FRQs" }, buffer: false, boss: false },
  { date: "5/12", day: "Tue", missions: { stats: "✅ Done!", apush: "✅ Done!", psych: "🌸 EXAM DAY: AP Psych" }, buffer: false, boss: true, exam: "psych" },
];

const STORE_ITEMS = [
  { id: "doom1", cost: 15, emoji: "📱", title: "20 min of doomscrolling", desc: "Guilt-free. You earned it.", category: "screen" },
  { id: "doom2", cost: 25, emoji: "🎥", title: "Full YouTube rabbit hole", desc: "Anything goes. No studying content.", category: "screen" },
  { id: "tv1", cost: 20, emoji: "📺", title: "Watch a full episode", desc: "Whatever show you've been putting off.", category: "screen" },
  { id: "movie", cost: 35, emoji: "🎀", title: "Movie night", desc: "Popcorn, blanket, full film — no guilt.", category: "screen" },
  { id: "snack1", cost: 10, emoji: "🧁", title: "Bake brownies", desc: "Box mix counts. Treat yourself fr.", category: "treat" },
  { id: "snack2", cost: 10, emoji: "🍦", title: "Ice cream break", desc: "Go get your favorite flavor rn.", category: "treat" },
  { id: "boba", cost: 15, emoji: "🧋", title: "Boba run", desc: "You deserve a brown sugar matcha.", category: "treat" },
  { id: "takeout", cost: 20, emoji: "🍜", title: "Order your fave takeout", desc: "Pick up the phone, no cooking tonight.", category: "treat" },
  { id: "nails", cost: 20, emoji: "💅", title: "Do your nails", desc: "Pick a color, put on a show, relax.", category: "selfcare" },
  { id: "spa", cost: 25, emoji: "🛁", title: "Full spa evening", desc: "Mask + bath + candles + playlist.", category: "selfcare" },
  { id: "walk", cost: 10, emoji: "🌿", title: "Solo walk outside", desc: "10 min of fresh air. Your brain needs it.", category: "selfcare" },
  { id: "shop1", cost: 30, emoji: "🛍️", title: "Amazon treat (under $15)", desc: "Something small & cute. You pick.", category: "shop", link: "https://www.amazon.com/s?k=cute+desk+accessories+aesthetic" },
  { id: "shop2", cost: 40, emoji: "🖊️", title: "Cute stationery haul", desc: "Pens, sticky notes, highlighters.", category: "shop", link: "https://www.amazon.com/s?k=aesthetic+stationery+set" },
  { id: "shop3", cost: 50, emoji: "✨", title: "Skincare treat", desc: "A new mask, serum, or lip gloss.", category: "shop", link: "https://www.amazon.com/s?k=skincare+self+care+gift" },
  { id: "flowers", cost: 20, emoji: "💐", title: "Buy yourself flowers", desc: "You're doing amazing. Get them.", category: "shop" },
  { id: "mystery", cost: 20, emoji: "🎁", title: "Mystery reward", desc: "Tap to reveal a surprise treat...", category: "mystery", mystery: true },
];

const MYSTERY_REVEALS = [
  "Text your best friend something genuinely nice 💌",
  "Take a 10-min walk outside — you need real air 🌿",
  "Make a fancy coffee or matcha and drink it slowly ☕",
  "Do a 5-minute dance break right now 💃",
  "Rewatch your absolute comfort show episode 🌙",
  "Go drive somewhere with the windows down 🚗",
  "Spend 30 minutes doing literally nothing ✨",
  "Call someone you love just to chat 📞",
  "Try a new recipe tonight — something fun 🍳",
  "Go to bed early. Seriously. Sleep is the reward. 😴",
];

const LEVELS = [
  { min: 0, max: 49, level: 1, title: "just started ☁️", color: "#f9a8d4" },
  { min: 50, max: 99, level: 2, title: "getting there 🌸", color: "#f472b6" },
  { min: 100, max: 149, level: 3, title: "she's built different 🔥", color: "#ec4899" },
  { min: 150, max: Infinity, level: 4, title: "boss girl mode 👑", color: "#be185d" },
];

const TODAY = new Date().toLocaleDateString("en-US", { month: "numeric", day: "numeric" });

function getDayLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0];
}

export default function Dashboard() {
  const [xpLog, setXpLog] = useState(() => { try { return JSON.parse(localStorage.getItem("xp_log3") || "{}"); } catch { return {}; } });
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem("coins3") || "0"));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("streak3") || "0"));
  const [purchased, setPurchased] = useState(() => { try { return JSON.parse(localStorage.getItem("purchased3") || "[]"); } catch { return []; } });
  const [tab, setTab] = useState("today");
  const [toasts, setToasts] = useState([]);
  const [revealedMystery, setRevealedMystery] = useState(null);
  const [filter, setFilter] = useState("all");
  const [confetti, setConfetti] = useState([]);
  const [streakClaimed, setStreakClaimed] = useState(() => localStorage.getItem("streak_day3") === TODAY);

useEffect(() => {
  const lastDay = localStorage.getItem("last_day");
  if (lastDay !== TODAY) {
    localStorage.setItem("last_day", TODAY);
    localStorage.setItem("streak_claimed2", "");
    setStreakClaimed(false);
  }
}, []);

  const todaySchedule = SCHEDULE.find(d => d.date === TODAY) || SCHEDULE[0];
  const dailyXP = Object.values(xpLog[TODAY] || {}).reduce((a, b) => a + b, 0);
  const dayLevel = getDayLevel(dailyXP);

  function addToast(msg, emoji) {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, emoji }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }

  function spawnConfetti() {
    const pieces = Array.from({ length: 22 }, (_, i) => ({
      id: i + Date.now(), x: 10 + Math.random() * 80,
      color: ["#f9a8d4","#fbcfe8","#fde68a","#a5f3fc","#c4b5fd","#86efac","#fca5a5","#fed7aa"][i % 8],
      size: 5 + Math.random() * 9, delay: Math.random() * 0.5, rot: Math.random() * 360,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 2000);
  }

  function earnXP(subject, task) {
    const key = `${subject}_${task.id}`;
    if ((xpLog[TODAY] || {})[key]) return;
    const dayLog = { ...(xpLog[TODAY] || {}), [key]: task.xp };
    const newLog = { ...xpLog, [TODAY]: dayLog };
    const newCoins = coins + task.xp;
    setXpLog(newLog); setCoins(newCoins);
    localStorage.setItem("xp_log3", JSON.stringify(newLog));
    localStorage.setItem("coins3", newCoins);
    addToast(`+${task.xp} coins!`, task.emoji);
    spawnConfetti();
  }

  function buyItem(item) {
    if (coins < item.cost) { addToast("need more coins 💸", "🥲"); return; }
    if (item.mystery) {
      const reveal = MYSTERY_REVEALS[Math.floor(Math.random() * MYSTERY_REVEALS.length)];
      setRevealedMystery(reveal);
    }
    const newCoins = coins - item.cost;
    const newPurchased = [...purchased, { id: item.id, ts: Date.now() }];
    setCoins(newCoins); setPurchased(newPurchased);
    localStorage.setItem("coins3", newCoins);
    localStorage.setItem("purchased3", JSON.stringify(newPurchased));
    addToast(`unlocked: ${item.title}`, item.emoji);
    spawnConfetti();
    if (item.link) setTimeout(() => window.open(item.link, "_blank"), 600);
  }

  function claimStreak() {
    if (streakClaimed) return;
    const n = streak + 1; setStreak(n); setStreakClaimed(true);
    localStorage.setItem("streak3", n); localStorage.setItem("streak_day3", TODAY);
    addToast(`${n} day streak! 🔥`, "🌸"); spawnConfetti();
  }

  const filteredStore = filter === "all" ? STORE_ITEMS : STORE_ITEMS.filter(i => i.category === filter);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fff1f6 0%, #fdf4ff 50%, #fff8f0 100%)", fontFamily: "'Georgia', serif", position: "relative", overflowX: "hidden" }}>

      {/* Soft blobs */}
      <div style={{ position: "fixed", top: -100, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #fbcfe855 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -80, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #e9d5ff44 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "45%", right: "5%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, #fed7aa33 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Confetti */}
      {confetti.map(p => (
        <div key={p.id} style={{ position: "fixed", left: `${p.x}%`, top: "-10px", width: p.size, height: p.size, background: p.color, borderRadius: Math.random() > 0.5 ? "50%" : 2, pointerEvents: "none", zIndex: 9999, transform: `rotate(${p.rot}deg)`, animation: `cffall 1.8s ${p.delay}s ease-in forwards` }} />
      ))}

      {/* Toast stack */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9998, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: "white", border: "1.5px solid #fce7f3", borderRadius: 20, padding: "10px 18px", fontSize: 13, color: "#be185d", boxShadow: "0 4px 24px rgba(244,114,182,0.2)", animation: "toastpop 0.3s cubic-bezier(0.34,1.56,0.64,1)", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 18 }}>{t.emoji}</span> {t.msg}
          </div>
        ))}
      </div>

      {/* Mystery modal */}
      {revealedMystery && (
        <div onClick={() => setRevealedMystery(null)} style={{ position: "fixed", inset: 0, background: "rgba(255,240,246,0.85)", backdropFilter: "blur(12px)", zIndex: 9997, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "white", border: "2px solid #f9a8d4", borderRadius: 28, padding: "44px 52px", maxWidth: 380, textAlign: "center", boxShadow: "0 24px 80px rgba(244,114,182,0.25)", animation: "toastpop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎁</div>
            <div style={{ fontSize: 11, color: "#f472b6", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>your mystery treat</div>
            <div style={{ fontSize: 21, color: "#831843", fontWeight: "bold", lineHeight: 1.5 }}>{revealedMystery}</div>
            <div style={{ marginTop: 28, fontSize: 12, color: "#e9c4d0" }}>tap anywhere to close</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes cffall { to { transform: translateY(110vh) rotate(540deg); opacity: 0; } }
        @keyframes toastpop { from { transform: scale(0.75) translateX(16px); opacity: 0; } to { transform: scale(1) translateX(0); opacity: 1; } }
        @keyframes floaty { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-7px); } }
        .tab-btn { background: transparent; border: none; font-family: Georgia, serif; font-size: 13px; color: #d1aab8; padding: 10px 18px; cursor: pointer; border-radius: 22px; transition: all 0.2s; }
        .tab-btn:hover { color: #be185d; background: rgba(244,114,182,0.07); }
        .tab-btn.active { color: #be185d; background: white; box-shadow: 0 2px 16px rgba(244,114,182,0.18); font-weight: bold; }
        .task-row { background: white; border: 1.5px solid #fce7f3; border-radius: 14px; padding: 11px 16px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center; }
        .task-row:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(244,114,182,0.13); border-color: #f9a8d4; }
        .task-row.done { opacity: 0.4; cursor: default; transform: none !important; box-shadow: none !important; }
        .store-card { background: white; border: 1.5px solid #fce7f3; border-radius: 20px; padding: 22px; cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden; }
        .store-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, #fff0f6, transparent); opacity: 0; transition: opacity 0.2s; }
        .store-card:hover { transform: translateY(-5px); box-shadow: 0 12px 36px rgba(244,114,182,0.18); border-color: #f9a8d4; }
        .store-card:hover::before { opacity: 1; }
        .pill { background: transparent; border: 1.5px solid #fce7f3; color: #d1aab8; padding: 6px 16px; border-radius: 22px; font-family: Georgia, serif; font-size: 12px; cursor: pointer; transition: all 0.2s; }
        .pill.on { background: #fce7f3; color: #be185d; border-color: #f9a8d4; }
        .pill:hover { border-color: #f9a8d4; color: #be185d; }
        .sched-row { display: grid; grid-template-columns: 70px 1fr 1fr 1fr; padding: 10px 18px; font-size: 11.5px; border-bottom: 1px solid #fff0f6; transition: background 0.15s; }
        .sched-row:hover { background: rgba(249,168,212,0.04); }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ padding: "28px 28px 0", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 5, color: "#e0a0bb", textTransform: "uppercase", marginBottom: 6 }}>✦ ap sprint 2026 ✦</div>
            <div style={{ fontSize: 30, color: "#831843", fontWeight: "bold", lineHeight: 1, letterSpacing: -0.5 }}>
              study dashboard
            </div>
            <div style={{ fontSize: 13, color: "#f472b6", fontStyle: "italic", marginTop: 4 }}>for her era 🌸</div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ background: "white", border: "1.5px solid #fde68a", borderRadius: 18, padding: "14px 20px", textAlign: "center", boxShadow: "0 4px 20px rgba(251,191,36,0.15)", minWidth: 80 }}>
              <div style={{ fontSize: 24 }}>🪙</div>
              <div style={{ fontSize: 22, color: "#92400e", fontWeight: "bold", lineHeight: 1.1 }}>{coins}</div>
              <div style={{ fontSize: 10, color: "#d97706", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>coins</div>
            </div>
            <div style={{ background: "white", border: "1.5px solid #fce7f3", borderRadius: 18, padding: "14px 20px", textAlign: "center", boxShadow: "0 4px 20px rgba(244,114,182,0.12)", minWidth: 80 }}>
              <div style={{ fontSize: 24 }}>🔥</div>
              <div style={{ fontSize: 22, color: "#be185d", fontWeight: "bold", lineHeight: 1.1 }}>{streak}</div>
              <div style={{ fontSize: 10, color: "#f472b6", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>streak</div>
            </div>
            <div style={{ background: "white", border: "1.5px solid #fce7f3", borderRadius: 18, padding: "14px 20px", textAlign: "center", boxShadow: "0 4px 20px rgba(244,114,182,0.12)", minWidth: 110 }}>
              <div style={{ fontSize: 11, color: dayLevel.color, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>today</div>
              <div style={{ fontSize: 20, color: "#831843", fontWeight: "bold", lineHeight: 1.1 }}>{dailyXP}<span style={{ fontSize: 12, fontWeight: "normal", color: "#d1aab8" }}> xp</span></div>
              <div style={{ fontSize: 11, color: dayLevel.color, fontStyle: "italic", marginTop: 2 }}>{dayLevel.title}</div>
              <div style={{ marginTop: 8, height: 5, background: "#fce7f3", borderRadius: 10 }}>
                <div style={{ height: "100%", width: `${Math.min(100, (dailyXP / 150) * 100)}%`, background: `linear-gradient(90deg, #f9a8d4, ${dayLevel.color})`, borderRadius: 10, transition: "width 0.7s ease" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: 24, background: "#fff0f6", borderRadius: 26, padding: "4px", display: "inline-flex", gap: 2, boxShadow: "inset 0 1px 4px rgba(244,114,182,0.1)" }}>
          {[["today","🌸 Today"], ["schedule","📅 Schedule"], ["store","🛍️ Rewards"], ["guide","✨ XP Guide"]].map(([id, label]) => (
            <button key={id} className={`tab-btn ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 28px 60px", position: "relative", zIndex: 1 }}>

        {/* ══ TODAY ══ */}
        {tab === "today" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 14, color: "#be185d" }}>{todaySchedule.day}, {todaySchedule.date}</span>
              {todaySchedule.boss && <span style={{ background: "#fff0f0", color: "#ef4444", fontSize: 11, padding: "3px 12px", borderRadius: 20, border: "1px solid #fecaca", fontStyle: "italic" }}>⚔️ boss day</span>}
              {todaySchedule.buffer && <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 11, padding: "3px 12px", borderRadius: 20, border: "1px solid #bbf7d0", fontStyle: "italic" }}>🛡️ buffer day</span>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 18, marginBottom: 20 }}>
              {Object.entries(EXAMS).map(([key, exam]) => {
                const earned = Object.entries(xpLog[TODAY] || {}).filter(([k]) => k.startsWith(key)).reduce((a, [, v]) => a + v, 0);
                return (
                  <div key={key} style={{ background: "white", borderRadius: 22, padding: 22, border: `1.5px solid ${exam.color}30`, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `${exam.softColor}`, opacity: 0.6 }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, position: "relative" }}>
                      <div style={{ fontSize: 15, color: exam.color, fontWeight: "bold" }}>{exam.icon} {exam.label}</div>
                      {earned > 0 && <div style={{ fontSize: 11, background: exam.softColor, color: exam.color, padding: "3px 10px", borderRadius: 20, fontWeight: "bold" }}>+{earned} 🪙</div>}
                    </div>
                    <div style={{ fontSize: 12, color: "#9d6b7a", background: exam.softColor, borderRadius: 12, padding: "10px 14px", marginBottom: 14, fontStyle: "italic", lineHeight: 1.5, position: "relative" }}>
                      {todaySchedule.missions[key]}
                    </div>
                    <div style={{ fontSize: 10, color: "#d1aab8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>log completed ↓</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {XP_TABLE[key].map(task => {
                        const done = !!(xpLog[TODAY] || {})[`${key}_${task.id}`];
                        return (
                          <div key={task.id} className={`task-row ${done ? "done" : ""}`} onClick={() => !done && earnXP(key, task)}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 16 }}>{done ? "✅" : task.emoji}</span>
                              <span style={{ fontSize: 12, color: done ? "#c9a0b0" : "#7c3d54", textDecoration: done ? "line-through" : "none" }}>{task.label}</span>
                            </div>
                            <span style={{ fontSize: 12, color: done ? "#e0c4cc" : exam.color, fontWeight: "bold", whiteSpace: "nowrap" }}>+{task.xp} 🪙</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Claim streak */}
            <div style={{ background: "white", borderRadius: 22, padding: "22px 26px", border: "1.5px solid #fce7f3", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, boxShadow: "0 4px 24px rgba(244,114,182,0.1)" }}>
              <div>
                <div style={{ fontSize: 15, color: "#831843", fontWeight: "bold" }}>done for today? 🌙</div>
                <div style={{ fontSize: 12, color: "#d1aab8", marginTop: 4, fontStyle: "italic" }}>close the books, claim your streak, go rest.</div>
              </div>
              <button onClick={claimStreak} disabled={streakClaimed} style={{ background: streakClaimed ? "#fce7f3" : "linear-gradient(135deg, #f9a8d4, #ec4899)", border: "none", borderRadius: 18, color: streakClaimed ? "#d1aab8" : "white", padding: "13px 28px", fontSize: 13, cursor: streakClaimed ? "default" : "pointer", fontFamily: "Georgia, serif", fontWeight: "bold", boxShadow: streakClaimed ? "none" : "0 6px 24px rgba(236,72,153,0.3)", transition: "all 0.2s" }}>
                {streakClaimed ? "✓ streak claimed today!" : "✦ end day + claim streak 🔥"}
              </button>
            </div>
          </div>
        )}

        {/* ══ STORE ══ */}
        {tab === "store" && (
          <div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 22, color: "#831843", fontWeight: "bold" }}>reward store ✨</div>
                <div style={{ fontSize: 12, color: "#d1aab8", marginTop: 4, fontStyle: "italic" }}>you earned it — spend your coins on things that actually bring joy</div>
              </div>
              <div style={{ background: "white", border: "1.5px solid #fde68a", borderRadius: 18, padding: "10px 20px", fontSize: 16, color: "#92400e", fontWeight: "bold", boxShadow: "0 4px 16px rgba(251,191,36,0.2)" }}>
                🪙 {coins} coins available
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
              {[["all","✦ all"], ["screen","📱 screen time"], ["treat","🍬 food treats"], ["selfcare","💅 self-care"], ["shop","🛍️ shop"], ["mystery","🎁 mystery"]].map(([id, label]) => (
                <button key={id} className={`pill ${filter === id ? "on" : ""}`} onClick={() => setFilter(id)}>{label}</button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16 }}>
              {filteredStore.map(item => {
                const canAfford = coins >= item.cost;
                const timesGot = purchased.filter(p => p.id === item.id).length;
                return (
                  <div key={item.id} className="store-card" onClick={() => buyItem(item)} style={{ opacity: canAfford ? 1 : 0.55 }}>
                    <div style={{ fontSize: 38, marginBottom: 12, display: "inline-block", animation: "floaty 3s ease-in-out infinite" }}>{item.emoji}</div>
                    <div style={{ fontSize: 14, color: "#7c3d54", fontWeight: "bold", marginBottom: 6, lineHeight: 1.3 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "#b07d8e", marginBottom: 18, lineHeight: 1.6 }}>{item.desc}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ background: canAfford ? "linear-gradient(135deg, #f9a8d4, #ec4899)" : "#fce7f3", color: canAfford ? "white" : "#d1aab8", padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: "bold", boxShadow: canAfford ? "0 4px 14px rgba(236,72,153,0.25)" : "none" }}>
                        🪙 {item.cost}
                      </div>
                      {timesGot > 0 && <div style={{ fontSize: 11, color: "#d1aab8", fontStyle: "italic" }}>×{timesGot} redeemed</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ SCHEDULE ══ */}
        {tab === "schedule" && (
          <div>
            <div style={{ fontSize: 22, color: "#831843", fontWeight: "bold", marginBottom: 18 }}>full sprint 📅</div>
            <div style={{ background: "white", borderRadius: 22, overflow: "hidden", border: "1.5px solid #fce7f3", boxShadow: "0 4px 24px rgba(244,114,182,0.08)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 1fr 1fr", padding: "12px 18px", background: "#fff5f9", borderBottom: "1.5px solid #fce7f3", fontSize: 10, color: "#d1aab8", letterSpacing: 2.5, textTransform: "uppercase" }}>
                <div>date</div>
                <div style={{ color: "#f472b6" }}>📊 stats</div>
                <div style={{ color: "#fb923c" }}>🏛️ apush</div>
                <div style={{ color: "#c084fc" }}>🧠 psych</div>
              </div>
              {SCHEDULE.map((d, i) => {
                const isToday = d.date === TODAY;
                return (
                  <div key={d.date} className="sched-row" style={{ background: isToday ? "#fff0f6" : d.exam ? "#fff8f0" : d.buffer ? "#f0fdf4" : "white", borderLeft: isToday ? "3px solid #f472b6" : "3px solid transparent" }}>
                    <div>
                      <div style={{ color: isToday ? "#be185d" : "#b07d8e", fontWeight: isToday ? "bold" : "normal" }}>{d.day}</div>
                      <div style={{ color: isToday ? "#f472b6" : "#e0c4cc", fontSize: 10 }}>{d.date}</div>
                    </div>
                    <div style={{ color: d.missions.stats.includes("EXAM") ? "#be185d" : "#9d6b7a", paddingRight: 10 }}>{d.missions.stats}</div>
                    <div style={{ color: d.missions.apush.includes("EXAM") ? "#be185d" : "#9d6b7a", paddingRight: 10 }}>{d.missions.apush}</div>
                    <div style={{ color: d.missions.psych.includes("EXAM") ? "#be185d" : d.missions.psych.startsWith("OFF") ? "#e5d0dc" : "#9d6b7a" }}>{d.missions.psych}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 12, fontSize: 11, color: "#d1aab8" }}>
              <span>🌸 today</span><span style={{ color: "#fb923c" }}>⚠️ exam day</span><span style={{ color: "#16a34a" }}>🛡️ buffer day</span>
            </div>
          </div>
        )}

        {/* ══ XP GUIDE ══ */}
        {tab === "guide" && (
          <div>
            <div style={{ fontSize: 22, color: "#831843", fontWeight: "bold", marginBottom: 20 }}>how coins work ✨</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginBottom: 24 }}>
              {Object.entries(EXAMS).map(([key, exam]) => (
                <div key={key} style={{ background: "white", border: `1.5px solid ${exam.color}30`, borderTop: `4px solid ${exam.color}`, borderRadius: 22, padding: 22, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                  <div style={{ color: exam.color, fontWeight: "bold", fontSize: 15, marginBottom: 16 }}>{exam.icon} {exam.label}</div>
                  {XP_TABLE[key].map(task => (
                    <div key={task.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #fce7f3", fontSize: 12 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#7c3d54" }}><span>{task.emoji}</span>{task.label}</div>
                      <span style={{ color: exam.color, fontWeight: "bold", whiteSpace: "nowrap", marginLeft: 8 }}>+{task.xp} 🪙</span>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ background: "white", border: "1.5px solid #fce7f3", borderTop: "4px solid #f472b6", borderRadius: 22, padding: 22, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                <div style={{ color: "#f472b6", fontWeight: "bold", fontSize: 15, marginBottom: 16 }}>⚡ daily power levels</div>
                {LEVELS.map(l => (
                  <div key={l.level} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #fce7f3", fontSize: 12 }}>
                    <div style={{ color: l.color, fontStyle: "italic" }}>{l.title}</div>
                    <div style={{ color: "#d1aab8" }}>{l.min}–{l.max === Infinity ? "∞" : l.max} xp</div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => { if (confirm("reset all your progress?")) { setXpLog({}); setCoins(0); setStreak(0); setPurchased([]); setStreakClaimed(false); localStorage.clear(); }}} style={{ background: "transparent", border: "1.5px solid #fce7f3", color: "#d1aab8", padding: "10px 22px", borderRadius: 20, cursor: "pointer", fontFamily: "Georgia", fontSize: 12, transition: "all 0.2s" }}>
              reset save data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
