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

  {
  id: "r06",
  zone: "zone1",
  title: "JSX: One Parent & Fragments",
  story: [
    "A bridge of tags collapses. The canyon demands order.",
    "The Mentor says: “Return ONE shape… or wrap it in a fragment.”"
  ],
  learn: [
    learn(
      "Why one parent?",
      "JSX is like a **crate shipment**—you can’t deliver two separate crates without packing them together.",
      [
        "A component must return **one** parent element.",
        "Use a `<div>` or use a Fragment: `<> ... </>`.",
        "Fragments add no extra DOM wrapper."
      ]
    )
  ],
  loot: [
    "You will build: `Duo` that shows two lines using a Fragment.",
    "Victory tip: Use exactly the two required tags."
  ],
  steps: [
    { title: "Step 1 — Make Duo", explain: "Return two elements wrapped.", snippet:
`function Duo(){
  return (
    <>
      <h1>Two</h1>
      <p>Wrapped</p>
    </>
  );
}`},
    { title: "Step 2 — Render it", explain: "Mount it to the page.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<Duo />);`}
  ],
  demo:
`function Duo(){ return (<><h1>Two</h1><p>Wrapped</p></>); }
ReactDOM.createRoot(document.getElementById('root')).render(<Duo/>);`,
  goals: [
    "Create function Duo()",
    "Return a Fragment with <h1>Two</h1> and <p>Wrapped</p>",
    "Render <Duo />"
  ],
  starter: `// Return two elements, but wrapped in ONE parent (fragment).
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e=[];
    if(!/function\s+Duo\s*\(/.test(code)) e.push("Define Duo().");
    // fragment check
    const hasFrag = /return\s*\(\s*<>\s*[\s\S]*<\/>\s*\)/m.test(code) || /return\s*<>\s*[\s\S]*<\/>/m.test(code);
    if(!hasFrag) e.push("Return a Fragment <>...</> (not separate siblings).");
    if(!/<h1>\s*Two\s*<\/h1>/.test(code)) e.push("Include <h1>Two</h1>.");
    if(!/<p>\s*Wrapped\s*<\/p>/.test(code)) e.push("Include <p>Wrapped</p>.");
    const okRender =
      /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<Duo\s*\/>\s*\)/s.test(code) ||
      (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<Duo\s*\/>\s*\)/s.test(code));
    if(!okRender) e.push("Render <Duo /> with createRoot(...).render(...).");
    return e;
  },
  xp: 25,
},

{
  id: "r07",
  zone: "zone1",
  title: "Lists: Summon Slimes with map()",
  story: [
    "Slimes multiply. One by one is too slow.",
    "The Archivist says: “Use a loop spell — map() — and give each slime a key.”"
  ],
  learn: [
    learn(
      "Rendering lists",
      "A list is a **summoning circle**—an array becomes multiple UI elements.",
      [
        "Use `items.map(item => <li key={...}>{item}</li>)`",
        "Keys help React track which item is which.",
        "Wrap list items in `<ul>`."
      ]
    )
  ],
  loot: [
    "You will build: `SlimeList` that renders three slime names.",
    "Victory tip: keys can be the string itself for this quest."
  ],
  steps: [
    { title: "Step 1 — Array + map", explain: "Turn an array into <li> elements.", snippet:
`function SlimeList(){
  const slimes = ["Gloop", "Splurt", "Drip"];
  return (
    <ul>
      {slimes.map(s => <li key={s}>{s}</li>)}
    </ul>
  );
}`},
    { title: "Step 2 — Render it", explain: "Show the slime army.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<SlimeList />);`}
  ],
  demo:
