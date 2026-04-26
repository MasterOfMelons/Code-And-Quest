// Uses global: world, lessons, zoneLessons, bosses, lessonHints, cutscenes, Preview, React, ReactDOM
const h = React.createElement;


const SAVE_KEY = "cq_progress_guided_v2";      // your existing save slot
const SETTINGS_KEY = "cq_settings_v1";         // new: settings storage

function safeJsonParse(raw, fallback = null) {
  if (raw == null || raw === "") return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

/* ======================== Badges ======================== */
const BADGE_DEFS = {
  FIRST_CLEAR:  { id: "FIRST_CLEAR",  name: "First Clear",       tip: "Pass your first quest." },
  NO_HINT:      { id: "NO_HINT",      name: "No-Hint Hero",      tip: "Clear a quest without using hints." },
  PRACTICE_3:   { id: "PRACTICE_3",   name: "Practice Starter",  tip: "Pass 3 Practice drills." },
  ZONE1_CLEAR:  { id: "ZONE1_CLEAR",  name: "Canyon Cleared",    tip: "Defeat the Component Canyon boss." },
  ZONE2_CLEAR:  { id: "ZONE2_CLEAR",  name: "Plains Cleared",    tip: "Defeat the Prop Plains boss." },
  ZONE3_CLEAR:  { id: "ZONE3_CLEAR",  name: "Swamp Cleared",     tip: "Defeat the State Swamp boss." },
  PERFECT_BOSS: { id: "PERFECT_BOSS", name: "Perfect Duel",      tip: "Beat any boss without taking damage." },
  FINAL_CLEAR:  { id: "FINAL_CLEAR",  name: "World Restored", tip: "Defeat the Rogue Hacker." },
};

/* ======================== Crayons Cosmetic Rewards ======================== */
const CRAYON_DEFS = {
  SKY:   { id: "SKY",   name: "Sky Crayon",   tip: "Soft blue glow.",     color: "#60a5fa" },
  MINT:  { id: "MINT",  name: "Mint Crayon",  tip: "Fresh green glow.",   color: "#34d399" },
  GOLD:  { id: "GOLD",  name: "Gold Crayon",  tip: "Victory gold glow.",  color: "#fbbf24" },
  VIOLET:{ id: "VIOLET",name: "Violet Crayon",tip: "Arcane purple glow.", color: "#a78bfa" },
};


function App() {

  /* ============ Core state ============ */
  const zones = world.zones;
  const [currentZone, setCurrentZone] = React.useState(zones[0].id);
  const [currentLesson, setCurrentLesson] = React.useState(zoneLessons[zones[0].id][0]);

  const [codeById, setCodeById] = React.useState({});
  const [completed, setCompleted] = React.useState({});         // lessonId -> true
  const [completedBoss, setCompletedBoss] = React.useState({}); // zoneId -> true

  const [xp, setXp] = React.useState(0);
    function getLevelFromXp(xp) {
      return Math.floor(xp / 100) + 1;
}

    function getXpIntoLevel(xp) {
      return xp % 100;
}

    function getXpForNextLevel() {
       return 100;
}

const level = getLevelFromXp(xp);
const xpIntoLevel = getXpIntoLevel(xp);
const xpToNext = getXpForNextLevel();
const [log, setLog] = React.useState([]);

  // meta
const [mode, setMode] = React.useState("launch"); // launch screen first
const [returnMode, setReturnMode] = React.useState("launch");
const [showIntro, setShowIntro] = React.useState(false);
const [showHowTo, setShowHowTo] = React.useState(false);

    // launch / save settings
  const [started, setStarted] = React.useState(false);   // gates play until user chooses
  const [autoSave, setAutoSave] = React.useState(true);  // autosave to localStorage
  const fileInputRef = React.useRef(null);               // for Import Save file picker

  // per-lesson tab
  const [lessonTab, setLessonTab] = React.useState("learn"); // "learn" | "quest"

  // hints
  const [hintIndexByLesson, setHintIndexByLesson] = React.useState({}); // lessonId -> n used
  const usedHintThisAttempt = (id) => (hintIndexByLesson[id] ?? 0) > 0;

  // boss
  const [bossZone, setBossZone] = React.useState(null);
  const [bossHP, setBossHP] = React.useState(0);
  const [playerHP, setPlayerHP] = React.useState(0);
  const [bossCode, setBossCode] = React.useState("");
  const [bossLog, setBossLog] = React.useState([]);
  const [playerTookDamage, setPlayerTookDamage] = React.useState(false);
  const [bossPhase, setBossPhase] = React.useState(0);
  const [lastBossCodeSnapshot, setLastBossCodeSnapshot] = React.useState("");

  // cutscene
  const [sceneLines, setSceneLines] = React.useState([]);
  const [scenePtr, setScenePtr] = React.useState(0);

  // badges
  const [badges, setBadges] = React.useState({}); // id -> true

  // Commented out just in case it interfiers wit top one:
  // const SAVE_KEY = "cq_progress_guided_v2"; // bump to avoid UI cache collisions

    // crayons (cosmetics)
  const [unlockedCrayons, setUnlockedCrayons] = React.useState({ SKY: true }); // SKY unlocked by default
  const [activeCrayon, setActiveCrayon] = React.useState("SKY");

  // ===== Launch screen derived UI (must be in App scope) =====
const hasLocalSave = !!localStorage.getItem(SAVE_KEY);
const badgeCount = Object.keys(badges || {}).length;

const tips = [
  "Tip: Read Learn, but match Quest goals exactly.",
  "Tip: Boss phases change - rewrite before each strike.",
  "Tip: No-Hint Hero badge rewards clean clears.",
  "Tip: Practice your JSX like a blade form.",
];
const tipOfTheDay = tips[(xp + badgeCount) % tips.length];



// ===== World Map layout visual positions =====
const MAP_LAYOUT = {
  zones: {
    zone1: { x: 8,  y: 18, w: 24, h: 54, biome: "canyon", title: "Component Canyon" },
    zone2: { x: 39, y: 11, w: 24, h: 42, biome: "plains", title: "Prop Plains" },
    zone3: { x: 68, y: 28, w: 24, h: 50, biome: "swamp",  title: "State Swamp" },
  },

  paths: [
    { from: "zone1", to: "zone2" },
    { from: "zone2", to: "zone3" },
  ],
};

// Auto build mission nodes for ALL lessons in a zone.
function buildMissionNodesForZone(zid) {
  const z = MAP_LAYOUT.zones[zid];
  const ids = zoneLessons[zid] || [];
  if (!z || ids.length === 0) return [];

  const nodes = [];

  // inner padding inside each zone box
  const left = z.x + z.w * 0.18;
  const right = z.x + z.w * 0.82;
  const top = z.y + z.h * 0.18;
  const bottom = z.y + z.h * 0.82;
  const centerX = z.x + z.w * 0.5;

  if (zid === "zone1") {
    // single clean vertical path
    const stepY = ids.length > 1 ? (bottom - top) / (ids.length - 1) : 0;

    ids.forEach((lessonId, i) => {
      nodes.push({
        lessonId,
        x: centerX,
        y: bottom - i * stepY,
      });
    });
  }

  if (zid === "zone2") {
    // Squiggled line path inside zone 2
    const cols = 3;
    const rows = Math.ceil(ids.length / cols);
    const usableWidth = right - left;
    const usableHeight = bottom - top;

    const colStep = cols > 1 ? usableWidth / (cols - 1) : 0;
    const rowStep = rows > 1 ? usableHeight / (rows - 1) : 0;

    ids.forEach((lessonId, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const snakeCol = row % 2 === 0 ? col : (cols - 1 - col);

      nodes.push({
        lessonId,
        x: left + snakeCol * colStep,
        y: bottom - row * rowStep,
      });
    });
  }

  if (zid === "zone3") {
    // taller snake path for more lessons
    const cols = 3;
    const rows = Math.ceil(ids.length / cols);
    const usableWidth = right - left;
    const usableHeight = bottom - top;

    const colStep = cols > 1 ? usableWidth / (cols - 1) : 0;
    const rowStep = rows > 1 ? usableHeight / (rows - 1) : 0;

    ids.forEach((lessonId, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const snakeCol = row % 2 === 0 ? col : (cols - 1 - col);

      nodes.push({
        lessonId,
        x: left + snakeCol * colStep,
        y: bottom - row * rowStep,
      });
    });
  }

  return nodes;
}

  /* ============ Persist ============ */
React.useEffect(() => {
  const s = safeJsonParse(localStorage.getItem(SETTINGS_KEY), { autoSave: true });
  if (typeof s.autoSave === "boolean") setAutoSave(s.autoSave);
}, []);
  // Save settings
  React.useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ autoSave }));
  }, [autoSave]);

  // Auto-save progress, (only if started + enabled)
  React.useEffect(() => {
    if (!started || !autoSave) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify(makeSaveObject()));

    // Once we have any save, never pop up the tutorials again
        if (!localStorage.getItem("cq_intro_ack")) localStorage.setItem("cq_intro_ack","1");
        if (!localStorage.getItem("cq_howto_ack")) localStorage.setItem("cq_howto_ack","1");

  }, [
    started, autoSave,
    currentZone, currentLesson, codeById, completed, completedBoss, xp, mode,
    hintIndexByLesson, badges, unlockedCrayons, activeCrayon
  ]);

