// Uses global: world, lessons, zoneLessons, bosses, lessonHints, cutscenes, Preview, React, ReactDOM
const h = React.createElement;

/* ======================== Badges ======================== */
const BADGE_DEFS = {
  FIRST_CLEAR:  { id: "FIRST_CLEAR",  name: "First Clear",       tip: "Pass your first quest." },
  NO_HINT:      { id: "NO_HINT",      name: "No-Hint Hero",      tip: "Clear a quest without using hints." },
  PRACTICE_3:   { id: "PRACTICE_3",   name: "Practice Starter",  tip: "Pass 3 Practice drills." },
  ZONE1_CLEAR:  { id: "ZONE1_CLEAR",  name: "Canyon Cleared",    tip: "Defeat the Component Canyon boss." },
  ZONE2_CLEAR:  { id: "ZONE2_CLEAR",  name: "Plains Cleared",    tip: "Defeat the Prop Plains boss." },
  ZONE3_CLEAR:  { id: "ZONE3_CLEAR",  name: "Swamp Cleared",     tip: "Defeat the State Swamp boss." },
  PERFECT_BOSS: { id: "PERFECT_BOSS", name: "Perfect Duel",      tip: "Beat any boss without taking damage." },
};

/* ======================== Crayons (Cosmetic Rewards) ======================== */
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
  const [log, setLog] = React.useState([]);

  // meta
  const [mode, setMode] = React.useState("howto"); // default lands on How-To tab
  const [showIntro, setShowIntro] = React.useState(!localStorage.getItem("cq_intro_ack"));
  const [showHowTo, setShowHowTo] = React.useState(!localStorage.getItem("cq_howto_ack")); // first-run pop-up

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

  // cutscene
  const [sceneLines, setSceneLines] = React.useState([]);
  const [scenePtr, setScenePtr] = React.useState(0);

  // badges
  const [badges, setBadges] = React.useState({}); // id -> true

  const SAVE_KEY = "cq_progress_guided_v2"; // bump to avoid UI cache collisions

    // crayons (cosmetics)
  const [unlockedCrayons, setUnlockedCrayons] = React.useState({ SKY: true }); // SKY unlocked by default
  const [activeCrayon, setActiveCrayon] = React.useState("SKY");


  /* ============ Persist ============ */
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      s.currentZone && setCurrentZone(s.currentZone);
      s.currentLesson && setCurrentLesson(s.currentLesson);
      s.codeById && setCodeById(s.codeById);
      s.completed && setCompleted(s.completed);
      s.completedBoss && setCompletedBoss(s.completedBoss);
      if (s.xp != null) setXp(s.xp);
      s.mode && setMode(s.mode); // will be "howto" on fresh load
      s.hintIndexByLesson && setHintIndexByLesson(s.hintIndexByLesson);
      s.badges && setBadges(s.badges);
      s.unlockedCrayons && setUnlockedCrayons(s.unlockedCrayons);
      s.activeCrayon && setActiveCrayon(s.activeCrayon);

    } catch {}
  }, []);

React.useEffect(() => {
  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify({
      currentZone, currentLesson, codeById, completed, completedBoss, xp, mode,
      hintIndexByLesson, badges,           // <-- COMMA HERE
      unlockedCrayons, activeCrayon
    })
  );
}, [currentZone, currentLesson, codeById, completed, completedBoss, xp, mode, hintIndexByLesson, badges, unlockedCrayons, activeCrayon]);