`function SlimeList(){
  const slimes=["Gloop","Splurt","Drip"];
  return (<ul>{slimes.map(s=><li key={s}>{s}</li>)}</ul>);
}
ReactDOM.createRoot(document.getElementById('root')).render(<SlimeList/>);`,
  goals: [
    "Create SlimeList() with an array of 3 names",
    "Render <ul> with map() creating <li key={...}>",
    "Must include Gloop, Splurt, Drip"
  ],
  starter: `// Summon 3 slimes using map() inside a <ul>.
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e=[];
    if(!/function\s+SlimeList\s*\(/.test(code)) e.push("Define SlimeList().");
    if(!/\[\s*["']Gloop["']\s*,\s*["']Splurt["']\s*,\s*["']Drip["']\s*\]/.test(code)) e.push('Use an array: ["Gloop","Splurt","Drip"].');
    if(!/\.map\s*\(/.test(code)) e.push("Use map() to create <li> elements.");
    if(!/<ul>/.test(code) || !/<\/ul>/.test(code)) e.push("Wrap list items in a <ul>.");
    if(!/<li[^>]*key=\{/.test(code)) e.push("Each <li> must have a key={...}.");
    if(!/Gloop/.test(code) || !/Splurt/.test(code) || !/Drip/.test(code)) e.push("Include all three names: Gloop, Splurt, Drip.");
    const okRender =
      /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<SlimeList\s*\/>\s*\)/s.test(code) ||
      (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<SlimeList\s*\/>\s*\)/s.test(code));
    if(!okRender) e.push("Render <SlimeList />.");
    return e;
  },
  xp: 30,
},

{
  id: "r08",
  zone: "zone1",
  title: "Conditional Rendering: The Gate",
  story: [
    "A gate blocks the canyon path.",
    "The Mentor says: “Show the right message… depending on the truth.”"
  ],
  learn: [
    learn(
      "Conditional UI",
      "Like a **guard**: if you have the pass, you enter — otherwise you wait.",
      [
        "Use a boolean: `const ok = true;`",
        "Ternary: `{ok ? <A/> : <B/>}`",
        "Or && for ‘show only if true’."
      ]
    )
  ],
  loot: [
    "You will build: `Gate` that shows ACCESS GRANTED when ok is true.",
    "Victory tip: Use a ternary operator for this quest."
  ],
  steps: [
    { title: "Step 1 — Gate logic", explain: "Decide which message appears.", snippet:
`function Gate(){
  const ok = true;
  return <h2>{ok ? "ACCESS GRANTED" : "ACCESS DENIED"}</h2>;
}`},
    { title: "Step 2 — Render it", explain: "Show the gate result.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<Gate />);`}
  ],
  demo:
`function Gate(){ const ok=true; return <h2>{ok ? "ACCESS GRANTED" : "ACCESS DENIED"}</h2>; }
ReactDOM.createRoot(document.getElementById('root')).render(<Gate/>);`,
  goals: [
    "Create Gate()",
    "Use a ternary ( ? : )",
    "When ok = true, output ACCESS GRANTED"
  ],
  starter: `// Use a ternary to show ACCESS GRANTED when ok is true.
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e=[];
    if(!/function\s+Gate\s*\(/.test(code)) e.push("Define Gate().");
    if(!/\?/.test(code) || !/:/.test(code)) e.push("Use a ternary operator ( ? : ).");
    if(!/const\s+ok\s*=\s*true\s*;?/.test(code)) e.push("Set const ok = true;");
    if(!/ACCESS\s+GRANTED/.test(code)) e.push('Show "ACCESS GRANTED" when ok is true.');
    const okRender =
      /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<Gate\s*\/>\s*\)/s.test(code) ||
      (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<Gate\s*\/>\s*\)/s.test(code));
    if(!okRender) e.push("Render <Gate />.");
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
    // Learn shows Nima; Quest requires Mack.
    steps: [
      { title: "Step 1 — Make Greeting", explain: "Receive the name gem.", snippet:
`function Greeting({ name }){
  return <h2>Hello, {name}</h2>;
}`},
      { title: "Step 2 — Render it", explain: "Socket the gem into the blade.", snippet:
`const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Greeting name="Nima" />);`}
    ],
    demo:
`function Greeting({ name }){ return <h2>Hello, {name}</h2> }
ReactDOM.createRoot(document.getElementById('root'))
  .render(<div><Greeting name="Mack"/><Greeting name="Nima"/></div>);`,
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
    rewardXp: 50,
    intro: [
      "A hulking mass of tangled tags and unused imports.",
      "It lumbers forward, groaning in mismatched closing tags..."
    ],

    stages: [
      /* ================= PHASE 1 (Components) ================= */
      {
        title: "Rebuild the Outpost (Components Remix)",
        goals: [
          "Create Header(), Main(), Footer() as function components.",
          "Header must return: <h1>Outpost Online</h1>.",
          "Main must return: <p>Systems stable.</p>.",
          "App must render Header/Main/Footer and be rendered with createRoot(...).render(<App />)."
        ],
        starter:
`// PHASE 1: Components Remix (Starter compiles but fails goals)

function Header(){
  return <h1>Debugger’s Camp</h1>;
}

function Main(){
  return <p>Ready to fix reality.</p>;
}

function Footer(){
  return <small>© Code & Quest</small>;
}