React.useEffect(() => {
  if (lessonLocked(currentLesson)) {
    setCurrentLesson(zoneLessons[currentZone][0]);
    setLessonTab("learn");
  }
}, [currentZone]);

  React.useEffect(() => {
    const c = (CRAYON_DEFS[activeCrayon] && CRAYON_DEFS[activeCrayon].color) || "#10b981";
    document.documentElement.style.setProperty("--accent", c);
  }, [activeCrayon]);

  

  /* ============ Helpers ============ */
  function makeSaveObject() {
    return {
      version: 1,
      savedAt: new Date().toISOString(),
      currentZone, currentLesson, codeById, completed, completedBoss, xp, mode,
      hintIndexByLesson, badges,
      unlockedCrayons, activeCrayon
    };
  }

  function applySave(s) {
    if (!s || typeof s !== "object") return;

    if (s.currentZone) setCurrentZone(s.currentZone);
    if (s.currentLesson) setCurrentLesson(s.currentLesson);
    if (s.codeById) setCodeById(s.codeById);
    if (s.completed) setCompleted(s.completed);
    if (s.completedBoss) setCompletedBoss(s.completedBoss);
    if (s.xp != null) setXp(s.xp);
    if (s.mode) setMode(s.mode);
    if (s.hintIndexByLesson) setHintIndexByLesson(s.hintIndexByLesson);
    if (s.badges) setBadges(s.badges);
    if (s.unlockedCrayons) setUnlockedCrayons(s.unlockedCrayons);
    if (s.activeCrayon) setActiveCrayon(s.activeCrayon);
  }

  function startNewGame() {
    setCurrentZone(world.zones[0].id);
    setCurrentLesson(zoneLessons[world.zones[0].id][0]);
    setCodeById({});
    setCompleted({});
    setCompletedBoss({});
    setXp(0);
    setLog([]);
    setHintIndexByLesson({});
    setBadges({});
    setUnlockedCrayons({ SKY: true });
    setActiveCrayon("SKY");

    setMode("map");
    setStarted(true);

    // Only show intro/how-to for truly new players
    const hadSave = !!localStorage.getItem(SAVE_KEY);
        if (!hadSave) {
          setShowIntro(true);
}
  }

  function openHowTo() {
  setReturnMode(mode);
  setMode("howto");
}

function openSettings() {
  setReturnMode(mode);
  setMode("settings");
}

function goBackFromMenuPage() {
  setMode(returnMode || (started ? "map" : "launch"));
}

  function loadLocalSave() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      alert("No local save found yet.");
      return;
    }
    const s = safeJsonParse(raw, null);
    if (!s) {
      alert("Local save is corrupted.");
      return;
    }
    applySave(s);
    setMode("map");
    setStarted(true);
  }

  function saveLocalNow() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(makeSaveObject()));
    setLog(prev => [...prev, ["ok", "💾 Saved to device."]]);
  }

