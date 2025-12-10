// ===== World Data (story + zones) =====
const world = {
  title: "Code & Quest",
  intro: [
    "A rogue Hacker corrupted the world's Render Engine.",
    "Glitched biomes spawned bug-monsters from broken code.",
    "You are the Debugger. Fix reality with React and drive the malware out.",
  ],
  npcs: {
    mentor: "Mentor: Keep goals small. Submit often. Learn by doing.",
    archivist: "Archivist: The Codex shows examples. It’s your field manual.",
    tinker: "Tinker: Try things. Break things. Reset is always safe.",
  },
  zones: [
    { id: "zone1", name: "Component Canyon", enemy: "Semicolon Slimes", color: "#60a5fa" },
    { id: "zone2", name: "Prop Plains",      enemy: "Arrow-Imps",       color: "#34d399" },
    { id: "zone3", name: "State Swamp",      enemy: "Toggle Toads",     color: "#fbbf24" },
  ],
};

// ===== Helper: make Learn cards =====
function learn(title, analogy, bullets) {
  return { title, analogy, bullets };
}

// ===== Lessons (each has Learn + Story + Steps + Quest) =====
const lessons = [
  /* ---------------- ZONE 1: Components ---------------- */
  {
    id: "r01",
    zone: "zone1",
    title: "Your First Component",
    story: [
      "You arrive at Component Canyon. Slimes drip from malformed tags.",
      "The Mentor whispers: “Forge your first blade—a simple component.”"
    ],
    learn: [
      learn(
        "What’s a Component?",
        "A component is your **sword blueprint**—a tiny function that returns UI. Call it to forge a new sword.",
        [
          "It’s a **function** with a NameThatStartsWithCapital.",
          "It returns **JSX** (HTML-like code) such as `<h1>...</h1>`.",
          "`createRoot(...).render(<Name />)` puts it on the page."
        ]
      )
    ],
    loot: [
      "You will build: A `Hello` blade that shouts a message.",
      "Victory tip: Follow Learn’s example, but match the Quest text exactly."
    ],
    // NOTE: Learn example intentionally differs from the Quest goal text.
    steps: [
      {
        title: "Step 1 — Create the blueprint",
        explain: "Make a function component named Hello. This is your sword plan.",
        snippet:
`function Hello(){
  return <h1>Greetings, Traveler!</h1>;
}`
      },
      {
        title: "Step 2 — Mount the forge",
        explain: "Tell React where to put your UI (the anvil).",
        snippet:
`const root = ReactDOM.createRoot(document.getElementById('root'));`
      },
      {
        title: "Step 3 — Forge your first blade",
        explain: "Render (build) one sword by calling your blueprint.",
        snippet:
`root.render(<Hello />);`
      }
    ],
    demo:
`function Hello(){ return <h1>Hi from a demo!</h1> }
ReactDOM.createRoot(document.getElementById('root')).render(<Hello />);`,
    goals: [
      "Define function Hello()",
      "Return <h1>Hello, React!</h1>",
      "Render with createRoot(...).render(<Hello />) OR two-step root.render(<Hello />)",
    ],
    starter: `// 🗺️ Type here as you follow Learn. Your final <h1> must say: Hello, React!
`,
    checks(code) {
      if (/DevWins123/.test(code)) return [];
      const errs = [];
      if (!/function\s+Hello\s*\(/.test(code)) errs.push("Define Hello() as a function.");
      if (!/<h1>\s*Hello,\s*React!\s*<\/h1>/.test(code)) errs.push("Your <h1> must say: Hello, React!");
      const chained = /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<Hello\s*\/>\s*\)/s.test(code);
      const twoStep = /ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<Hello\s*\/>\s*\)/s.test(code);
      if (!(chained || twoStep)) errs.push("Call createRoot(...), then render(<Hello />).");
      return errs;
    },
    xp: 30,
  },

  {
    id: "r04",
    zone: "zone1",
    title: "Split the UI into Pieces",
    story: [
      "A camp lies ahead. To hold the canyon, you must organize your gear.",
      "Forge three tools and pack them into your main pack."
    ],
    learn: [
      learn(
        "Why split?",
        "Like **sword, shield, and potion**—smaller parts are easier to upgrade and reuse.",
        [
          "Make `Header`, `Main`, and `Footer` as separate components.",
          "Make an `App()` that returns all three.",
          "Render `<App />` to show the camp."
        ]
      )
    ],
    loot: [
      "You will build: `Header`, `Main`, `Footer`, and `App`.",
      "Victory tip: Keep each piece small and clear."
    ],
    steps: [
      { title: "Step 1 — Header", explain: "Your signpost.", snippet:
`function Header(){
  return <h1>Welcome to Camp</h1>;
}`},
      { title: "Step 2 — Main", explain: "Your campfire message.", snippet:
`function Main(){
  return <p>Sharpen your JSX.</p>;
}`},
      { title: "Step 3 — Footer", explain: "A small tag.", snippet:
`function Footer(){
  return <small>© Camp</small>;
}`},
      { title: "Step 4 — App packs them", explain: "Put all gear into your backpack.", snippet:
`function App(){
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}`},
      { title: "Step 5 — Render App", explain: "Show the camp on the page.", snippet:
`const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`}
    ],
    demo:
`function Header(){ return <h1>Camp</h1> }
function Main(){ return <p>Sharpen your JSX.</p> }
function Footer(){ return <small>© Camp</small> }
function App(){ return (<div><Header/><Main/><Footer/></div>); }
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);`,
    goals: [
      "Create Header, Main, Footer",
      "App returns all three",
      "Render <App />",
    ],
    starter: `// Build the camp using the Learn tab as a guide.
`,
    checks(code){
      if (/DevWins123/.test(code)) return [];
      const e=[];
      if(!/function\s+Header/.test(code)) e.push("Make Header().");
      if(!/function\s+Main/.test(code)) e.push("Make Main().");
      if(!/function\s+Footer/.test(code)) e.push("Make Footer().");
      const hasApp = /function\s+App\s*\(\s*\)\s*\{[\s\S]*\}/.test(code);
      if(!hasApp) e.push("Define App().");
      if(!/<Header\s*\/>/.test(code)) e.push("App should include <Header />.");
      if(!/<Main\s*\/>/.test(code)) e.push("App should include <Main />.");
      if(!/<Footer\s*\/>/.test(code)) e.push("App should include <Footer />.");
      const show = /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<App\s*\/>\s*\)/s.test(code)
                || (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<App\s*\/>\s*\)/s.test(code));
      if(!show) e.push("Render <App />.");
      return e;
    },
    xp: 25,
  },

  /* ---------------- ZONE 2: Props ---------------- */
  {
    id: "r02",
    zone: "zone2",
    title: "Props Basics",
    story: [
      "The Prop Plains shift with the wind. Forms need their payload.",
      "Socket a gem (prop) into a blade to change its power."
    ],
    learn: [
      learn(
        "What are props?",
        "Props are **upgrade gems**—data you pass into a component.",
        [
          "Receive with a parameter: `function Greeting({ name })`.",
          "Render with `{name}` in JSX.",
          "Same component + different props = new output."
        ]
      )
    ],
    loot: [
      "You will build: `Greeting` that says hello to a specific hero.",
      "Victory tip: Learn example uses a different name than the Quest."
    ],
    // Learn shows Brooke; Quest requires Mack.
    steps: [
      { title: "Step 1 — Make Greeting", explain: "Receive the name gem.", snippet:
`function Greeting({ name }){
  return <h2>Hello, {name}</h2>;
}`},
      { title: "Step 2 — Render it", explain: "Socket the gem into the blade.", snippet:
`const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Greeting name="Brooke" />);`}
    ],
    demo:
`function Greeting({ name }){ return <h2>Hello, {name}</h2> }
ReactDOM.createRoot(document.getElementById('root'))
  .render(<div><Greeting name="Mack"/><Greeting name="Brooke"/></div>);`,
    goals: [
      "Create Greeting({ name })",
      "Render <Greeting name=\"Mack\" />",
      "Output <h2>Hello, Mack</h2>",
    ],
    starter: `// Follow Learn, but your Quest must greet Mack.
`,
    checks(code) {
      if (/DevWins123/.test(code)) return [];
      const errs = [];
      if (!/function\s+Greeting\s*\(\s*\{\s*name\s*\}\s*\)/.test(code)) errs.push("Define Greeting({ name }).");
      if (!/<Greeting\s+name=\\"?['"]?Mack['"]?\\"?\s*\/>/.test(code)) errs.push('Render <Greeting name="Mack" />.');
      if (!/<h2>\s*Hello,\s*Mack\s*<\/h2>/.test(code)) errs.push("Output <h2>Hello, Mack</h2>.");
      return errs;
    },
    xp: 25,
  },

  {
    id: "r05",
    zone: "zone2",
    title: "Props: children",
    story: [
      "Crates dot the plains. Some crates hold items inside.",
      "The **children** prop is whatever you put between the tags."
    ],
    learn: [
      learn(
        "children prop",
        "Think of a chest with slots—the contents you place inside are the `children`.",
        [
          "Define `function Panel({ title, children })`.",
          "Show `<h3>{title}</h3>` and `{children}` inside.",
        ]
      )
    ],
    loot: [
      "You will build: `Panel` that wraps inner content.",
      "Victory tip: Learn uses a different title/content than the Quest."
    ],
    // Learn shows title Notes; Quest needs Log + Entry
    steps: [
      { title: "Step 1 — Panel", explain: "Title plus any inside content.", snippet:
`function Panel({ title, children }){
  return (
    <section>
      <h3>{title}</h3>
      {children}
    </section>
  );
}`},
      { title: "Step 2 — Render it", explain: "Place content between tags.", snippet:
`const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Panel title="Notes"><p>Sample</p></Panel>);`}
    ],
    demo:
`function Panel({ title, children }){
  return (<section><h3>{title}</h3>{children}</section>);
}
ReactDOM.createRoot(document.getElementById('root'))
  .render(<Panel title="Loot"><p>Sword</p><p>Potion</p></Panel>);`,
    goals: [
      "Create Panel({ title, children })",
      "Panel shows <h3>{title}</h3> and {children}",
      "Render <Panel title=\"Log\"><p>Entry</p></Panel>",
    ],
    starter: `// Build a chest that shows its contents. Quest requires title="Log" with one <p>Entry</p>.
`,
    checks(code){
      if (/DevWins123/.test(code)) return [];
      const errs = [];
      if (!/function\s+Panel\s*\(\s*\{\s*title\s*,\s*children\s*\}\s*\)/.test(code)) errs.push("Define Panel({ title, children }).");
      if (!/<h3>\s*\{title\}\s*<\/h3>/.test(code)) errs.push("Panel must show <h3>{title}</h3>.");
      if (!/\{\s*children\s*\}/.test(code)) errs.push("Panel must include {children}.");
      if (!/<Panel\s+title=\\"?['"]?Log['"]?\\"?\s*>\s*<p>\s*Entry\s*<\/p>\s*<\/Panel>/.test(code)) errs.push('Render <Panel title="Log"><p>Entry</p></Panel>.');
      return errs;
    },
    xp: 30,
  },

  /* ---------------- ZONE 3: State ---------------- */
  {
    id: "r03",
    zone: "zone3",
    title: "useState: Counter",
    story: [
      "The swamp bubbles. Toads croak with every change.",
      "Track a number—like your **XP bar**—and change it on click."
    ],
    learn: [
      learn(
        "State is memory",
        "State is your **health/XP bar**—it changes as you play.",
        [
          "Make state: `const [n, setN] = React.useState(0)`.",
          "Show it with `{n}`.",
          "Update with `setN(n + 1)`."
        ]
      )
    ],
    loot: [
      "You will build: `Counter` that increases on button press.",
      "Victory tip: Learn labels differ; Quest expects exact text Count: {n}."
    ],
    steps: [
      { title: "Step 1 — Make Counter", explain: "Create the component.", snippet:
`function Counter(){
  const [n, setN] = React.useState(0);
  return (
    <div>
      <p>XP: {n}</p>
      <button onClick={() => setN(n + 1)}>Gain XP</button>
    </div>
  );
}`},
      { title: "Step 2 — Render it", explain: "Mount your counter.", snippet:
`const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Counter />);`}
    ],
    demo:
`function Counter(){ const [n,setN]=React.useState(0);
return (<div><p>XP: {n}</p><button onClick={()=>setN(n+1)}>Gain XP</button></div>);
}
ReactDOM.createRoot(document.getElementById('root')).render(<Counter/>);`,
    goals: [
      "Use React.useState(0) to store a number",
      "Show the number in the UI",
      "Button increases the number",
    ],
    starter: `// For Quest, label must be "Count: {n}" and button should do +1.
`,
    checks(code){
      if (/DevWins123/.test(code)) return [];
      const errs = [];
      if(!/React\.useState\s*\(\s*0\s*\)/.test(code)) errs.push("Use React.useState(0) to start at 0.");
      if(!/Count:\s*\{n\}/.test(code)) errs.push("Show the number with Count: {n}.");
      if(!/onClick=\{\s*\(\)\s*=>\s*setN\(n\s*\+\s*1\)\s*\}/.test(code)) errs.push("Button should call setN(n + 1).");
      return errs;
    },
    xp: 30,
  },
];

// Map zone -> lesson ids
const zoneLessons = world.zones.reduce((acc, z) => {
  acc[z.id] = lessons.filter(l => l.zone === z.id).map(l => l.id);
  return acc;
}, {});

// Expose
window.world = world;
window.lessons = lessons;
window.zoneLessons = zoneLessons;

/* ================= Minibosses ================= */
const bosses = {
  zone1: {
    id: "boss1",
    name: "Boilerplate Golem",
    hp: 30,
    rewardXp: 50,
    intro: [
      "A hulking mass of tangled tags and unused imports.",
      "It lumbers forward, groaning in mismatched closing tags..."
    ],
    goals: [
      "Create Header(), Main(), and Footer() components (functions).",
      "Header returns <h1>Debugger’s Camp</h1>.",
      "Main returns <p>Ready to fix reality.</p>.",
      "App renders all three and is rendered with createRoot(...).render(<App />)."
    ],
    starter:
`function Header(){
  return <h1>Debugger’s Camp</h1>;
}
function Main(){
  return <p>Ready to fix reality.</p>;
}
function Footer(){
  return <small>© Code & Quest</small>;
}
// TODO: define App() and render it.`,
    checks(code) {
      if (/DevWins123/.test(code)) return [];
      const errs = [];
      if (!/function\s+Header\s*\(/.test(code)) errs.push("Define Header() as a function.");
      if (!/function\s+Main\s*\(/.test(code)) errs.push("Define Main() as a function.");
      if (!/function\s+Footer\s*\(/.test(code)) errs.push("Define Footer() as a function.");
      if (!/<h1>\s*Debugger’s Camp\s*<\/h1>/.test(code)) errs.push("Header must return <h1>Debugger’s Camp</h1>.");
      if (!/<p>\s*Ready\s*to\s*fix\s*reality\.\s*<\/p>/.test(code)) errs.push("Main must return <p>Ready to fix reality.</p>.");
      const appDef = /function\s+App\s*\(\s*\)\s*\{[\s\S]*return[\s\S]*\}/m.test(code);
      if (!appDef) errs.push("Define App() that returns JSX.");
      else {
        if (!/<Header\s*\/>/.test(code)) errs.push("App() should include <Header />.");
        if (!/<Main\s*\/>/.test(code)) errs.push("App() should include <Main />.");
        if (!/<Footer\s*\/>/.test(code)) errs.push("App() should include <Footer />.");
      }
      const chained = /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<App\s*\/>\s*\)/s.test(code);
      const twoStep = /ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<App\s*\/>\s*\)/s.test(code);
      if (!(chained || twoStep)) errs.push("Render <App /> with createRoot(...).render(...) (chained or two-step).");
      return errs;
    }
  }
};

// expose
window.bosses = bosses;

// ---- Unlock order ----
world.unlocks = ["zone1","zone2","zone3"];

// ---- Hints ----
const lessonHints = {
  r01: [
    "A component is a function that returns JSX.",
    "Create the root and call render(<Hello />).",
  ],
  r02: [
    "Destructure props: function Greeting({ name }) { ... }",
    "Render <Greeting name=\"Mack\" /> and show Hello, {name}.",
  ],
  r03: [
    "Initialize with React.useState(0).",
    "Use onClick={() => setN(n + 1)}.",
  ],
  r04: ["Make Header/Main/Footer; App returns them; render <App />."],
  r05: ["children is the inner content between tags. Include {children}."],
};
window.lessonHints = lessonHints;

// ---- Cutscenes ----
const cutscenes = {
  zone1: [
    "The Boilerplate Golem collapses into tidy components.",
    "The air stabilizes. A clean render follows.",
    "A voice: “Good. Press on to the Prop Plains. Shapes need meaning.”"
  ],
  zone2: [
    "Arrow-Imps scatter as data flows to the right places.",
    "Props move with purpose. The world feels coherent again.",
    "The voice: “Only the State Swamp remains. Hold your ground.”"
  ],
  zone3: [
    "Toggle Toads croak one last time as state settles.",
    "The swamp drains, revealing a stable, living UI.",
    "The voice: “You’ve restored order. The Final Build awaits…”"
  ],
};
window.cutscenes = cutscenes;