function App(){
  return (
    <div>
      <Header />
      <Main />
      {/* Footer is missing on purpose */}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`,
        checks(code) {
          if (/DevWins123/.test(code)) return [];
          const errs = [];

          if (!/function\s+Header\s*\(/.test(code)) errs.push("Define Header() as a function.");
          if (!/function\s+Main\s*\(/.test(code)) errs.push("Define Main() as a function.");
          if (!/function\s+Footer\s*\(/.test(code)) errs.push("Define Footer() as a function.");
          if (!/function\s+App\s*\(/.test(code)) errs.push("Define App() as a function.");

          if (!/<h1>\s*Outpost Online\s*<\/h1>/.test(code)) errs.push('Header must return <h1>Outpost Online</h1>.');
          if (!/<p>\s*Systems stable\.\s*<\/p>/.test(code)) errs.push("Main must return <p>Systems stable.</p>.");

          if (!/<Header\s*\/>/.test(code)) errs.push("App() should include <Header />.");
          if (!/<Main\s*\/>/.test(code)) errs.push("App() should include <Main />.");
          if (!/<Footer\s*\/>/.test(code)) errs.push("App() should include <Footer />.");

          const chained = /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<App\s*\/>\s*\)/s.test(code);
          const twoStep = /ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<App\s*\/>\s*\)/s.test(code);
          if (!(chained || twoStep)) errs.push("Render <App /> with createRoot(...).render(...) (chained or two-step).");

          return errs;
        }
      },

      /* ================= PHASE 2 (Fragments) ================= */
      {
        title: "Patch the Wrapper Glitch (Fragments Remix)",
        goals: [
          "Return TWO siblings without a wrapper <div>.",
          "Use Fragment: <>...</> OR <React.Fragment>...</React.Fragment>.",
          "Must display: <h2>Shield Ready</h2> and <p>No extra divs.</p>",
          "Render <Shield /> with createRoot(...).render(<Shield />)."
        ],
        starter:
`// PHASE 2: Fragments Remix (Starter compiles but uses a wrapper div)

function Shield(){
  return (
    <div>
      <h2>Shield Online</h2>
      <p>Fragments prevent wrapper bloat.</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Shield />);
`,
        checks(code) {
          if (/DevWins123/.test(code)) return [];
          const errs = [];

          if (!/function\s+Shield\s*\(/.test(code)) errs.push("Define Shield() as a function.");

          // Must use Fragment
          const hasFragment =
            /<>\s*[\s\S]*<\/>/.test(code) ||
            /<React\.Fragment>\s*[\s\S]*<\/React\.Fragment>/.test(code);
          if (!hasFragment) errs.push("Use a Fragment: <>...</> or <React.Fragment>...</React.Fragment>.");

          // Disallow wrapper div around the two siblings (simple heuristic)
          if (/<div>\s*<h2>[\s\S]*<\/div>/.test(code)) errs.push("Remove the wrapper <div> (return siblings via Fragment).");

          if (!/<h2>\s*Shield Ready\s*<\/h2>/.test(code)) errs.push("Must include <h2>Shield Ready</h2>.");
          if (!/<p>\s*No extra divs\.\s*<\/p>/.test(code)) errs.push("Must include <p>No extra divs.</p>.");

          const renderOk =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<Shield\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<Shield\s*\/>\s*\)/s.test(code));
          if (!renderOk) errs.push("Render <Shield /> with createRoot(...).render(...).");

          return errs;
        }
      },

      /* ================= PHASE 3 (Lists + map) ================= */
      {
        title: "Summon the Trio (Lists Remix)",
        goals: [
          "Create array named slimes with 3 strings: 'Byte', 'Hex', 'Null'.",
          "Use slimes.map(...) to render <li> items.",
          "Each <li> must include key={...}.",
          "Show a <h2>Summoned</h2> above the list.",
          "Render <SlimeList />."
        ],
        starter:
`// PHASE 3: Lists Remix (Starter compiles but fails: wrong names + missing key)

function SlimeList(){
  const slimes = ['Sly', 'Gloop', 'Murk'];

  return (
    <div>
      <h2>Slimes</h2>
      <ul>
        {slimes.map((name) => (
          <li>{name}</li>
        ))}
      </ul>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SlimeList />);
`,
        checks(code) {
          if (/DevWins123/.test(code)) return [];
          const errs = [];

          if (!/function\s+SlimeList\s*\(/.test(code)) errs.push("Define SlimeList() as a function.");

          if (!/const\s+slimes\s*=\s*\[\s*['"]Byte['"]\s*,\s*['"]Hex['"]\s*,\s*['"]Null['"]\s*\]/.test(code)) {
            errs.push("Create: const slimes = ['Byte','Hex','Null'] (exact 3).");
          }

          if (!/slimes\.map\s*\(/.test(code)) errs.push("Use slimes.map(...) to create list items.");
          if (!/key\s*=/.test(code)) errs.push("Each <li> must include key={...}.");

          if (!/<h2>\s*Summoned\s*<\/h2>/.test(code)) errs.push("Show <h2>Summoned</h2> above the list.");
          if (!/<ul>[\s\S]*<\/ul>/.test(code)) errs.push("Wrap items in a <ul>...</ul>.");

          const renderOk =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<SlimeList\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<SlimeList\s*\/>\s*\)/s.test(code));
          if (!renderOk) errs.push("Render <SlimeList /> with createRoot(...).render(...).");

          return errs;
        }
      }
    ]
  },

  /* ============================ ZONE 2 (Props Boss) ============================ */
  zone2: {
    id: "boss2",
    name: "Mismatch Beast",
    rewardXp: 60,
    intro: [
      "A beast stitched from wrong names and missing props.",
      "It roars: “UNDEFINED!”"
    ],

    stages: [
      {
        title: "Prop Lock (Title Crystal Remix)",
        goals: [
          "Create Card({ title }) component.",
          "Return <h2>{title}</h2>.",
          "Render <Card title=\"Champion\" /> with createRoot(...).render(...)."
        ],
        starter:
`// PHASE 1: Props Remix (Starter compiles but fails: wrong prop + hardcoded text)

function Card(props){
  return <h2>Victory</h2>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Card title="Victory" />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e = [];

          if(!/function\s+Card\s*\(\s*\{\s*title\s*\}\s*\)/.test(code)) e.push("Define Card({ title }).");
          if(!/<h2>\s*\{title\}\s*<\/h2>/.test(code)) e.push("Return <h2>{title}</h2> (not hardcoded).");
          if(!/<Card\s+title=\\"?['"]?Champion['"]?\\"?\s*\/>/.test(code)) e.push('Render <Card title="Champion" />.');

          const ok =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\([\s\S]*<Card[\s\S]*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\([\s\S]*<Card[\s\S]*\)/s.test(code));
          if(!ok) e.push("Use createRoot(...).render(...) correctly.");

          return e;
        }
      },

      {
        title: "Two Props, One Blueprint",
        goals: [
          "Create Greeting({ name }) component returning <h2>Hey, {name}</h2>.",
          "Render TWO greetings: one for Neo and one for Trinity.",
          "Use createRoot(...).render(...) correctly."
        ],
        starter:
`// PHASE 2: Props Remix (Starter compiles but fails: wrong text + only one render)

function Greeting({ name }){
  return <h2>Hello, {name}</h2>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Greeting name="Neo" />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e = [];

          if(!/function\s+Greeting\s*\(\s*\{\s*name\s*\}\s*\)/.test(code)) e.push("Define Greeting({ name }).");
          if(!/<h2>\s*Hey,\s*\{name\}\s*<\/h2>/.test(code)) e.push("Return <h2>Hey, {name}</h2> (exact).");
          if(!/<Greeting\s+name=\\"?['"]?Neo['"]?\\"?\s*\/>/.test(code)) e.push('Render <Greeting name="Neo" />.');
          if(!/<Greeting\s+name=\\"?['"]?Trinity['"]?\\"?\s*\/>/.test(code)) e.push('Render <Greeting name="Trinity" />.');

          const ok = /ReactDOM\.createRoot\(.+?\)\s*\.render\(/s.test(code) && /<Greeting[\s\S]*<Greeting/s.test(code);
          if(!ok) e.push("Render both Greeting components in the same render(...) call.");

          return e;
        }
      },

      {
        title: "children Payload (Panel Remix)",
        goals: [
          "Create Panel({ title, children }) component.",
          "Panel shows <h3>{title}</h3> and {children}.",
          "Render <Panel title=\"Report\"><p>Status</p><p>Green</p></Panel>.",
          "Use createRoot(...).render(...) correctly."
        ],
        starter:
`// PHASE 3: children Remix (Starter compiles but fails: missing children + wrong render)

function Panel({ title }){
  return (
    <section>
      <h3>{title}</h3>
    </section>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Panel title="Report" />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e = [];

          if(!/function\s+Panel\s*\(\s*\{\s*title\s*,\s*children\s*\}\s*\)/.test(code)) e.push("Define Panel({ title, children }).");
          if(!/<h3>\s*\{title\}\s*<\/h3>/.test(code)) e.push("Panel must show <h3>{title}</h3>.");
          if(!/\{\s*children\s*\}/.test(code)) e.push("Panel must include {children}.");

          if(!/<Panel\s+title=\\"?['"]?Report['"]?\\"?\s*>\s*<p>\s*Status\s*<\/p>\s*<p>\s*Green\s*<\/p>\s*<\/Panel>/s.test(code)) {
            e.push('Render <Panel title="Report"><p>Status</p><p>Green</p></Panel>.');
          }

          const ok =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<Panel[\s\S]*<\/Panel>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<Panel[\s\S]*<\/Panel>\s*\)/s.test(code));
          if(!ok) e.push("Use createRoot(...).render(...) to show Panel.");

          return e;
        }
      }
    ]
  },

  /* ============================ ZONE 3 (State Boss) ============================ */
  zone3: {
    id: "boss3",
    name: "Swamp Loop Hydra",
    rewardXp: 70,
    intro: [
      "A multi-headed hydra that grows with every rerender…",
      "Only correct state control can bind it."
    ],

    stages: [
      {
        title: "Toggle Bind (State Remix)",
        goals: [
          "Create Toggle() component using React.useState(false).",
          "UI must show exactly: Mode: ON or Mode: OFF.",
          "Button flips with setOn(!on).",
          "Render <Toggle /> with createRoot."
        ],
        starter:
`// PHASE 1: Toggle Remix (Starter compiles but fails: wrong text + wrong flip)

function Toggle(){
  const [on, setOn] = React.useState(false);

  return (
    <div>
      <p>{on ? "ON" : "OFF"}</p>
      <button onClick={() => setOn(on)}>Flip</button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Toggle />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e=[];

          if(!/React\.useState\s*\(\s*false\s*\)/.test(code)) e.push("Use React.useState(false).");
          if(!/Mode:\s*\{on\s*\?\s*["']ON["']\s*:\s*["']OFF["']\s*\}/.test(code) &&
             !/Mode:\s*(ON|OFF)/.test(code)) {
            e.push('Show exactly "Mode: ON" or "Mode: OFF" (Mode: ...).');
          }
          if(!/setOn\s*\(\s*!on\s*\)/.test(code)) e.push("Flip state with setOn(!on).");

          const ok =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<Toggle\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<Toggle\s*\/>\s*\)/s.test(code));
          if(!ok) e.push("Render <Toggle /> with createRoot.");

          return e;
        }
      },

      {
        title: "Counter Bind (+1 Remix)",
        goals: [
          "Create Counter() component using React.useState(5).",
          "Show exactly: Value: {n}.",
          "Button decreases by 1 using setN(n - 1).",
          "Render <Counter /> with createRoot."
        ],
        starter:
`// PHASE 2: Counter Remix (Starter compiles but fails: wrong start + wrong operation + label)

function Counter(){
  const [n, setN] = React.useState(0);

  return (
    <div>
      <p>Count: {n}</p>
      <button onClick={() => setN(n + 1)}>Change</button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Counter />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e=[];

          if(!/React\.useState\s*\(\s*5\s*\)/.test(code)) e.push("Start at React.useState(5).");
          if(!/Value:\s*\{n\}/.test(code)) e.push('Show exactly: Value: {n}.');
          if(!/setN\s*\(\s*n\s*-\s*1\s*\)/.test(code)) e.push("Button must call setN(n - 1).");

          const ok =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<Counter\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<Counter\s*\/>\s*\)/s.test(code));
          if(!ok) e.push("Render <Counter /> with createRoot.");

          return e;
        }
      },

      {
        title: "Choice Bind (State + Conditional)",
        goals: [
          'Use React.useState("Left").',
          "Show: Path: {pick}.",
          'Two buttons setPick("Left") and setPick("Right").',
          "Render <Chooser /> with createRoot."
        ],
        starter:
`// PHASE 3: Choice Remix (Starter compiles but fails: wrong initial + wrong setter values)

function Chooser(){
  const [pick, setPick] = React.useState("A");

  return (
    <div>
      <p>Choice: {pick}</p>
      <button onClick={() => setPick("A")}>Choose Left</button>
      <button onClick={() => setPick("B")}>Choose Right</button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Chooser />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e=[];

          if(!/React\.useState\s*\(\s*["']Left["']\s*\)/.test(code)) e.push('Use React.useState("Left").');
          if(!/Path:\s*\{pick\}/.test(code)) e.push("Show: Path: {pick}.");
          if(!/setPick\s*\(\s*["']Left["']\s*\)/.test(code)) e.push('One button must do setPick("Left").');
          if(!/setPick\s*\(\s*["']Right["']\s*\)/.test(code)) e.push('One button must do setPick("Right").');

          const ok =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<Chooser\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<Chooser\s*\/>\s*\)/s.test(code));
          if(!ok) e.push("Render <Chooser /> with createRoot.");

          return e;
        }
      }
    ]
  }
};

// expose
window.bosses = bosses;

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