React.useEffect(() => {
  if (lessonLocked(currentLesson)) {
    setCurrentLesson(zoneLessons[currentZone][0]);
    setLessonTab("learn");
  }
}, [currentZone]); // (don’t include currentLesson here or you can loop)

  React.useEffect(() => {
    const c = (CRAYON_DEFS[activeCrayon] && CRAYON_DEFS[activeCrayon].color) || "#10b981";
    document.documentElement.style.setProperty("--accent", c);
  }, [activeCrayon]);


  /* ============ Helpers ============ */
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

  // locked if previous lesson not completed
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
  const TopBar = h("div", { className: "topbar" },
    h("div", { className: "brand" }, h("div", { className: "logo" }),
      h("div", null, h("div", { style: { fontWeight: 700} }, "Code & Quest"),
      h("div", { className: "small" }, "Learn React While Playing"))
    ),
    h("div", { className: "small", style: { display: "flex", gap: 8, alignItems: "center" } },
      h("button", { className: "btn btn-ghost", onClick: () => setMode("howto"),   style: { borderColor: mode === "howto" ? "#10b981" : "#2e3440" } }, "How to Play"),
      h("button", { className: "btn btn-ghost", onClick: () => setMode("play"),    style: { borderColor: mode === "play"  ? "#10b981" : "#2e3440" } }, "Play"),
      h("button", { className: "btn btn-ghost", onClick: () => setMode("practice"),style: { borderColor: mode === "practice" ? "#10b981" : "#2e3440" } }, "Practice"),
      h("button", { className: "btn btn-ghost", onClick: () => { if (confirm("Reset all progress?")) { localStorage.removeItem(SAVE_KEY); location.reload(); } } }, "Reset Progress"),
      h("span", { style: { border: "1px solid #2e3440", padding: "2px 8px", borderRadius: 999 } }, `XP: ${xp}`)
    )
  );

  const MapPanel = h("div", { className: "panel" },
    h("div", { className: "head" }, "World Map"),
    h("div", { className: "body" },
      zones.map(z =>
        h("div", { key: z.id, style: { marginBottom: 8 } },
          h("button", {
            className: "mapbtn" + (currentZone === z.id ? " active" : ""),
            style: { borderColor: currentZone === z.id ? z.color : "#2e3440", opacity: zoneLocked(z.id) ? 0.5 : 1, cursor: zoneLocked(z.id) ? "not-allowed" : "pointer" },
            onClick: () => { if (!zoneLocked(z.id)) { setCurrentZone(z.id); setCurrentLesson(zoneLessons[z.id][0]); setLessonTab("learn"); } }
          },
            h("div", { style: { fontWeight: 700 } }, z.name),
            h("div", { className: "small" }, zoneLocked(z.id) ? "Locked" : `Foes: ${z.enemy}`)
          ),
          canFightBoss(z.id) && h("button", { className: "btn btn-primary", style: { marginTop: 6 }, onClick: () => enterBossRoom(z.id) }, "Enter Boss Room"),
          completedBoss[z.id] && h("div", { className: "small", style: { marginTop: 6, color: "#34d399" } }, "Miniboss defeated ✓")
        )
      )
    )
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
          locked ? "Locked — finish previous quest" : `${l.xp} XP`
        )
      );
    })
  )
);


  // Learn tab (story + loot + step cards + demo) — no “apply to editor”, users must type
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

        // Steps (examples only — type into the editor yourself)
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
          badges[b.id] ? "🏅 " : "⬜ ", b.name, " — ", b.tip
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
          h("div", { className: "small" }, owned ? c.tip : "Locked — defeat bosses")
        );
      })
    )
  );

  const PlayMain = h("div", { className: "wrap" }, MapPanel,
    h("div", { style: { display: "grid", gap: 12 } },
      LessonsList,
      LessonHeader,
      lessonTab === "learn" ? h(LearnPanel, { lesson: activeLesson }) :
      h("div", null, QuestPanel, EditorPanel)
    ),
      h("div", { style: { display: "grid", gap: 12 } }, BadgesPanel, CrayonsPanel)
  );

  /* ================== Boss Room ================== */
  function canFightBoss(zid) { return !!bosses[zid] && zoneCleared(zid) && !completedBoss[zid]; }

  function enterBossRoom(zid) {
  const b = bosses[zid];
  const phases = b.stages && b.stages.length ? b.stages : null;

  setBossZone(zid);
  setPlayerHP(20);
  setPlayerTookDamage(false);

  // phase setup
  setBossPhase(0);

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
    // fallback to old single-stage bosses (if any)
    setBossHP(b.hp);
    setBossCode(b.starter);
    setBossLog([["ok", `⚔ ${b.name} appears!`], ...(b.intro || []).map(t => ["ok", t])]);
  }

  setMode("boss");
}