function resetProgress() {
  const ok = confirm("Reset ALL progress on this device?\n\nThis will clear your save, badges, crayons, and settings.");
  if (!ok) return;

  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(SETTINGS_KEY);

  localStorage.removeItem("cq_intro_ack");
  localStorage.removeItem("cq_howto_ack");

  // Reset all state back to new game default
  setCurrentZone(world.zones[0].id);
  setCurrentLesson(zoneLessons[world.zones[0].id][0]);

  setCodeById({});
  setCompleted({});
  setCompletedBoss({});
  setXp(0);
  setLog([]);

  setHintIndexByLesson({});
  setBadges({});

  setUnlockedCrayons({ SKY: true });
  setActiveCrayon("SKY");

  setStarted(false);
  setMode("launch");

  setShowIntro(true);
  setShowHowTo(false);
}

  function exportSaveFile() {
    const data = JSON.stringify(makeSaveObject(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "code-and-quest-save.json";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  function openImportDialog() {
    fileInputRef.current && fileInputRef.current.click();
  }

  function onImportFilePicked(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const s = safeJsonParse(String(reader.result || ""), null);
      if (!s) {
        alert("That save file couldn't be read.");
        return;
      }
      applySave(s);
      setMode("map");
      setStarted(true);
    };
    reader.readAsText(file);

    e.target.value = "";
  }

  function grantBadge(id) {
    if (badges[id]) return;
    setBadges(b => ({ ...b, [id]: true }));
    setLog(prev => [...prev, ["ok", `🏅 Badge earned: ${BADGE_DEFS[id].name}`]]);
  }

  function zoneCleared(zid) {
    const ids = zoneLessons[zid] || [];
    return ids.every(id => completed[id]);
  }

  function zoneLocked(zid) {
    const order = world.unlocks || zones.map(z => z.id);
    const idx = order.indexOf(zid);
    if (idx <= 0) return false; // first zone never locked
    const prev = order[idx - 1];
    return !completedBoss[prev];
  }

  function lessonLocked(lessonId) {
  const ids = zoneLessons[currentZone] || [];
  const idx = ids.indexOf(lessonId);

  // first lesson in zone is always unlocked
  if (idx <= 0) return false;

  // lock lesson if previous lesson not completed
  const prevId = ids[idx - 1];
  return !completed[prevId];
}

  const visibleLessons = React.useMemo(() => {
    const ids = zoneLessons[currentZone] || [];
    return lessons.filter(l => ids.includes(l.id));
  }, [currentZone]);

  const activeLesson = lessons.find(l => l.id === currentLesson) || visibleLessons[0];
  const code = codeById[currentLesson] ?? (activeLesson.starter || "");
  const setCode = v => setCodeById(prev => ({ ...prev, [currentLesson]: v }));

  /* ============ Lesson flow ============ */
  function submitLesson() {
    const errs = activeLesson.checks ? activeLesson.checks(code) : [];
    if (errs.length) { setLog(errs.map(e => ["bad", e])); return; }

    // success
    const firstTime = !completed[currentLesson];
    if (firstTime) {
      setCompleted(p => ({ ...p, [currentLesson]: true }));
      setXp(x => x + (activeLesson.xp || 10));
      if (!Object.values(completed).some(Boolean)) grantBadge("FIRST_CLEAR");
      if (!usedHintThisAttempt(currentLesson)) grantBadge("NO_HINT");
    }
    setHintIndexByLesson(m => ({ ...m, [currentLesson]: 0 }));
    setLog([["ok", `✔ Passed! +${activeLesson.xp || 10} XP`]]);

    // next lesson in zone
    const inZone = zoneLessons[currentZone];
    const idx = inZone.indexOf(currentLesson);
    const nextId = inZone[idx + 1];
    if (nextId) { setCurrentLesson(nextId); setLessonTab("learn"); }
  }

  function showHint() {
    const hints = (window.lessonHints && window.lessonHints[currentLesson]) || [];
    if (hints.length === 0) {
      setLog(prev => [...prev, ["bad", "No hints for this quest (yet)."]]);
      return;
    }
    setHintIndexByLesson(m => {
      const next = (m[currentLesson] ?? 0) + 1;
      const tip = hints[Math.min(next - 1, hints.length - 1)];
      setLog(prev => [...prev, ["ok", `Hint: ${tip}`]]);
      return { ...m, [currentLesson]: next };
    });
  }

  /* ============ UI bits ============ */
const LaunchScreen = h("div", { className: "launch game-bg" },
  h("div", { className: "game-frame" },

    // Left: Title
    h("div", { className: "game-titleblock" },
      h("img", {
        src: "code-and-quest-logo.png",
        alt: "Code and Quest logo",
        className: "launch-logo"
      }),
      h("div", { className: "game-title" }, "CODE & QUEST"),
      h("div", { className: "game-version" }, "v0.6 • local saves • bosses"),
      h("div", { className: "game-subtitle" }, "A React RPG- battle bugs, earn loot, level up."),
      h("div", { className: "game-flavor small" },
        "⚔ The world is corrupted by syntax. Your keyboard is your sword."
      )
    ),

    // Center: Main Menu panel
    h("div", { className: "game-panel" },
      h("div", { className: "game-panel-head" }, "Main Menu"),
      h("div", { className: "game-panel-body" },

        hasLocalSave
          ? h("button", { className: "btn btn-primary big", onClick: loadLocalSave }, "Continue ▶")
          : h("button", { className: "btn btn-primary big", onClick: startNewGame }, "Start Adventure ▶"),

        h("button", { className: "btn btn-ghost big", onClick: startNewGame }, "New Game +"),

        h("div", { className: "menu-divider" }),

        h("button", { className: "btn btn-ghost", onClick: loadLocalSave, disabled: !hasLocalSave }, "Load Local Save"),
        h("button", { className: "btn btn-ghost", onClick: exportSaveFile }, "Export Save File"),
        h("button", { className: "btn btn-ghost", onClick: openImportDialog }, "Import Save File"),

        h("div", { className: "menu-divider" }),

        h("label", { className: "small", style: { display: "flex", gap: 8, alignItems: "center" } },
          h("input", {
            type: "checkbox",
            checked: autoSave,
            onChange: e => setAutoSave(e.target.checked)
          }),
          "Auto-save to this device"
        ),

        h("div", { style: { marginTop: 10, display: "flex", justifyContent: "flex-end" } },
          h("button", { className: "btn btn-ghost", onClick: resetProgress }, "Reset Progress 🗑️")
        )
      )
    ),

    // Right: Profile/tips/rewards
    h("div", { className: "game-panel" },
      h("div", { className: "game-panel-head" }, "Adventurer Profile"),
      h("div", { className: "game-panel-body" },

        h("div", { className: "profile-row" },
          h("div", { className: "profile-label" }, "XP"),
          h("div", { className: "profile-value" }, String(xp))
        ),

        h("div", { className: "xp-bar" },
      h("div", {
          className: "xp-fill",
            style: { width: (xpIntoLevel / xpToNext * 100) + "%" }
  })
),
h("div", { className: "small", style: { marginTop: 6, opacity: 0.9 } },
  `Level ${level} - ${xpToNext - xpIntoLevel} XP to next level`
),

        h("div", { className: "profile-row" },
          h("div", { className: "profile-label" }, "Badges"),
          h("div", { className: "profile-value" }, String(badgeCount))
        ),
        h("div", { className: "profile-row" },
          h("div", { className: "profile-label" }, "Crayon"),
          h("div", { className: "profile-value" }, activeCrayon)
        ),

        h("div", { className: "menu-divider" }),

        h("div", { className: "quest-tip" }, "📜 " + tipOfTheDay),

        h("div", { className: "menu-divider" }),

        h("button", { className: "btn btn-ghost", onClick: openHowTo }, "How to Play")
      )
    )
  )
);
  
  const TopBar = h("div", { className: "topbar" },
        h("div", { className: "brand" },
          h("img", {
            className: "logo-img",
            src: "code-and-quest-logo.png",
            alt: "Code and Quest logo"
          }),
          h("div", null,
            h("div", { style: { fontWeight: 700 } }, "Code & Quest"),
            h("div", { className: "small" }, "Learn React While Playing")
          )
        ),

        h("div", { className: "small", style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" } },

      !started && h("button", { className: "btn btn-ghost", onClick: () => setMode("launch"), style: { borderColor: mode === "launch" ? "var(--accent)" : "#2e3440" } }, "Launch"),

      started && h("button", { className: "btn btn-ghost", onClick: () => setMode("map"), style: { borderColor: mode === "map" ? "var(--accent)" : "#2e3440" } }, "Map"),

      started && h("button", { className: "btn btn-ghost", onClick: () => setMode("play"), style: { borderColor: mode === "play" ? "var(--accent)" : "#2e3440" } }, "Quests"),

      started && h("button", { className: "btn btn-ghost", onClick: () => setMode("practice"), style: { borderColor: mode === "practice" ? "var(--accent)" : "#2e3440" } }, "Practice"),

      h("button", {
        className: "btn btn-ghost",
        onClick: openHowTo,
        style: { borderColor: mode === "howto" ? "var(--accent)" : "#2e3440" }
      }, "How to Play"),

      h("button", {
        className: "btn btn-ghost",
        onClick: openSettings,
        style: { borderColor: mode === "settings" ? "var(--accent)" : "#2e3440" }
      }, "Settings"),

      h("span", { style: { border: "1px solid #2e3440", padding: "2px 8px", borderRadius: 999 } }, `Lv ${level} • XP ${xpIntoLevel}/${xpToNext}`)
    )
  );

const MapPanel = h("div", { className: "worldmap" },

  // ===== SVG paths between zones =====
  h("svg", { className: "map-svg", viewBox: "0 0 100 100", preserveAspectRatio: "none" },
    MAP_LAYOUT.paths.map((p, i) => {
      const a = MAP_LAYOUT.zones[p.from];
      const b = MAP_LAYOUT.zones[p.to];
      if (!a || !b) return null;

      const ax = a.x + a.w / 2;
      const ay = a.y + a.h / 2;
      const bx = b.x + b.w / 2;
      const by = b.y + b.h / 2;

      const cx1 = ax + (bx - ax) * 0.35;
      const cy1 = ay;
      const cx2 = ax + (bx - ax) * 0.65;
      const cy2 = by;

      const d = `M ${ax} ${ay} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${bx} ${by}`;
      return h("path", { key: i, d, className: "map-path-svg" });
    })
  ),

  // ===== Zone regions =====
  zones.map(z => {
    const zr = MAP_LAYOUT.zones[z.id];
    if (!zr) return null;

    const locked = zoneLocked(z.id);
    const selected = currentZone === z.id;

    return h(React.Fragment, { key: `zone-wrap-${z.id}` },

      h("div", {
        className:
          "zone-label " +
          (locked ? "locked " : "") +
          (selected ? "selected " : ""),
        style: {
          left: `${zr.x + 1}%`,
          top: `${Math.max(2, zr.y - 7)}%`,
        }
      },
        h("div", { className: "zone-label-title" }, z.name),
        h("div", { className: "zone-label-sub" }, locked ? "Locked" : `Foes: ${z.enemy}`)
      ),

      h("button", {
        key: `zone-${z.id}`,
        className:
          "zone-region biome-" + zr.biome +
          (locked ? " locked" : "") +
          (selected ? " selected" : ""),
        style: {
          left: `${zr.x}%`,
          top: `${zr.y}%`,
          width: `${zr.w}%`,
          height: `${zr.h}%`,
        },
        disabled: locked,
        onClick: () => {
          if (locked) return;
          setCurrentZone(z.id);
          setCurrentLesson(zoneLessons[z.id][0]);
          setLessonTab("learn");
        }
      },
        locked && h("div", { className: "zone-lock" }, "🔒")
      )
    );
  }),

  // ===== Mission nodes =====
  zones.flatMap(z => {
    const zid = z.id;
    const zLocked = zoneLocked(zid);
    const nodes = buildMissionNodesForZone(zid);

    return nodes.map((n, idx) => {
      const lessonId = n.lessonId;
      const zoneIds = zoneLessons[zid] || [];
      const lessonIndex = zoneIds.indexOf(lessonId);

      const locked = zLocked || (lessonIndex > 0 && !completed[zoneIds[lessonIndex - 1]]);
      const done = !!completed[lessonId];
      const active = currentLesson === lessonId;

      return h("button", {
        key: `${zid}-m-${idx}`,
        className:
          "mission-node " +
          (done ? "done " : "") +
          (active ? "active " : "") +
          (locked ? "locked " : ""),
        style: { left: `${n.x}%`, top: `${n.y}%` },
        disabled: locked,
        onClick: (e) => {
          e.stopPropagation();
          if (locked) return;
          setCurrentZone(zid);
          setCurrentLesson(lessonId);
          setLessonTab("learn");
          setMode("play");
        }
      }, locked ? "🔒" : done ? "✓" : String(lessonIndex + 1));
    });
  }),

  // ===== Boss nodes =====
  zones.map(z => {
    const zr = MAP_LAYOUT.zones[z.id];
    if (!zr) return null;

    const pos = { x: zr.x + zr.w * 0.82, y: zr.y + zr.h * 0.18 };
    const zLocked = zoneLocked(z.id);
    const canBoss = canFightBoss(z.id);
    const bossDone = !!completedBoss[z.id];
    const locked = zLocked || !zoneCleared(z.id);

    return h("button", {
      key: `boss-${z.id}`,
      className:
        "boss-node " +
        (bossDone ? "done " : "") +
        (canBoss ? "ready " : "") +
        (locked ? "locked " : ""),
      style: { left: `${pos.x}%`, top: `${pos.y}%` },
      disabled: locked || bossDone,
      onClick: (e) => {
        e.stopPropagation();
        if (locked || bossDone) return;
        enterBossRoom(z.id);
      }
    }, bossDone ? "🏆" : locked ? "🔒" : "👑");
  }),

  // ===== Final boss node =====
  (() => {
    const finalUnlocked = canFightFinalBoss();
    const finalDone = !!completedBoss.final;

    return h("button", {
      key: "final-boss",
      className:
        "final-boss-node " +
        (finalDone ? "done " : "") +
        (finalUnlocked ? "ready " : "locked "),
      style: {
        left: "50%",
        top: "88%",
        transform: "translate(-50%, -50%)",
        position: "absolute",
        zIndex: 6,
        width: "88px",
        height: "88px",
        borderRadius: "999px",
        border: "2px solid #fbbf24",
        background: finalDone
          ? "rgba(16,185,129,0.22)"
          : finalUnlocked
          ? "rgba(251,191,36,0.16)"
          : "rgba(100,116,139,0.16)",
        boxShadow: finalUnlocked
          ? "0 0 30px rgba(251,191,36,0.35)"
          : "none",
        fontSize: "1.8rem",
        fontWeight: 800
      },
      disabled: !finalUnlocked || finalDone,
      onClick: (e) => {
        e.stopPropagation();
        if (!finalUnlocked || finalDone) return;
        enterBossRoom("final");
      },
      title: finalDone
        ? "Final boss defeated"
        : finalUnlocked
        ? "Final boss unlocked"
        : "Defeat all zone bosses first"
    }, finalDone ? "🏆" : finalUnlocked ? "☠" : "🔒");
  })(),

  // ===== Final boss label =====
  (() => {
    const finalUnlocked = canFightFinalBoss();
    const finalDone = !!completedBoss.final;

    return h("div", {
      style: {
        position: "absolute",
        left: "50%",
        top: "95%",
        transform: "translate(-50%, -50%)",
        zIndex: 6,
        textAlign: "center",
        pointerEvents: "none"
      }
    },
      h("div", {
        style: {
          fontWeight: 800,
          fontSize: "0.95rem",
          color: finalUnlocked || finalDone ? "#f8fafc" : "#94a3b8",
          textShadow: "0 2px 10px rgba(0,0,0,0.5)"
        }
      }, "The Rogue Hacker"),
      h("div", {
        className: "small",
        style: {
          color: finalDone ? "#86efac" : finalUnlocked ? "#fcd34d" : "#94a3b8"
        }
      }, finalDone ? "Defeated ✓" : finalUnlocked ? "Final Battle" : "Locked")
    );
  })()
);

const LessonsList = h("div", { className: "panel" },
  h("div", { className: "head" }, "Quests in this Zone"),
  h("div", { className: "body" },
    (zoneLessons[currentZone] || []).map(id => {
      const l = lessons.find(x => x.id === id);
      const done = !!completed[id];
      const active = currentLesson === id;

      const locked = lessonLocked(id);

      const cls =
        "mapbtn" +
        (active ? " active" : "") +
        (done ? " done" : "") +
        (locked ? " locked" : "");

      return h("button", {
        key: id,
        className: cls,
        disabled: locked,
        onClick: () => {
          if (locked) return;
          setCurrentLesson(id);
          setLessonTab("learn");
        },
        style: locked
          ? { opacity: 0.5, cursor: "not-allowed" }
          : {}
      },
        h("div", { style: { fontWeight: 600 } }, l?.title || id),
        h("div", { className: "small" },
          locked ? "Locked - finish previous quest" : `${l.xp} XP`
        )
      );
    })
  )
);

  // Learn tab
  function LearnPanel({ lesson }) {
    const teach = lesson.learn || [];
    const steps = lesson.steps || [];
    return h("div", { className: "panel" },
      h("div", { className: "head" }, "Learn"),
      h("div", { className: "body" },

        // Story
        (lesson.story || []).length > 0 &&
          h("div", { style: { padding: 10, border: "1px dashed #2e3440", borderRadius: 10, marginBottom: 10, background: "rgba(16,185,129,0.06)" } },
            (lesson.story || []).map((t,i)=>h("p",{key:i, className:"small", style:{margin:"6px 0"}}, t))
          ),

        // Loot
        (lesson.loot || []).length > 0 &&
          h("div", { style: { padding: 10, border: "1px solid #2e3440", borderRadius: 10, marginBottom: 10 } },
            h("div", { style: { fontWeight: 700, marginBottom: 4 } }, "Quest Loot"),
            h("ul", { style: { paddingLeft: 18, margin: 0 } },
              (lesson.loot || []).map((b, j) => h("li", { key: j, style: { marginBottom: 4 } }, b))
            )
          ),

        // Teach cards
        teach.length === 0
          ? h("p", { className: "small" }, "No tutorial notes for this quest (yet).")
          : teach.map((card, i) =>
              h("div", { key: i, style: { padding: 10, border: "1px solid #2e3440", borderRadius: 10, marginBottom: 10 } },
                h("div", { style: { fontWeight: 700, marginBottom: 4 } }, card.title),
                h("div", { className: "small", style: { color: "#cbd5e1", marginBottom: 6 } }, card.analogy),
                h("ul", { style: { paddingLeft: 18, margin: 0 } },
                  (card.bullets || []).map((b, j) => h("li", { key: j, style: { marginBottom: 4 } }, b))
                )
              )
            ),

        // Steps
        steps.length > 0 && h("div", { style: { marginTop: 10 } },
          h("div", { className: "small", style: { marginBottom: 6, fontWeight: 700 } }, "Example Path (type these ideas yourself)"),
          steps.map((s, i) =>
            h("div", { key: i, style: { padding: 10, border: "1px solid #2e3440", borderRadius: 10, marginBottom: 10, background: "rgba(96,165,250,0.06)" } },
              h("div", { style: { fontWeight: 700, marginBottom: 4 } }, s.title),
              h("p", { className: "small", style: { marginTop: 0 } }, s.explain),
              h("pre", { className: "small", style: { whiteSpace: "pre-wrap", background: "#0b1220", padding: 8, borderRadius: 8, border: "1px solid #1f2937" } }, s.snippet),
            )
          )
        ),

        // Demo
        lesson.demo && h("div", { style: { marginTop: 10 } },
          h("div", { className: "small", style: { marginBottom: 4, fontWeight: 700 } }, "Demo (read-only)"),
          h(Preview, { code: lesson.demo })
        ),

        // Controls
        h("div", { style: { display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" } },
          h("button", { className: "btn btn-primary", onClick: () => setLessonTab("quest") }, "Go to Quest ▶"),
          h("button", { className: "btn btn-ghost", onClick: () => setCode(activeLesson.starter || "") }, "Reset Editor to Starter")
        )
      )
    );
  }

  const LessonHeader = h("div", { className: "panel" },
    h("div", { className: "head" }, `Quest: ${activeLesson.title}`),
    h("div", { className: "body", style: { display: "flex", gap: 8, alignItems: "center" } },
      h("button", { className: "btn btn-ghost", onClick: () => setLessonTab("learn"),  style: { borderColor: lessonTab === "learn" ? "#10b981" : "#2e3440" } }, "Learn"),
      h("button", { className: "btn btn-ghost", onClick: () => setLessonTab("quest"),  style: { borderColor: lessonTab === "quest" ? "#10b981" : "#2e3440" } }, "Quest"),
      h("span", { className:"small", style:{ marginLeft:"auto", opacity:0.8 }}, "Type code into the editor on the right")
    )
  );

  const QuestPanel = h("div", { className: "panel" },
    h("div", { className: "head" }, "Quest Objectives"),
    h("div", { className: "body" },
      h("p", { className: "small", style: { color: "#cbd5e1", marginTop: 0 } }, "Complete the goals to defeat zone minions."),
      h("ul", { style: { paddingLeft: 18, margin: 0 } }, (activeLesson.goals||[]).map((g,i)=>h("li",{key:i,style:{marginBottom:6}},g))),
      h("div", { style: { display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" } },
        h("button", { className: "btn btn-primary", onClick: submitLesson }, "Submit ✅"),
        h("button", { className: "btn btn-ghost", onClick: () => setCode(activeLesson.starter || "") }, "Reset Editor"),
        h("button", { className: "btn btn-ghost", onClick: showHint }, "Hint 💡")
      )
    )
  );

  const EditorPanel = h("div", { className: "panel" },
    h("div", { className: "body grid2" },
      h("textarea", {
        value: code,
        onChange: e => setCode(e.target.value),
        spellCheck: false,
        placeholder: "Your code goes here. Follow Learn, but match the Quest exactly."
      }),
      h("div", null, h("div", { className: "small", style: { padding: "4px 8px" } }, "Live Preview"), h(Preview, { code }))
    ),
    h("div", { className: "console" }, log.map((l,i)=>h("div",{key:i,className:l[0]==="ok"?"ok":"bad"},l[1])))
  );

  const BadgesPanel = h("div", { className: "panel" },
    h("div", { className: "head" }, "Badges"),
    h("div", { className: "body" },
      Object.values(BADGE_DEFS).map(b =>
        h("div", { key: b.id, className: "small", style: { marginBottom: 6, opacity: badges[b.id] ? 1 : 0.5 } },
          badges[b.id] ? "🏅 " : "⬜ ", b.name, " - ", b.tip
        )
      )
    )
  );

  const CrayonsPanel = h("div", { className: "panel" },
    h("div", { className: "head" }, "Crayons"),
    h("div", { className: "body" },
      h("p", { className: "small", style: { marginTop: 0, color: "#cbd5e1" } },
        "Beat bosses to unlock new crayons (cosmetic themes)."
      ),
      Object.values(CRAYON_DEFS).map(c => {
        const owned = !!unlockedCrayons[c.id];
        return h("button", {
          key: c.id,
          className: "mapbtn" + (activeCrayon === c.id ? " active" : ""),
          disabled: !owned,
          onClick: () => owned && setActiveCrayon(c.id),
          style: {
            opacity: owned ? 1 : 0.4,
            cursor: owned ? "pointer" : "not-allowed",
            borderColor: activeCrayon === c.id ? "var(--accent)" : "#2e3440"
          }
        },
          h("div", { style: { fontWeight: 700 } }, (owned ? "🖍️ " : "🔒 ") + c.name),
          h("div", { className: "small" }, owned ? c.tip : "Locked - defeat bosses")
        );
      })
    )
  );

const MapPage = h("div", { className: "map-page" },

  h("div", { className: "map-main panel" },
    h("div", { className: "head" }, "World Map"),
    h("div", { className: "body" }, MapPanel)
  ),

  h("div", { className: "map-side" },

    h("div", { className: "panel" },
      h("div", { className: "head" }, "Travel"),
      h("div", { className: "body map-side-actions" },
        h("button", { className: "btn btn-primary", onClick: () => setMode("play") }, "Open Quests ▶"),
        h("button", { className: "btn btn-ghost", onClick: saveLocalNow }, "Save 💾"),
        h("button", { className: "btn btn-ghost", onClick: exportSaveFile }, "Export"),
        h("button", { className: "btn btn-ghost", onClick: openImportDialog }, "Import")
      )
    ),

    h("div", { className: "panel" },
      h("div", { className: "head" }, "Current Zone"),
      h("div", { className: "body" },
        h("div", { className: "map-zone-info" },
          h("div", { className: "map-zone-name" }, zones.find(z => z.id === currentZone)?.name || "Unknown Zone"),
          h("div", { className: "small" }, `Quests: ${(zoneLessons[currentZone] || []).length}`),
          h("div", { className: "small" }, `Boss: ${completedBoss[currentZone] ? "Defeated ✓" : zoneCleared(currentZone) ? "Ready" : "Locked"}`)
        )
      )
    ),

    BadgesPanel,
    CrayonsPanel
  )
);

const PlayMain = h("div", { className: "quest-page" },

  h("div", { className: "quest-left" },
    LessonsList
  ),

  h("div", { className: "quest-main" },
    LessonHeader,
    lessonTab === "learn"
      ? h(LearnPanel, { lesson: activeLesson })
      : h("div", null, QuestPanel, EditorPanel)
  ),

  h("div", { className: "quest-right" },
    BadgesPanel,
    CrayonsPanel
  )
);

  /* ================== Boss Room ================== */
  function canFightBoss(zid) { return !!bosses[zid] && zoneCleared(zid) && !completedBoss[zid]; }

  function canFightFinalBoss() {
  return !!completedBoss.zone1 && !!completedBoss.zone2 && !!completedBoss.zone3 && !completedBoss.final;
}

  function enterBossRoom(zid) {
  const b = bosses[zid];
  const phases = b.stages && b.stages.length ? b.stages : null;

  setBossZone(zid);
  setPlayerHP(20);
  setPlayerTookDamage(false);

  // phase setup
  setBossPhase(0);
  setLastBossCodeSnapshot("");

  if (phases) {
    const maxHP = phases.length * 10;     // 10 HP per phase (simple + clear)
    setBossHP(maxHP);
    setBossCode(phases[0].starter);
    setBossLog([
      ["ok", `⚔ ${b.name} appears!`],
      ...(b.intro || []).map(t => ["ok", t]),
      ["ok", `Phase 1/${phases.length}: ${phases[0].title}`],
    ]);
  } else {
    // fallback to old single stage bosses 
    setBossHP(b.hp);
    setBossCode(b.starter);
    setBossLog([["ok", `⚔ ${b.name} appears!`], ...(b.intro || []).map(t => ["ok", t])]);
  }

  setMode("boss");
}


function bossStrike() {
  const b = bosses[bossZone];
  const stages = b.stages && b.stages.length ? b.stages : null;

  // If no stages, can keep old logic
  const stage = stages ? stages[bossPhase] : null;
  const errs = stage?.checks ? stage.checks(bossCode) : (b.checks ? b.checks(bossCode) : []);

  // success: clear phase
  if (errs.length === 0) {
    setBossLog(prev => [
      ...prev,
      ["ok", `Phase ${stages ? bossPhase + 1 : 1} cleared!`],
    ]);

    if (stages) {
      const totalPhases = stages.length;
      const nextPhase = bossPhase + 1;

      // Deal damage
      const nextBossHP = Math.max(0, bossHP - 10);
      setBossHP(nextBossHP);

      // If there is another phase, then swap tasks
      if (nextPhase < totalPhases) {
        setBossPhase(nextPhase);
        setBossCode(stages[nextPhase].starter);

        // Reset antispam lock for new phase
      setLastBossCodeSnapshot("");

        setBossLog(prev => [
          ...prev,
          ["ok", `Phase ${nextPhase + 1}/${totalPhases}: ${stages[nextPhase].title}`],
          ["ok", "New challenge loaded. Rewrite the snippet to strike again."],
        ]);
        return;
      }

      // All phases cleared to victory
      setCompletedBoss(map => ({ ...map, [bossZone]: true }));
      setXp(x => x + (b.rewardXp || 0));
      if (!playerTookDamage) grantBadge("PERFECT_BOSS");

      if (bossZone === "zone1") grantBadge("ZONE1_CLEAR");
      if (bossZone === "zone2") grantBadge("ZONE2_CLEAR");
      if (bossZone === "zone3") grantBadge("ZONE3_CLEAR");
      if (bossZone === "final") grantBadge("FINAL_CLEAR");

            const scene =
        bossZone === "final"
          ? [
              "The Rogue Hacker staggers as the broken code around him begins to dissolve.",
              "The Render Engine stabilizes. Zones reconnect. The world stops flickering.",
              "The Mentor steps forward. “You did more than defeat a boss. You learned how the system works.”",
              "The last corruption fades into harmless light.",
              "Victory. Code & Quest is restored."
            ]
          : (window.cutscenes && window.cutscenes[bossZone]) || ["The corruption fades."];

      setSceneLines(scene);
      setScenePtr(0);
      setMode("cutscene");

      setUnlockedCrayons(m => {
        const next = { ...m };
        if (bossZone === "zone1") next.MINT = true;
        if (bossZone === "zone2") next.GOLD = true;
        if (bossZone === "zone3") next.VIOLET = true;
        return next;
      });

      return;
    }

    // fallback if no stages
    setBossLog(prev => [...prev, ["ok", "Success!"]]);
    return;
  }

// failure: damage and log errors
const dmgIn = Math.min(12, 3 + 2 * errs.length);

setBossLog(prev => [
  ...prev,
  ...errs.map(e => ["bad", `✖ ${e}`]),
  ["bad", `The ${b.name} counterattacks for ${dmgIn}.`],
]);

setPlayerTookDamage(true);

setPlayerHP(hp => {
  const next = Math.max(0, hp - dmgIn);
  if (next <= 0) {
    setBossLog(prev => [...prev, ["bad", "You fall… adjust your code and strike again."]]);
  }
  return next;
});
}



function bossReset() {
  const b = bosses[bossZone];
  const stages = b.stages && b.stages.length ? b.stages : null;
  const starter = stages ? stages[bossPhase].starter : b.starter;

  setBossCode(starter);
  setLastBossCodeSnapshot("");
  setBossLog(prev => [...prev, ["ok", "You steady your hands and rewrite the snippet…"]]);
}

function leaveBossRoom() {
  setBossZone(null);
  setBossHP(0);
  setBossPhase(0);
  setBossCode("");
  setBossLog([]);
  setPlayerHP(0);
  setMode("play");
}

  // Boss UI
  function Bar({ label, value, max }) {
    const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
    return h("div", { style: { marginBottom: 6 } },
      h("div", { className: "small", style: { marginBottom: 2 } }, `${label} ${value}/${max}`),
      h("div", { style: { height: 10, background: "#1f2937", borderRadius: 999, overflow: "hidden", border: "1px solid #2e3440" } },
        h("div", { style: { height: "100%", width: `${pct}%`, background: label.startsWith("Boss") ? "#ef4444" : "#10b981" } })
      )
    );
  }

  // ---- Boss derived data ----
  const bossObj = bossZone ? bosses[bossZone] : null;
  const bossStages = bossObj?.stages && bossObj.stages.length ? bossObj.stages : null;
  const bossMaxHP = bossObj
    ? (bossStages ? bossStages.length * 10 : bossObj.hp)
    : 0;

  const currentBossGoals = bossObj
    ? (bossStages ? (bossStages[bossPhase]?.goals || []) : (bossObj.goals || []))
    : [];

  const bossTitle = bossObj ? bossObj.name : "";

const BossMain = (() => {
  if (!bossZone) return null;

  const b = bosses[bossZone];
  const stages = (b.stages && b.stages.length) ? b.stages : null;

  const bossMaxHP = stages ? stages.length * 10 : (b.hp || 1);
  const currentGoals = stages ? (stages[bossPhase]?.goals || []) : (b.goals || []);

  const phaseLabel = stages
    ? `Phase ${bossPhase + 1}/${stages.length}: ${stages[bossPhase]?.title || ""}`
    : "Boss Fight";

return h("div", { className: "wrap boss-wrap" },

  // LEFT: HP/phase info
  h("div", { className: "panel" },
    h("div", { className: "head" }, `Boss Room - ${b.name}`),
    h("div", { className: "body" },
      h(Bar, { label: "You", value: playerHP, max: 20 }),
      h(Bar, { label: `Boss (${b.name})`, value: bossHP, max: bossMaxHP }),
      h("div", { className: "small", style: { marginTop: 8, opacity: 0.9 } }, phaseLabel),
      h("p", { className: "small", style: { marginTop: 8 } },
        "Meet the goals to deal damage. Mistakes cause a counterattack."
      )
    )
  ),

  // CENTER: Editor + Preview + Console
  h("div", { className: "panel boss-arena" },
    h("div", { className: "head" }, "Battle Console"),
    h("div", { className: "body", style: { borderBottom: "1px solid #2e3440", paddingBottom: 8, display: "flex", gap: 8 } },
      h("button", { className: "btn btn-primary", onClick: bossStrike, disabled: playerHP<=0 || bossHP<=0 }, bossHP<=0 ? "Victory ✓" : playerHP<=0 ? "Defeated…" : "Strike ⚔"),
      h("button", { className: "btn btn-ghost", onClick: bossReset }, "Reset Code"),
      h("button", { className: "btn btn-ghost", onClick: leaveBossRoom }, "Leave"),
      h("div", { style: { marginLeft: "auto" }, className: "small" }, "Write code → Strike")
    ),

    h("div", { className: "body boss-grid" },
      h("textarea", { value: bossCode, onChange: e => setBossCode(e.target.value), spellCheck: false }),
      h("div", null,
        h("div", { className: "small", style: { padding: "4px 8px" } }, "Live Preview"),
        h(Preview, { code: bossCode })
      )
    ),

    h("div", { className: "console boss-console" },
      bossLog.map((l,i)=>h("div",{key:i,className:l[0]==="ok"?"ok":"bad"},l[1]))
    )
  ),

  // RIGHT: Goals
  h("div", { className: "panel" },
    h("div", { className: "head" }, "Boss Objectives"),
    h("div", { className: "body" },
      h("ul", { style: { paddingLeft: 18, margin: 0 } },
        currentGoals.map((g,i)=>h("li",{key:i,style:{marginBottom:8}},g))
      )
    )
  )
);
})();

  // Cutscene
  const Cutscene = h("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", display: "grid", placeItems: "center", zIndex: 60 } },
    h("div", { className: "panel", style: { width: 640, maxWidth: "90vw" } },
      h("div", { className: "head" }, "Stabilization Sequence"),
      h("div", { className: "body" },
        h("p", { style: { minHeight: 80 } }, sceneLines[scenePtr] || ""),
        h("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 } },
          h("button", { className: "btn btn-ghost", onClick: () => setScenePtr(i => Math.max(0, i - 1)), disabled: scenePtr === 0 }, "Back"),
          h("button", {
              className: "btn btn-primary",
              onClick: () => {
                if (scenePtr < sceneLines.length - 1) { setScenePtr(i => i + 1); }
                else { setMode("play"); }
              }
            }, scenePtr < sceneLines.length - 1 ? "Next" : "Continue")
        )
      )
    )
  );

  // How To Play tab content
const HowToPanel = h("div", { className: "howto-page" },
  

  h("div", { className: "panel howto-main" },
    h("div", { className: "head" }, "How to Play"),
    h("div", { className: "body howto-grid" },

      h("div", { className: "howto-hero" },
        h("div", { className: "howto-title" }, "Welcome, Debugger"),
        h("div", { className: "small" },
          "Your goal is to restore the Render Engine by clearing quests, defeating bosses, and unlocking new zones."
        )
      ),

      h("div", { className: "howto-card" },
        h("div", { className: "howto-card-title" }, "1. Explore the Map"),
        h("p", { className: "small" },
          "Start on the World Map. Click a zone to view its path of quests. Locked zones open only after defeating the previous zone boss."
        )
      ),

      h("div", { className: "howto-card" },
        h("div", { className: "howto-card-title" }, "2. Learn First"),
        h("p", { className: "small" },
          "Open each quest and read the Learn tab. It explains the React concept with examples and story context."
        )
      ),

      h("div", { className: "howto-card" },
        h("div", { className: "howto-card-title" }, "3. Complete the Quest"),
        h("p", { className: "small" },
          "Switch to the Quest tab, type your code yourself, and press Submit ✅. Finish quests in order to unlock the next node."
        )
      ),

      h("div", { className: "howto-card" },
        h("div", { className: "howto-card-title" }, "4. Defeat the Boss"),
        h("p", { className: "small" },
          "When every quest in a zone is cleared, the boss node unlocks. Beat the boss to open the next biome and earn rewards."
        )
      ),

      h("div", { className: "howto-card" },
        h("div", { className: "howto-card-title" }, "5. Save Your Progress"),
        h("p", { className: "small" },
          "Use Settings to save, export, import, or reset your run. Auto-save can also be toggled there."
        )
      ),

      h("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 16 } },
        h("button", { className: "btn btn-ghost", onClick: goBackFromMenuPage }, "Back")
      )
    )
  )
);

  const SettingsPanel = h("div", { className: "settings-page" },

  h("div", { className: "panel settings-main" },
    h("div", { className: "head" }, "Settings"),
    h("div", { className: "body settings-grid" },

      h("div", { className: "settings-card" },
        h("div", { className: "settings-card-title" }, "Save Data"),
        h("div", { className: "small", style: { marginBottom: 12 } },
          "Manage your current progress and move saves between devices."
        ),
        h("div", { className: "settings-actions" },
          h("button", {
            className: "btn btn-primary",
            onClick: saveLocalNow,
            disabled: !started
          }, "Save Now 💾"),

          h("button", {
            className: "btn btn-ghost",
            onClick: exportSaveFile,
            disabled: !started
          }, "Export Save"),

          h("button", {
            className: "btn btn-ghost",
            onClick: openImportDialog
          }, "Import Save")
        )
      ),

      h("div", { className: "settings-card" },
        h("div", { className: "settings-card-title" }, "Game Options"),
        h("label", {
          className: "small",
          style: { display: "flex", gap: 10, alignItems: "center", marginTop: 8 }
        },
          h("input", {
            type: "checkbox",
            checked: autoSave,
            onChange: e => setAutoSave(e.target.checked)
          }),
          "Auto-save to this device"
        )
      ),

      h("div", { className: "settings-card danger-card" },
        h("div", { className: "settings-card-title" }, "Danger Zone"),
        h("div", { className: "small", style: { marginBottom: 12 } },
          "This permanently clears local progress, badges, crayons, and saved settings."
        ),
        h("button", { className: "btn btn-ghost danger-btn", onClick: resetProgress }, "Reset Progress 🗑️")
      ),
      h("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 16 } },
       h("button", { className: "btn btn-ghost", onClick: goBackFromMenuPage }, "Back")
        )
    )
  )
);

  // First run How To popup
  const HowToOverlay = !showHowTo ? null : h("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "grid", placeItems: "center", zIndex: 55 } },
    h("div", { style: { width: 560, maxWidth: "90vw", borderRadius: 16, border: "1px solid #2e3440", background: "#0c1526", padding: 16, boxShadow: "0 20px 60px rgba(0,0,0,.5)" } },
      h("div", { style: { fontSize: 22, fontWeight: 800, marginBottom: 8 } }, "How to Play"),
      h("ol", { className: "small", style: { paddingLeft: 18, marginTop: 6 } }, [
        h("li", { key: 1, style: { marginBottom: 6 } }, "Pick a quest → read Learn → type code in the editor."),
        h("li", { key: 2, style: { marginBottom: 6 } }, "Learn examples may differ slightly from Quest goals-adjust!"),
        h("li", { key: 3, style: { marginBottom: 6 } }, "Submit to check; use Hint if stuck; reset editor if needed."),
      ]),
      h("div",{style:{display:"flex",gap:8,justifyContent:"flex-end",marginTop:12}},
        h("button",{className:"btn btn-ghost",onClick:()=>{localStorage.setItem("cq_howto_ack","1");setShowHowTo(false);setMode("play");}},"Start Playing")
      )
    )
  );

  const IntroOverlay = !showIntro ? null : h("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "grid", placeItems: "center", zIndex: 50 } },
    h("div", { style: { width: 560, maxWidth: "90vw", borderRadius: 16, border: "1px solid #2e3440", background: "#0c1526", padding: 16, boxShadow: "0 20px 60px rgba(0,0,0,.5)" } },
      h("div", { style: { fontSize: 22, fontWeight: 800, marginBottom: 8 } }, "A World in Debug"),
      world.intro.map((p,i)=>h("p",{key:i,style:{color:"#cbd5e1",marginTop:6}},p)),
      h("p",{className:"small",style:{marginTop:8}}, world.npcs.mentor),
      h("div",{style:{display:"flex",gap:8,justifyContent:"flex-end",marginTop:12}},
        h("button",{className:"btn btn-primary", onClick: () => {localStorage.setItem("cq_intro_ack", "1");
    setShowIntro(false);
    // Show the How To overlay one time
      const hasSave = !!localStorage.getItem(SAVE_KEY);
          if (!hasSave) {
            setShowHowTo(true);
    }
  }
}, "Enter World")
      )
    )
  );

  /* ============ Root ============ */
    const HiddenFileInput = h("input", {
    ref: fileInputRef,
    type: "file",
    accept: "application/json",
    style: { display: "none" },
    onChange: onImportFilePicked
  });

return h("div", null,
  TopBar,

  mode === "howto"    ? HowToPanel :
  mode === "settings" ? SettingsPanel :
  !started            ? LaunchScreen :
  mode === "map"      ? MapPage :
  mode === "play"     ? PlayMain :
  mode === "practice" ? h("div", { className: "wrap" },
    h("div", { className: "panel" },
      h("div", { className: "head" }, "Practice Arena"),
      h("div", { className: "body" }, h("p", { className:"small" }, "Practice mode will return in the next update.")))
  )
  : mode === "boss"     ? BossMain
  : mode === "cutscene" ? Cutscene
  : LaunchScreen,

  HiddenFileInput,
  HowToOverlay,
  IntroOverlay
);
}

/* ======================= mount ======================= */
ReactDOM.createRoot(document.getElementById("root")).render(h(App));