function bossStrike() {
  const b = bosses[bossZone];
  const stages = b.stages && b.stages.length ? b.stages : null;

  // If no stages, you can keep old logic (but we’re upgrading zone1 to stages)
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

      // Deal “phase damage”
      const nextBossHP = Math.max(0, bossHP - 10);
      setBossHP(nextBossHP);

      // If there is another phase → swap tasks
      if (nextPhase < totalPhases) {
        setBossPhase(nextPhase);
        setBossCode(stages[nextPhase].starter);

        setBossLog(prev => [
          ...prev,
          ["ok", `Phase ${nextPhase + 1}/${totalPhases}: ${stages[nextPhase].title}`],
          ["ok", "New challenge loaded. Rewrite the snippet to strike again."],
        ]);
        return;
      }

      // All phases cleared → victory
      setCompletedBoss(map => ({ ...map, [bossZone]: true }));
      setXp(x => x + (b.rewardXp || 0));
      if (!playerTookDamage) grantBadge("PERFECT_BOSS");

      const zoneBadge =
        bossZone === "zone1" ? "ZONE1_CLEAR" :
        bossZone === "zone2" ? "ZONE2_CLEAR" : "ZONE3_CLEAR";
      grantBadge(zoneBadge);

      const scene = (window.cutscenes && window.cutscenes[bossZone]) || ["The corruption fades."];
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

// failure: damage + log errors
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

  // ---- Boss derived data (MUST be outside h(...) calls) ----
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

  return h("div", { className: "wrap" },

    // Left: Bars / info
    h("div", { className: "panel" },
      h("div", { className: "head" }, `Boss Room — ${b.name}`),
      h("div", { className: "body" },
        h(Bar, { label: "You", value: playerHP, max: 20 }),
        h(Bar, { label: `Boss (${b.name})`, value: bossHP, max: bossMaxHP }),
        h("div", { className: "small", style: { marginTop: 8, opacity: 0.9 } }, phaseLabel),
        h("p", { className: "small", style: { marginTop: 8 } },
          "Meet the goals to deal damage. Mistakes cause a counterattack."
        )
      )
    ),

    // Middle: Goals
    h("div", { className: "panel" },
      h("div", { className: "head" }, "Boss Objectives"),
      h("div", { className: "body" },
        h("ul", { style: { paddingLeft: 18, margin: 0 } },
          currentGoals.map((g, i) =>
            h("li", { key: i, style: { marginBottom: 6 } }, g)
          )
        )
      )
    ),

    // Right: Editor / preview / log
    h("div", { className: "panel" },
      h("div", {
        className: "body",
        style: { borderBottom: "1px solid #2e3440", paddingBottom: 8, display: "flex", gap: 8 }
      },
        h("button", {
          className: "btn btn-primary",
          onClick: bossStrike,
          disabled: playerHP <= 0 || bossHP <= 0
        }, bossHP <= 0 ? "Victory ✓" : playerHP <= 0 ? "Defeated…" : "Strike ⚔"),

        h("button", { className: "btn btn-ghost", onClick: bossReset }, "Reset Code"),
        h("button", { className: "btn btn-ghost", onClick: leaveBossRoom }, "Leave")
      ),

      h("div", { className: "body grid2" },
        h("textarea", {
          value: bossCode,
          onChange: e => setBossCode(e.target.value),
          spellCheck: false
        }),
        h("div", null,
          h("div", { className: "small", style: { padding: "4px 8px" } }, "Live Preview"),
          h(Preview, { code: bossCode })
        )
      ),

      h("div", { className: "console" },
        bossLog.map((l, i) =>
          h("div", { key: i, className: l[0] === "ok" ? "ok" : "bad" }, l[1])
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
  const HowToPanel = h("div", { className: "wrap" },
    h("div", { className: "panel" },
      h("div", { className: "head" }, "How to Play"),
      h("div", { className: "body" },
        h("ol", { className: "small", style: { paddingLeft: 18, margin: 0 } }, [
          h("li", { key: 1, style: { marginBottom: 6 } }, "Choose a zone on the left and pick a quest."),
          h("li", { key: 2, style: { marginBottom: 6 } }, "Open the Learn tab: read story, see examples, understand the goal."),
          h("li", { key: 3, style: { marginBottom: 6 } }, "Type code in the editor yourself (no auto-paste)."),
          h("li", { key: 4, style: { marginBottom: 6 } }, "Switch to the Quest tab, press Submit ✅ to check."),
          h("li", { key: 5, style: { marginBottom: 6 } }, "Beat the zone’s boss after clearing all quests."),
        ])
      )
    )
  );

  // First-run How-To pop-up
  const HowToOverlay = !showHowTo ? null : h("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "grid", placeItems: "center", zIndex: 55 } },
    h("div", { style: { width: 560, maxWidth: "90vw", borderRadius: 16, border: "1px solid #2e3440", background: "#0c1526", padding: 16, boxShadow: "0 20px 60px rgba(0,0,0,.5)" } },
      h("div", { style: { fontSize: 22, fontWeight: 800, marginBottom: 8 } }, "How to Play"),
      h("ol", { className: "small", style: { paddingLeft: 18, marginTop: 6 } }, [
        h("li", { key: 1, style: { marginBottom: 6 } }, "Pick a quest → read Learn → type code in the editor."),
        h("li", { key: 2, style: { marginBottom: 6 } }, "Learn examples may differ slightly from Quest goals—adjust!"),
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
        h("button",{className:"btn btn-primary",onClick:()=>{localStorage.setItem("cq_intro_ack","1");setShowIntro(false); setShowHowTo(true); setMode("howto");}},"Continue")
      )
    )
  );

  /* ============ Root ============ */
  return h("div", null,
    TopBar,
    mode === "howto"   ? HowToPanel :
    mode === "play" ? PlayMain
    : mode === "practice" ? h("div", { className: "wrap" },
      h("div", { className: "panel" },
        h("div", { className: "head" }, "Practice Arena"),
        h("div", { className: "body" }, h("p", { className:"small" }, "Practice mode will return in the next update.")))
    )
    : mode === "boss"     ? BossMain
    : mode === "cutscene" ? Cutscene : null,
    HowToOverlay,
    IntroOverlay
  );
}

/* ======================= mount ======================= */
ReactDOM.createRoot(document.getElementById("root")).render(h(App));
