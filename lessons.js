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
      "The Mentor whispers: “Forge your first blade-a simple component.”"
    ],
    learn: [
      learn(
        "What’s a Component?",
        "A component is your **sword blueprint**-a tiny function that returns UI. Call it to forge a new sword.",
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
        title: "Step 1 - Create the blueprint",
        explain: "Make a function component named Hello. This is your sword plan.",
        snippet:
`function Hello(){
  return <h1>Greetings, Traveler!</h1>;
}`
      },
      {
        title: "Step 2 - Mount the forge",
        explain: "Tell React where to put your UI (the anvil).",
        snippet:
`const root = ReactDOM.createRoot(document.getElementById('root'));`
      },
      {
        title: "Step 3 - Forge your first blade",
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
        "Like **sword, shield, and potion**-smaller parts are easier to upgrade and reuse.",
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
      { title: "Step 1 - Header", explain: "Your signpost.", snippet:
`function Header(){
  return <h1>Welcome to Camp</h1>;
}`},
      { title: "Step 2 - Main", explain: "Your campfire message.", snippet:
`function Main(){
  return <p>Sharpen your JSX.</p>;
}`},
      { title: "Step 3 - Footer", explain: "A small tag.", snippet:
`function Footer(){
  return <small>© Camp</small>;
}`},
      { title: "Step 4 - App packs them", explain: "Put all gear into your backpack.", snippet:
`function App(){
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}`},
      { title: "Step 5 - Render App", explain: "Show the camp on the page.", snippet:
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
      "JSX is like a **crate shipment**-you can’t deliver two separate crates without packing them together.",
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
    { title: "Step 1 - Make Duo", explain: "Return two elements wrapped.", snippet:
`function Duo(){
  return (
    <>
      <h1>Two</h1>
      <p>Wrapped</p>
    </>
  );
}`},
    { title: "Step 2 - Render it", explain: "Mount it to the page.", snippet:
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
    "The Archivist says: “Use a loop spell - map() - and give each slime a key.”"
  ],
  learn: [
    learn(
      "Rendering lists",
      "A list is a **summoning circle**-an array becomes multiple UI elements.",
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
    { title: "Step 1 - Array + map", explain: "Turn an array into <li> elements.", snippet:
`function SlimeList(){
  const slimes = ["Gloop", "Splurt", "Drip"];
  return (
    <ul>
      {slimes.map(s => <li key={s}>{s}</li>)}
    </ul>
  );
}`},
    { title: "Step 2 - Render it", explain: "Show the slime army.", snippet:
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
      "Like a **guard**: if you have the pass, you enter - otherwise you wait.",
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
    { title: "Step 1 - Gate logic", explain: "Decide which message appears.", snippet:
`function Gate(){
  const ok = true;
  return <h2>{ok ? "ACCESS GRANTED" : "ACCESS DENIED"}</h2>;
}`},
    { title: "Step 2 - Render it", explain: "Show the gate result.", snippet:
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
        "Props are **upgrade gems**-data you pass into a component.",
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
      { title: "Step 1 - Make Greeting", explain: "Receive the name gem.", snippet:
`function Greeting({ name }){
  return <h2>Hello, {name}</h2>;
}`},
      { title: "Step 2 - Render it", explain: "Socket the gem into the blade.", snippet:
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

  const hasGreetingFunction =
    /function\s+Greeting\s*\(\s*\{\s*name\s*\}\s*\)/.test(code);

  const rendersGreetingMack =
    /<Greeting\s+name\s*=\s*["']Mack["']\s*\/\s*>/.test(code);

  const outputsHelloMack =
    /<h2>\s*Hello,\s*Mack\s*<\/h2>/.test(code) ||
    /<h2>\s*Hello,\s*\{\s*name\s*\}\s*<\/h2>/.test(code);

  if (!hasGreetingFunction) {
    errs.push("Define Greeting({ name }).");
  }

  if (!rendersGreetingMack) {
    errs.push('Render <Greeting name="Mack" />.');
  }

  if (!outputsHelloMack) {
    errs.push("Output <h2>Hello, Mack</h2> or <h2>Hello, {name}</h2>.");
  }

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
        "Think of a chest with slots-the contents you place inside are the `children`.",
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
      { title: "Step 1 - Panel", explain: "Title plus any inside content.", snippet:
`function Panel({ title, children }){
  return (
    <section>
      <h3>{title}</h3>
      {children}
    </section>
  );
}`},
      { title: "Step 2 - Render it", explain: "Place content between tags.", snippet:
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

  const hasPanelFunction =
    /function\s+Panel\s*\(\s*\{\s*title\s*,\s*children\s*\}\s*\)/.test(code);

  const showsTitle =
    /<h3>\s*\{\s*title\s*\}\s*<\/h3>/.test(code);

  const showsChildren =
    /\{\s*children\s*\}/.test(code);

  const rendersPanelLog =
    /<Panel\s+title\s*=\s*["']Log["']\s*>\s*<p>\s*Entry\s*<\/p>\s*<\/Panel>/s.test(code);

  if (!hasPanelFunction) {
    errs.push("Define Panel({ title, children }).");
  }

  if (!showsTitle) {
    errs.push("Panel must show <h3>{title}</h3>.");
  }

  if (!showsChildren) {
    errs.push("Panel must include {children}.");
  }

  if (!rendersPanelLog) {
    errs.push('Render <Panel title="Log"><p>Entry</p></Panel>.');
  }

  return errs;
},
    xp: 30,
  },

  {
  id: "r09",
  zone: "zone2",
  title: "Events: Click the Signal",
  story: [
    "A signal beacon in Prop Plains refuses to fire.",
    "The Tinker says: “Buttons respond only when properly wired.”"
  ],
  learn: [
    learn(
      "React click events",
      "An event handler is like a **trigger rune**-the action only happens when the button is pressed.",
      [
        "React uses `onClick`, not `onclick`.",
        "Pass the function itself: `onClick={handleClick}`.",
        "Do not call the function immediately in JSX unless using an arrow function on purpose."
      ]
    )
  ],
  loot: [
    "You will build: `Beacon` with a working click button.",
    "Victory tip: define the handler, then connect it with `onClick`."
  ],
  steps: [
    { title: "Step 1 - Make the handler", explain: "Create the function that will run when clicked.", snippet:
`function Beacon(){
  function handleClick(){
    console.log("Signal sent!");
  }

  return <button onClick={handleClick}>Send Signal</button>;
}`},
    { title: "Step 2 - Render it", explain: "Mount the beacon.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<Beacon />);`}
  ],
  demo:
`function Beacon(){
  function handleClick(){ console.log("Signal sent!"); }
  return <button onClick={handleClick}>Send Signal</button>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<Beacon />);`,
  goals: [
    "Create Beacon()",
    "Define function handleClick()",
    "Button uses onClick={handleClick}",
    "Render <Beacon />"
  ],
  starter: `// Make a button that calls handleClick when clicked.
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e = [];
    if (!/function\s+Beacon\s*\(/.test(code)) e.push("Define Beacon().");
    if (!/function\s+handleClick\s*\(/.test(code)) e.push("Define handleClick().");
    if (!/onClick=\{\s*handleClick\s*\}/.test(code)) e.push("Use onClick={handleClick} on the button.");
    if (!/<button/.test(code)) e.push("Include a button.");
    const okRender =
      /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<Beacon\s*\/>\s*\)/s.test(code) ||
      (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<Beacon\s*\/>\s*\)/s.test(code));
    if (!okRender) e.push("Render <Beacon />.");
    return e;
  },
  xp: 25,
},

{
  id: "r10",
  zone: "zone2",
  title: "Events: Pass an Argument",
  story: [
    "A message crystal needs a specific command phrase.",
    "The Archivist says: “Sometimes the trigger must carry a payload.”"
  ],
  learn: [
    learn(
      "Passing arguments in events",
      "Using an arrow function is like **packing a message into a spell scroll** before casting it.",
      [
        "Use `onClick={() => handleClick('Boost!')}` to pass data.",
        "If you write `onClick={handleClick('Boost!')}`, it runs too early.",
        "Arrow functions are useful when the handler needs custom input."
      ]
    )
  ],
  loot: [
    "You will build: `ShoutButton` that sends the text Boost! to a handler.",
    "Victory tip: use an arrow function in onClick."
  ],
  steps: [
    { title: "Step 1 - Handler with input", explain: "Let the function accept a message.", snippet:
`function ShoutButton(){
  function shout(msg){
    console.log(msg);
  }

  return <button onClick={() => shout("Boost!")}>Boost</button>;
}`},
    { title: "Step 2 - Render it", explain: "Mount the button.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<ShoutButton />);`}
  ],
  demo:
`function ShoutButton(){
  function shout(msg){ console.log(msg); }
  return <button onClick={() => shout("Boost!")}>Boost</button>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<ShoutButton />);`,
  goals: [
    "Create ShoutButton()",
    "Define shout(msg)",
    "Use onClick={() => shout(\"Boost!\")}",
    "Render <ShoutButton />"
  ],
  starter: `// Pass "Boost!" into a click handler using an arrow function.
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e = [];
    if (!/function\s+ShoutButton\s*\(/.test(code)) e.push("Define ShoutButton().");
    if (!/function\s+shout\s*\(\s*msg\s*\)/.test(code)) e.push("Define shout(msg).");
    if (!/onClick=\{\s*\(\)\s*=>\s*shout\(\s*["']Boost!["']\s*\)\s*\}/.test(code)) e.push('Use onClick={() => shout("Boost!")}.');
    const okRender =
      /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<ShoutButton\s*\/>\s*\)/s.test(code) ||
      (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<ShoutButton\s*\/>\s*\)/s.test(code));
    if (!okRender) e.push("Render <ShoutButton />.");
    return e;
  },
  xp: 30,
},

{
  id: "r11",
  zone: "zone2",
  title: "Controlled Textarea",
  story: [
    "A feedback scroll glows with unstable text.",
    "The Mentor says: “Bind what the player types, or the scroll drifts out of sync.”"
  ],
  learn: [
    learn(
      "Controlled inputs",
      "A controlled input is like a **tethered familiar**-the UI and state stay connected.",
      [
        "Use `const [comment, setComment] = React.useState(\"\")`.",
        "Bind with `value={comment}`.",
        "Update with `onChange={(e) => setComment(e.target.value)}`."
      ]
    )
  ],
  loot: [
    "You will build: `CommentBox` with a textarea tied to state.",
    "Victory tip: value and onChange must both be present."
  ],
  steps: [
    { title: "Step 1 - State", explain: "Track comment text in state.", snippet:
`function CommentBox(){
  const [comment, setComment] = React.useState("");

  return (
    <div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <p>Your Comment: {comment}</p>
    </div>
  );
}`},
    { title: "Step 2 - Render it", explain: "Show the box on the page.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<CommentBox />);`}
  ],
  demo:
`function CommentBox(){
  const [comment, setComment] = React.useState("");
  return (
    <div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <p>Your Comment: {comment}</p>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<CommentBox />);`,
  goals: [
    "Use React.useState(\"\") for comment",
    "Textarea uses value={comment}",
    "Textarea updates with e.target.value",
    "Show {comment} in a <p>"
  ],
  starter: `// Make a controlled textarea using comment state.
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e = [];
    if (!/React\.useState\s*\(\s*["']["']\s*\)/.test(code)) e.push("Use React.useState(\"\") for comment.");
    if (!/value=\{\s*comment\s*\}/.test(code)) e.push("Bind textarea with value={comment}.");
    if (!/onChange=\{\s*\(e\)\s*=>\s*setComment\(e\.target\.value\)\s*\}/.test(code)) e.push("Use onChange={(e) => setComment(e.target.value)}.");
    if (!/Your Comment:\s*\{comment\}/.test(code)) e.push("Show the current comment in the paragraph.");
    return e;
  },
  xp: 30,
},

{
  id: "r12",
  zone: "zone2",
  title: "Controlled Select",
  story: [
    "The plains forge offers three mounts, but the selector rune is broken.",
    "The Tinker says: “A dropdown is just another tethered input.”"
  ],
  learn: [
    learn(
      "Controlled select",
      "A select box is like choosing a **mount at a stable**-state remembers which one you picked.",
      [
        "Use `const [car, setCar] = React.useState(\"Fiat\")`.",
        "Bind with `value={car}` on `<select>`.",
        "Update with `onChange={(e) => setCar(e.target.value)}`."
      ]
    )
  ],
  loot: [
    "You will build: `CarSelector` with a controlled dropdown.",
    "Victory tip: state should match the selected option."
  ],
  steps: [
    { title: "Step 1 - State + select", explain: "Control the selected value.", snippet:
`function CarSelector(){
  const [car, setCar] = React.useState("Fiat");

  return (
    <form>
      <select value={car} onChange={(e) => setCar(e.target.value)}>
        <option value="Ford">Ford</option>
        <option value="Volvo">Volvo</option>
        <option value="Fiat">Fiat</option>
      </select>
      <p>Selected car: {car}</p>
    </form>
  );
}`},
    { title: "Step 2 - Render it", explain: "Mount the selector.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<CarSelector />);`}
  ],
  demo:
`function CarSelector(){
  const [car, setCar] = React.useState("Fiat");
  return (
    <form>
      <select value={car} onChange={(e) => setCar(e.target.value)}>
        <option value="Ford">Ford</option>
        <option value="Volvo">Volvo</option>
        <option value="Fiat">Fiat</option>
      </select>
      <p>Selected car: {car}</p>
    </form>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<CarSelector />);`,
  goals: [
    "Use React.useState(\"Fiat\")",
    "Bind select with value={car}",
    "Update car with e.target.value",
    "Show Selected car: {car}"
  ],
  starter: `// Make a controlled select dropdown using car state.
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e = [];
    if (!/React\.useState\s*\(\s*["']Fiat["']\s*\)/.test(code)) e.push('Use React.useState("Fiat").');
    if (!/<select[^>]*value=\{\s*car\s*\}/.test(code)) e.push("Bind the select with value={car}.");
    if (!/onChange=\{\s*\(e\)\s*=>\s*setCar\(e\.target\.value\)\s*\}/.test(code)) e.push("Update car with e.target.value.");
    if (!/Selected car:\s*\{car\}/.test(code)) e.push("Show Selected car: {car}.");
    return e;
  },
  xp: 30,
},

{
  id: "r13",
  zone: "zone2",
  title: "Checkbox of Consent",
  story: [
    "A contract gate in the plains demands agreement before passage.",
    "The Archivist says: “Checkboxes obey checked, not plain value.”"
  ],
  learn: [
    learn(
      "Controlled checkbox",
      "A checkbox is like a **seal on a contract**-either marked or unmarked.",
      [
        "Use `const [acceptTerms, setAcceptTerms] = React.useState(false)`.",
        "Bind checkboxes with `checked={acceptTerms}`.",
        "Update from `e.target.checked`."
      ]
    )
  ],
  loot: [
    "You will build: `TermsForm` with a controlled checkbox.",
    "Victory tip: checkboxes use checked, not value."
  ],
  steps: [
    { title: "Step 1 - State + checkbox", explain: "Track whether the box is checked.", snippet:
`function TermsForm(){
  const [acceptTerms, setAcceptTerms] = React.useState(false);

  return (
    <form>
      <label>
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
        />
        I accept the terms
      </label>
    </form>
  );
}`},
    { title: "Step 2 - Render it", explain: "Mount the form.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<TermsForm />);`}
  ],
  demo:
`function TermsForm(){
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  return (
    <form>
      <label>
        <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
        I accept the terms
      </label>
    </form>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<TermsForm />);`,
  goals: [
    "Use React.useState(false)",
    "Checkbox uses checked={acceptTerms}",
    "Update from e.target.checked"
  ],
  starter: `// Build a controlled checkbox using acceptTerms state.
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e = [];
    if (!/React\.useState\s*\(\s*false\s*\)/.test(code)) e.push("Use React.useState(false).");
    if (!/checked=\{\s*acceptTerms\s*\}/.test(code)) e.push("Bind the checkbox with checked={acceptTerms}.");
    if (!/setAcceptTerms\(e\.target\.checked\)/.test(code)) e.push("Update state with e.target.checked.");
    return e;
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
      "Track a number-like your **XP bar**-and change it on click."
    ],
    learn: [
      learn(
        "State is memory",
        "State is your **health/XP bar**-it changes as you play.",
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
      { title: "Step 1 - Make Counter", explain: "Create the component.", snippet:
`function Counter(){
  const [n, setN] = React.useState(0);
  return (
    <div>
      <p>XP: {n}</p>
      <button onClick={() => setN(n + 1)}>Gain XP</button>
    </div>
  );
}`},
      { title: "Step 2 - Render it", explain: "Mount your counter.", snippet:
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

{
  id: "r14",
  zone: "zone3",
  title: "useState: Theme Switch",
  story: [
    "The swamp glows in two moods: light and dark.",
    "The Mentor says: “State can hold words, not just numbers.”"
  ],
  learn: [
    learn(
      "String state",
      "State can remember a **mode crystal** just as easily as a score.",
      [
        "Use `const [theme, setTheme] = React.useState(\"light\")`.",
        "Render `{theme}` in JSX.",
        "Update it with the setter function."
      ]
    )
  ],
  loot: [
    "You will build: `ThemePanel` that changes from light to dark.",
    "Victory tip: use setTheme(\"dark\") on click."
  ],
  steps: [
    { title: "Step 1 - String state", explain: "Track the current theme.", snippet:
`function ThemePanel(){
  const [theme, setTheme] = React.useState("light");

  return (
    <div>
      <h1>The theme is: {theme}</h1>
      <button onClick={() => setTheme("dark")}>Change to Dark</button>
    </div>
  );
}`},
    { title: "Step 2 - Render it", explain: "Mount the theme panel.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<ThemePanel />);`}
  ],
  demo:
`function ThemePanel(){
  const [theme, setTheme] = React.useState("light");
  return (
    <div>
      <h1>The theme is: {theme}</h1>
      <button onClick={() => setTheme("dark")}>Change to Dark</button>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<ThemePanel />);`,
  goals: [
    "Use React.useState(\"light\")",
    "Show The theme is: {theme}",
    "Button sets theme to dark"
  ],
  starter: `// Make a theme panel with string state.
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e = [];
    if (!/React\.useState\s*\(\s*["']light["']\s*\)/.test(code)) e.push('Use React.useState("light").');
    if (!/The theme is:\s*\{theme\}/.test(code)) e.push("Show The theme is: {theme}.");
    if (!/setTheme\s*\(\s*["']dark["']\s*\)/.test(code)) e.push('Use setTheme("dark") on button click.');
    return e;
  },
  xp: 30,
},

  {
  id: "r15",
  zone: "zone3",
  title: "Multiple State Crystals",
  story: [
    "Two crystals pulse in the swamp: identity and score.",
    "The Tinker grins: “One component can track more than one thing.”"
  ],
  learn: [
    learn(
      "Multiple state hooks",
      "Think of separate state hooks as **different inventory slots**-each stores its own item.",
      [
        "You can call `React.useState(...)` more than once.",
        "Keep related values readable by naming them clearly.",
        "Render both values anywhere inside the component."
      ]
    )
  ],
  loot: [
    "You will build: `PlayerInfo` with username and score state.",
    "Victory tip: use two separate state hooks."
  ],
  steps: [
    { title: "Step 1 - Two state hooks", explain: "Track username and score separately.", snippet:
`function PlayerInfo(){
  const [username, setUsername] = React.useState("Guest");
  const [score, setScore] = React.useState(0);

  return (
    <div>
      <h1>Player: {username}</h1>
      <p>Score: {score}</p>
    </div>
  );
}`},
    { title: "Step 2 - Render it", explain: "Mount the panel.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<PlayerInfo />);`}
  ],
  demo:
`function PlayerInfo(){
  const [username, setUsername] = React.useState("Guest");
  const [score, setScore] = React.useState(0);
  return (
    <div>
      <h1>Player: {username}</h1>
      <p>Score: {score}</p>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<PlayerInfo />);`,
  goals: [
    "Use one state hook for username",
    "Use one state hook for score",
    "Show Player: {username}",
    "Show Score: {score}"
  ],
  starter: `// Track both username and score in one component.
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e = [];
    const stateCalls = (code.match(/React\.useState\s*\(/g) || []).length;
    if (stateCalls < 2) e.push("Use two React.useState(...) calls.");
    if (!/Player:\s*\{username\}/.test(code)) e.push("Show Player: {username}.");
    if (!/Score:\s*\{score\}/.test(code)) e.push("Show Score: {score}.");
    return e;
  },
  xp: 30,
},

{
  id: "r16",
  zone: "zone3",
  title: "Object State Update",
  story: [
    "A swamp relic stores many values in one shell.",
    "The Archivist warns: “Replace one field carefully, or you shatter the whole record.”"
  ],
  learn: [
    learn(
      "Updating object state",
      "An object in state is like a **character sheet**-change one stat without erasing the rest.",
      [
        "Object state is replaced, not merged automatically.",
        "Use the spread operator: `{ ...old, score: 100 }`.",
        "Updater functions are safe for deriving the next state."
      ]
    )
  ],
  loot: [
    "You will build: `Player` that updates only score to 100.",
    "Victory tip: keep username by spreading previousState."
  ],
  steps: [
    { title: "Step 1 - Object state", explain: "Store several values together.", snippet:
`function Player(){
  const [playerData, setPlayerData] = React.useState({
    username: "Alex",
    score: 50,
    level: 2
  });

  function updateScore(){
    setPlayerData(previousState => {
      return { ...previousState, score: 100 };
    });
  }

  return (
    <div>
      <p>User: {playerData.username}</p>
      <p>Score: {playerData.score}</p>
      <button onClick={updateScore}>Max Score</button>
    </div>
  );
}`},
    { title: "Step 2 - Render it", explain: "Mount the player card.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<Player />);`}
  ],
  demo:
`function Player(){
  const [playerData, setPlayerData] = React.useState({ username: "Alex", score: 50, level: 2 });
  function updateScore(){
    setPlayerData(previousState => ({ ...previousState, score: 100 }));
  }
  return (
    <div>
      <p>User: {playerData.username}</p>
      <p>Score: {playerData.score}</p>
      <button onClick={updateScore}>Max Score</button>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<Player />);`,
  goals: [
    "Use object state with username, score, level",
    "Use previousState => ({ ...previousState, score: 100 })",
    "Keep username visible",
    "Button calls updateScore"
  ],
  starter: `// Update only the score field without removing username or level.
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e = [];
    if (!/playerData/.test(code)) e.push("Use playerData object state.");
    if (!/previousState/.test(code)) e.push("Use previousState in the updater.");
    if (!/\.\.\.\s*previousState/.test(code)) e.push("Spread previousState to keep old fields.");
    if (!/score\s*:\s*100/.test(code)) e.push("Update score to 100.");
    return e;
  },
  xp: 35,
},

{
  id: "r17",
  zone: "zone3",
  title: "useEffect: First Echo",
  story: [
    "A timer vine ticks once in the swamp mist.",
    "The Mentor says: “Some code should run after rendering, but only once.”"
  ],
  learn: [
    learn(
      "useEffect with empty dependency array",
      "An effect is like a **post-battle ritual**-it runs after the render is done.",
      [
        "Use `React.useEffect(() => { ... }, [])` to run once.",
        "The empty array means: only on the first render.",
        "Effects are useful for timers, setup, and outside work."
      ]
    )
  ],
  loot: [
    "You will build: `Timer` that increments count after the first render.",
    "Victory tip: use [] so it does not rerun forever."
  ],
  steps: [
    { title: "Step 1 - State + effect", explain: "Run one timeout after mount.", snippet:
`function Timer(){
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => {
      setCount((count) => count + 1);
    }, 1000);
  }, []);

  return <h1>I've rendered {count} times!</h1>;
}`},
    { title: "Step 2 - Render it", explain: "Mount the timer.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<Timer />);`}
  ],
  demo:
`function Timer(){
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    setTimeout(() => {
      setCount((count) => count + 1);
    }, 1000);
  }, []);
  return <h1>I've rendered {count} times!</h1>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<Timer />);`,
  goals: [
    "Use React.useEffect(..., [])",
    "Use setTimeout inside the effect",
    "Update count with setCount((count) => count + 1)"
  ],
  starter: `// Use React.useEffect with [] so the timer setup runs once.
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e = [];
    if (!/React\.useEffect\s*\(/.test(code)) e.push("Use React.useEffect(...).");
    if (!/\[\s*\]/.test(code)) e.push("Include an empty dependency array [].");
    if (!/setTimeout\s*\(/.test(code)) e.push("Use setTimeout inside the effect.");
    if (!/setCount\s*\(\s*\(count\)\s*=>\s*count\s*\+\s*1\s*\)/.test(code)) e.push("Increment with setCount((count) => count + 1).");
    return e;
  },
  xp: 35,
},

{
  id: "r18",
  zone: "zone3",
  title: "useEffect: Count Dependency",
  story: [
    "A swamp orb recalculates whenever the count changes.",
    "The Tinker says: “List your dependencies, or the magic goes stale.”"
  ],
  learn: [
    learn(
      "Dependency arrays",
      "Dependencies are like **watchstones**-the effect reruns whenever one of them changes.",
      [
        "Use `React.useEffect(() => { ... }, [count])`.",
        "Put every outside value the effect uses into the array.",
        "This keeps derived values in sync."
      ]
    )
  ],
  loot: [
    "You will build: `CounterCalc` that recalculates from count.",
    "Victory tip: count belongs in the dependency array."
  ],
  steps: [
    { title: "Step 1 - Derived calculation", explain: "Recompute when count changes.", snippet:
`function CounterCalc(){
  const [count, setCount] = React.useState(0);
  const [calculation, setCalculation] = React.useState(0);

  React.useEffect(() => {
    setCalculation(() => count * 2);
  }, [count]);

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <p>Calculation: {calculation}</p>
    </>
  );
}`},
    { title: "Step 2 - Render it", explain: "Mount the component.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<CounterCalc />);`}
  ],
  demo:
`function CounterCalc(){
  const [count, setCount] = React.useState(0);
  const [calculation, setCalculation] = React.useState(0);
  React.useEffect(() => {
    setCalculation(() => count * 2);
  }, [count]);
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <p>Calculation: {calculation}</p>
    </>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<CounterCalc />);`,
  goals: [
    "Use React.useEffect(..., [count])",
    "Set calculation to count * 2",
    "Show Count: {count}",
    "Show Calculation: {calculation}"
  ],
  starter: `// Recalculate when count changes by using [count].
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e = [];
    if (!/React\.useEffect\s*\(/.test(code)) e.push("Use React.useEffect(...).");
    if (!/\[\s*count\s*\]/.test(code)) e.push("Use [count] as the dependency array.");
    if (!/count\s*\*\s*2/.test(code)) e.push("Set calculation from count * 2.");
    if (!/Calculation:\s*\{calculation\}/.test(code)) e.push("Show Calculation: {calculation}.");
    return e;
  },
  xp: 35,
},

{
  id: "r19",
  zone: "zone3",
  title: "useEffect Cleanup",
  story: [
    "A timer spirit keeps lingering after the ritual ends.",
    "The Archivist says: “Clean up old magic, or it leaks into the swamp.”"
  ],
  learn: [
    learn(
      "Cleanup functions",
      "Cleanup is like **disarming a trap after using it**-leave no stray timer behind.",
      [
        "An effect can return a function.",
        "Use cleanup for timers, subscriptions, and listeners.",
        "Example: `return () => clearTimeout(timer)`."
      ]
    )
  ],
  loot: [
    "You will build: `TimerClean` with a cleanup function.",
    "Victory tip: return a function from the effect."
  ],
  steps: [
    { title: "Step 1 - Timer + cleanup", explain: "Clear the timeout when cleaning up.", snippet:
`function TimerClean(){
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let timer = setTimeout(() => {
      setCount((count) => count + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return <h1>I've rendered {count} times!</h1>;
}`},
    { title: "Step 2 - Render it", explain: "Mount the component.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<TimerClean />);`}
  ],
  demo:
`function TimerClean(){
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let timer = setTimeout(() => {
      setCount((count) => count + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  return <h1>I've rendered {count} times!</h1>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<TimerClean />);`,
  goals: [
    "Use React.useEffect(..., [])",
    "Store setTimeout in a timer variable",
    "Return () => clearTimeout(timer)"
  ],
  starter: `// Add cleanup to clear the timer.
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e = [];
    if (!/React\.useEffect\s*\(/.test(code)) e.push("Use React.useEffect(...).");
    if (!/setTimeout\s*\(/.test(code)) e.push("Use setTimeout.");
    if (!/return\s*\(\s*\)\s*=>\s*clearTimeout\s*\(\s*timer\s*\)/.test(code)) e.push("Return () => clearTimeout(timer).");
    return e;
  },
  xp: 35,
},

{
  id: "r20",
  zone: "zone3",
  title: "useRef: Focus Rune",
  story: [
    "A focus rune hovers over a dormant input altar.",
    "The Mentor says: “Refs let you reach directly into the real element.”"
  ],
  learn: [
    learn(
      "useRef for DOM access",
      "A ref is like a **target marker**-it points at a real element in the world.",
      [
        "Use `const inputElement = React.useRef()`.",
        "Attach it with `ref={inputElement}`.",
        "Call `inputElement.current.focus()` to focus the input."
      ]
    )
  ],
  loot: [
    "You will build: `FocusBox` that focuses an input when the button is clicked.",
    "Victory tip: attach the ref to the input."
  ],
  steps: [
    { title: "Step 1 - Ref + focus", explain: "Point to the input and focus it.", snippet:
`function FocusBox(){
  const inputElement = React.useRef();

  function focusInput(){
    inputElement.current.focus();
  }

  return (
    <>
      <input type="text" ref={inputElement} />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}`},
    { title: "Step 2 - Render it", explain: "Mount the focus box.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<FocusBox />);`}
  ],
  demo:
`function FocusBox(){
  const inputElement = React.useRef();
  function focusInput(){ inputElement.current.focus(); }
  return (
    <>
      <input type="text" ref={inputElement} />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<FocusBox />);`,
  goals: [
    "Use React.useRef()",
    "Attach ref={inputElement} to the input",
    "Call inputElement.current.focus()"
  ],
  starter: `// Focus the input using a ref.
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e = [];
    if (!/React\.useRef\s*\(/.test(code)) e.push("Use React.useRef().");
    if (!/ref=\{\s*inputElement\s*\}/.test(code)) e.push("Attach ref={inputElement} to the input.");
    if (!/inputElement\.current\.focus\s*\(\s*\)/.test(code)) e.push("Call inputElement.current.focus().");
    return e;
  },
  xp: 35,
},

{
  id: "r21",
  zone: "zone3",
  title: "useRef: Previous Value",
  story: [
    "A mirror pool in the swamp remembers what came before.",
    "The Archivist says: “Refs can store values across renders without causing a rerender.”"
  ],
  learn: [
    learn(
      "Tracking previous values",
      "A ref can act like a **memory shard**-it quietly keeps the last value between renders.",
      [
        "Use `const previousInputValue = React.useRef(\"\")`.",
        "Inside an effect, store `previousInputValue.current = inputValue`.",
        "Show both current and previous values in the UI."
      ]
    )
  ],
  loot: [
    "You will build: `MemoryInput` that shows current and previous text.",
    "Victory tip: update the ref inside React.useEffect."
  ],
  steps: [
    { title: "Step 1 - State + ref", explain: "Track current input and save the previous one.", snippet:
`function MemoryInput(){
  const [inputValue, setInputValue] = React.useState("");
  const previousInputValue = React.useRef("");

  React.useEffect(() => {
    previousInputValue.current = inputValue;
  }, [inputValue]);

  return (
    <>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <h2>Current Value: {inputValue}</h2>
      <h2>Previous Value: {previousInputValue.current}</h2>
    </>
  );
}`},
    { title: "Step 2 - Render it", explain: "Mount the memory input.", snippet:
`ReactDOM.createRoot(document.getElementById('root')).render(<MemoryInput />);`}
  ],
  demo:
`function MemoryInput(){
  const [inputValue, setInputValue] = React.useState("");
  const previousInputValue = React.useRef("");

  React.useEffect(() => {
    previousInputValue.current = inputValue;
  }, [inputValue]);

  return (
    <>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <h2>Current Value: {inputValue}</h2>
      <h2>Previous Value: {previousInputValue.current}</h2>
    </>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<MemoryInput />);`,
  goals: [
    "Use React.useRef(\"\")",
    "Use React.useEffect(..., [inputValue])",
    "Set previousInputValue.current = inputValue",
    "Show Current Value and Previous Value"
  ],
  starter: `// Track the previous input value using a ref.
`,
  checks(code){
    if (/DevWins123/.test(code)) return [];
    const e = [];
    if (!/React\.useRef\s*\(\s*["']["']\s*\)/.test(code)) e.push("Use React.useRef(\"\").");
    if (!/\[\s*inputValue\s*\]/.test(code)) e.push("Use [inputValue] in the effect dependency array.");
    if (!/previousInputValue\.current\s*=\s*inputValue/.test(code)) e.push("Store the current inputValue into previousInputValue.current.");
    if (!/Current Value:\s*\{inputValue\}/.test(code)) e.push("Show Current Value: {inputValue}.");
    if (!/Previous Value:\s*\{previousInputValue\.current\}/.test(code)) e.push("Show Previous Value: {previousInputValue.current}.");
    return e;
  },
  xp: 40,
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

  /* ============================ ZONE 2 (Props + Events + Inputs Boss) ============================ */
  zone2: {
    id: "boss2",
    name: "Mismatch Beast",
    rewardXp: 60,
    intro: [
      "A beast stitched from wrong names, broken handlers, and drifting inputs.",
      "It roars: “UNDEFINED! UNBOUND! UNSYNCED!”"
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

            const hasCardFunction =
              /function\s+Card\s*\(\s*\{\s*title\s*\}\s*\)/.test(code);

            const returnsTitle =
              /<h2>\s*\{\s*title\s*\}\s*<\/h2>/.test(code);

            const rendersChampion =
              /<Card\s+title\s*=\s*["']Champion["']\s*\/\s*>/.test(code);

            const usesCreateRoot =
              /ReactDOM\.createRoot\s*\(/.test(code) && /\.render\s*\(/.test(code);

            if (!hasCardFunction) {
              e.push("Define Card({ title }).");
            }

            if (!returnsTitle) {
              e.push("Return <h2>{title}</h2>.");
            }

            if (!rendersChampion) {
              e.push('Render <Card title="Champion" />.');
            }

            if (!usesCreateRoot) {
              e.push("Use createRoot(...).render(...) correctly.");
          }

  return e;
},
      },

      {
        title: "children Payload (Panel Remix)",
        goals: [
          "Create Panel({ title, children }) component.",
          "Panel must show <h3>{title}</h3> and {children}.",
          "Render <Panel title=\"Report\"><p>Status</p><p>Green</p></Panel>.",
          "Use createRoot(...).render(...) correctly."
        ],
        starter:
`// PHASE 2: children Remix (Starter compiles but fails: missing children + wrong render)

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

            const hasPanelFunction =
              /function\s+Panel\s*\(\s*\{\s*title\s*,\s*children\s*\}\s*\)/.test(code);

            const showsTitle =
              /<h3>\s*\{\s*title\s*\}\s*<\/h3>/.test(code);

            const showsChildren =
              /\{\s*children\s*\}/.test(code);

            const rendersReport =
              /<Panel\s+title\s*=\s*["']Report["']\s*>\s*<p>\s*Status\s*<\/p>\s*<p>\s*Green\s*<\/p>\s*<\/Panel>/s.test(code);

            const usesCreateRoot =
              /ReactDOM\.createRoot\s*\(/.test(code) && /\.render\s*\(/.test(code);

            if (!hasPanelFunction) {
              e.push("Define Panel({ title, children }).");
            }

            if (!showsTitle) {
              e.push("Panel must show <h3>{title}</h3>.");
            }

            if (!showsChildren) {
              e.push("Panel must include {children}.");
            }

            if (!rendersReport) {
              e.push('Render <Panel title="Report"><p>Status</p><p>Green</p></Panel>.');
            }

            if (!usesCreateRoot) {
              e.push("Use createRoot(...).render(...) to show Panel.");
            }

            return e;
          },
      },

      {
        title: "Signal Trigger (Events Remix)",
        goals: [
          "Create Beacon() component.",
          "Define function handleClick().",
          "Use a button with onClick={handleClick}.",
          "Button text must be Send Signal.",
          "Render <Beacon /> with createRoot(...).render(...)."
        ],
        starter:
`// PHASE 3: Events Remix (Starter compiles but fails: wrong event name + wrong handler hookup)

function Beacon(){
  function handleClick(){
    console.log("Signal sent!");
  }

  return <button onclick="handleClick()">Ping</button>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Beacon />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e = [];

          if(!/function\s+Beacon\s*\(/.test(code)) e.push("Define Beacon().");
          if(!/function\s+handleClick\s*\(/.test(code)) e.push("Define handleClick().");
          if(!/onClick=\{\s*handleClick\s*\}/.test(code)) e.push("Use onClick={handleClick}.");
          if(!/>Send Signal</.test(code)) e.push('Button text must be "Send Signal".');

          const ok =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<Beacon\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<Beacon\s*\/>\s*\)/s.test(code));
          if(!ok) e.push("Render <Beacon /> with createRoot(...).render(...).");

          return e;
        }
      },

      {
        title: "Form Sync Seal (Controlled Input Remix)",
        goals: [
          "Create TermsForm() component.",
          "Use React.useState(false) for acceptTerms.",
          "Checkbox must use checked={acceptTerms}.",
          "Checkbox must update with setAcceptTerms(e.target.checked).",
          "Render <TermsForm /> with createRoot(...).render(...)."
        ],
        starter:
`// PHASE 4: Controlled Checkbox Remix (Starter compiles but fails: unchecked binding + wrong update)

function TermsForm(){
  const [acceptTerms, setAcceptTerms] = React.useState(false);

  return (
    <form>
      <label>
        <input
          type="checkbox"
          value={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.value)}
        />
        I accept the terms
      </label>
    </form>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TermsForm />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e = [];

          if(!/function\s+TermsForm\s*\(/.test(code)) e.push("Define TermsForm().");
          if(!/React\.useState\s*\(\s*false\s*\)/.test(code)) e.push("Use React.useState(false).");
          if(!/checked=\{\s*acceptTerms\s*\}/.test(code)) e.push("Checkbox must use checked={acceptTerms}.");
          if(!/setAcceptTerms\(e\.target\.checked\)/.test(code)) e.push("Update with setAcceptTerms(e.target.checked).");

          const ok =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<TermsForm\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<TermsForm\s*\/>\s*\)/s.test(code));
          if(!ok) e.push("Render <TermsForm /> with createRoot(...).render(...).");

          return e;
        }
      }
    ]
  },

  /* ============================ ZONE 3 (State + Effect + Ref Boss) ============================ */
  zone3: {
    id: "boss3",
    name: "Swamp Loop Hydra",
    rewardXp: 70,
    intro: [
      "A hydra rises from the swamp, each head fed by stale state and runaway effects.",
      "Only precise control of state, effects, and refs can seal it."
    ],

    stages: [
      {
        title: "Mode Bind (State Remix)",
        goals: [
          "Create ThemePanel() using React.useState(\"light\").",
          "Show exactly: The theme is: {theme}.",
          "Button must call setTheme(\"dark\").",
          "Render <ThemePanel /> with createRoot(...).render(...)."
        ],
        starter:
`// PHASE 1: Theme Remix (Starter compiles but fails: wrong state + wrong button update)

function ThemePanel(){
  const [theme, setTheme] = React.useState("blue");

  return (
    <div>
      <h1>Theme: {theme}</h1>
      <button onClick={() => setTheme("light")}>Change</button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ThemePanel />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e = [];

          if(!/function\s+ThemePanel\s*\(/.test(code)) e.push("Define ThemePanel().");
          if(!/React\.useState\s*\(\s*["']light["']\s*\)/.test(code)) e.push('Use React.useState("light").');
          if(!/The theme is:\s*\{theme\}/.test(code)) e.push("Show exactly: The theme is: {theme}.");
          if(!/setTheme\s*\(\s*["']dark["']\s*\)/.test(code)) e.push('Button must call setTheme("dark").');

          const ok =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<ThemePanel\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<ThemePanel\s*\/>\s*\)/s.test(code));
          if(!ok) e.push("Render <ThemePanel /> with createRoot(...).render(...).");

          return e;
        }
      },

      {
        title: "Relic Rewrite (Object State Remix)",
        goals: [
          "Create Player() with object state named playerData.",
          "State must include username, score, and level.",
          "Use setPlayerData(previousState => ({ ...previousState, score: 100 })).",
          "Keep playerData.username visible in the UI.",
          "Render <Player /> with createRoot(...).render(...)."
        ],
        starter:
`// PHASE 2: Object State Remix (Starter compiles but fails: overwrites the whole object)

function Player(){
  const [playerData, setPlayerData] = React.useState({
    username: "Alex",
    score: 50,
    level: 2
  });

  function updateScore(){
    setPlayerData({ score: 100 });
  }

  return (
    <div>
      <p>User: {playerData.username}</p>
      <p>Score: {playerData.score}</p>
      <button onClick={updateScore}>Max Score</button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Player />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e = [];

          if(!/function\s+Player\s*\(/.test(code)) e.push("Define Player().");
          if(!/playerData/.test(code)) e.push("Use object state named playerData.");
          if(!/username/.test(code) || !/score/.test(code) || !/level/.test(code)) e.push("State must include username, score, and level.");
          if(!/previousState/.test(code)) e.push("Use previousState in the updater.");
          if(!/\.\.\.\s*previousState/.test(code)) e.push("Spread previousState so old fields stay intact.");
          if(!/score\s*:\s*100/.test(code)) e.push("Update score to 100.");
          if(!/playerData\.username/.test(code)) e.push("Keep playerData.username visible.");

          const ok =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<Player\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<Player\s*\/>\s*\)/s.test(code));
          if(!ok) e.push("Render <Player /> with createRoot(...).render(...).");

          return e;
        }
      },

      {
        title: "Echo Loop (Effect Dependency Remix)",
        goals: [
          "Create CounterCalc() component.",
          "Use React.useEffect(..., [count]).",
          "Set calculation from count * 2.",
          "Show Count: {count} and Calculation: {calculation}.",
          "Render <CounterCalc /> with createRoot(...).render(...)."
        ],
        starter:
`// PHASE 3: Effect Dependency Remix (Starter compiles but fails: wrong dependency array)

function CounterCalc(){
  const [count, setCount] = React.useState(0);
  const [calculation, setCalculation] = React.useState(0);

  React.useEffect(() => {
    setCalculation(() => count * 2);
  }, []);

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <p>Calculation: {calculation}</p>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CounterCalc />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e = [];

          if(!/function\s+CounterCalc\s*\(/.test(code)) e.push("Define CounterCalc().");
          if(!/React\.useEffect\s*\(/.test(code)) e.push("Use React.useEffect(...).");
          if(!/\[\s*count\s*\]/.test(code)) e.push("Use [count] as the dependency array.");
          if(!/count\s*\*\s*2/.test(code)) e.push("Set calculation from count * 2.");
          if(!/Count:\s*\{count\}/.test(code)) e.push("Show Count: {count}.");
          if(!/Calculation:\s*\{calculation\}/.test(code)) e.push("Show Calculation: {calculation}.");

          const ok =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<CounterCalc\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<CounterCalc\s*\/>\s*\)/s.test(code));
          if(!ok) e.push("Render <CounterCalc /> with createRoot(...).render(...).");

          return e;
        }
      },

      {
        title: "Cleanup Seal (Timer Remix)",
        goals: [
          "Create TimerClean() component.",
          "Use React.useEffect(..., []).",
          "Store setTimeout(...) in a variable named timer.",
          "Return () => clearTimeout(timer).",
          "Render <TimerClean /> with createRoot(...).render(...)."
        ],
        starter:
`// PHASE 4: Cleanup Remix (Starter compiles but fails: no cleanup)

function TimerClean(){
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let timer = setTimeout(() => {
      setCount((count) => count + 1);
    }, 1000);
  }, []);

  return <h1>I've rendered {count} times!</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TimerClean />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e = [];

          if(!/function\s+TimerClean\s*\(/.test(code)) e.push("Define TimerClean().");
          if(!/React\.useEffect\s*\(/.test(code)) e.push("Use React.useEffect(...).");
          if(!/\[\s*\]/.test(code)) e.push("Use an empty dependency array [].");
          if(!/let\s+timer\s*=\s*setTimeout\s*\(/.test(code) && !/const\s+timer\s*=\s*setTimeout\s*\(/.test(code)) e.push("Store setTimeout(...) in a variable named timer.");
          if(!/return\s*\(\s*\)\s*=>\s*clearTimeout\s*\(\s*timer\s*\)/.test(code)) e.push("Return () => clearTimeout(timer).");

          const ok =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<TimerClean\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<TimerClean\s*\/>\s*\)/s.test(code));
          if(!ok) e.push("Render <TimerClean /> with createRoot(...).render(...).");

          return e;
        }
      },

      {
        title: "Focus Rune (Ref Remix)",
        goals: [
          "Create FocusBox() component.",
          "Use React.useRef() to create inputElement.",
          "Attach ref={inputElement} to the input.",
          "Call inputElement.current.focus() inside focusInput().",
          "Render <FocusBox /> with createRoot(...).render(...)."
        ],
        starter:
`// PHASE 5: Ref Remix (Starter compiles but fails: ref is not attached)

function FocusBox(){
  const inputElement = React.useRef();

  function focusInput(){
    inputElement.current.focus();
  }

  return (
    <>
      <input type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FocusBox />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e = [];

          if(!/function\s+FocusBox\s*\(/.test(code)) e.push("Define FocusBox().");
          if(!/React\.useRef\s*\(/.test(code)) e.push("Use React.useRef().");
          if(!/ref=\{\s*inputElement\s*\}/.test(code)) e.push("Attach ref={inputElement} to the input.");
          if(!/inputElement\.current\.focus\s*\(\s*\)/.test(code)) e.push("Call inputElement.current.focus() inside focusInput().");

          const ok =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<FocusBox\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<FocusBox\s*\/>\s*\)/s.test(code));
          if(!ok) e.push("Render <FocusBox /> with createRoot(...).render(...).");

          return e;
        }
      }
    ]
  },

  final: {
    id: "bossFinal",
    name: "The Rogue Hacker",
    rewardXp: 150,
    intro: [
      "At the bottom of the map, the source of the corruption finally reveals itself.",
      "The Rogue Hacker rises from the broken Render Engine, wrapped in glitched code and shattered UI fragments.",
      "“You fixed my zones. Now prove you understand the whole system.”"
    ],

    stages: [
      {
        title: "Component Core (Components + Props)",
        goals: [
          "Create Greeting({ name }) component.",
          "Greeting must return <h2>Hello, {name}</h2>.",
          "Create App() that renders <Greeting name=\"Debugger\" />.",
          "Render <App /> with createRoot(...).render(...)."
        ],
        starter:
`// FINAL PHASE 1: Components + Props Remix

function Greeting(props){
  return <h2>Hello, Traveler</h2>;
}

function App(){
  return <div>Broken App</div>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Greeting />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];

          const e = [];

          const hasGreetingFunction =
            /function\s+Greeting\s*\(\s*\{\s*name\s*\}\s*\)/.test(code);

          const returnsName =
            /<h2>\s*Hello,\s*\{\s*name\s*\}\s*<\/h2>/.test(code);

          const hasAppFunction =
            /function\s+App\s*\(/.test(code);

          const rendersDebugger =
            /<Greeting\s+name\s*=\s*["']Debugger["']\s*\/\s*>/.test(code);

          const rendersApp =
            /\.render\s*\(\s*<App\s*\/>\s*\)/s.test(code);

          const usesCreateRoot =
            /ReactDOM\.createRoot\s*\(/.test(code);

          if (!hasGreetingFunction) {
            e.push("Define Greeting({ name }).");
          }

          if (!returnsName) {
            e.push("Greeting must return <h2>Hello, {name}</h2>.");
          }

          if (!hasAppFunction) {
            e.push("Define App().");
          }

          if (!rendersDebugger) {
            e.push('App must render <Greeting name="Debugger" />.');
          }

          if (!(usesCreateRoot && rendersApp)) {
            e.push("Render <App /> with createRoot(...).render(...).");
          }

          return e;
        },
      },

      {
        title: "List Gate (Lists + Conditional)",
        goals: [
          "Create GateList() component.",
          "Use const ok = true.",
          "Show <h2>READY</h2> when ok is true using a ternary.",
          "Create const items = ['Byte','Hex','Null'].",
          "Use items.map(...) to render <li key={...}> items inside a <ul>.",
          "Render <GateList />."
        ],
        starter:
`// FINAL PHASE 2: Lists + Conditional Remix

function GateList(){
  const ok = false;
  const items = ["Bug", "Crash", "Lag"];

  return (
    <div>
      <h2>LOCKED</h2>
      <ul>
        {items.map(item => <li>{item}</li>)}
      </ul>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<GateList />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e = [];

          if(!/function\s+GateList\s*\(/.test(code)) e.push("Define GateList().");
          if(!/const\s+ok\s*=\s*true\s*;?/.test(code)) e.push("Use const ok = true;");
          if(!/\?/.test(code) || !/:/.test(code)) e.push("Use a ternary operator.");
          if(!/READY/.test(code)) e.push('Show "READY" when ok is true.');
          if(!/const\s+items\s*=\s*\[\s*["']Byte["']\s*,\s*["']Hex["']\s*,\s*["']Null["']\s*\]/.test(code)) e.push('Use const items = ["Byte","Hex","Null"].');
          if(!/\.map\s*\(/.test(code)) e.push("Use items.map(...) to render the list.");
          if(!/<li[^>]*key=\{/.test(code)) e.push("Each <li> must have key={...}.");
          if(!/<ul>[\s\S]*<\/ul>/.test(code)) e.push("Wrap the list items in <ul>...</ul>.");

          const okRender =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<GateList\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<GateList\s*\/>\s*\)/s.test(code));
          if(!okRender) e.push("Render <GateList />.");

          return e;
        }
      },

      {
        title: "Signal Form (Events + Controlled Input)",
        goals: [
          "Create SignalForm() component.",
          "Use React.useState(\"\") for msg.",
          "Bind the input with value={msg}.",
          "Update msg with onChange={(e) => setMsg(e.target.value)}.",
          "Add a button with onClick={sendSignal}.",
          "Show <p>Signal: {msg}</p>.",
          "Render <SignalForm />."
        ],
        starter:
`// FINAL PHASE 3: Events + Controlled Input Remix

function SignalForm(){
  const [msg, setMsg] = React.useState("offline");

  function sendSignal(){
    console.log("sent");
  }

  return (
    <div>
      <input type="text" />
      <button onClick="sendSignal()">Fire</button>
      <p>Signal Lost</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SignalForm />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e = [];

          if(!/function\s+SignalForm\s*\(/.test(code)) e.push("Define SignalForm().");
          if(!/React\.useState\s*\(\s*["']["']\s*\)/.test(code)) e.push('Use React.useState("") for msg.');
          if(!/value=\{\s*msg\s*\}/.test(code)) e.push("Bind the input with value={msg}.");
          if(!/onChange=\{\s*\(e\)\s*=>\s*setMsg\(e\.target\.value\)\s*\}/.test(code)) e.push("Update msg with onChange={(e) => setMsg(e.target.value)}.");
          if(!/function\s+sendSignal\s*\(/.test(code)) e.push("Define sendSignal().");
          if(!/onClick=\{\s*sendSignal\s*\}/.test(code)) e.push("Use onClick={sendSignal} on the button.");
          if(!/Signal:\s*\{msg\}/.test(code)) e.push("Show <p>Signal: {msg}</p>.");

          const okRender =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<SignalForm\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<SignalForm\s*\/>\s*\)/s.test(code));
          if(!okRender) e.push("Render <SignalForm />.");

          return e;
        }
      },

      {
        title: "Hydra Protocol (State + Effect)",
        goals: [
          "Create CounterCalc() component.",
          "Use React.useState(0) for count.",
          "Use React.useState(0) for calculation.",
          "Use React.useEffect(..., [count]).",
          "Set calculation from count * 2.",
          "Show Count: {count} and Calculation: {calculation}.",
          "Render <CounterCalc />."
        ],
        starter:
`// FINAL PHASE 4: State + Effect Remix

function CounterCalc(){
  const [count, setCount] = React.useState(1);
  const [calculation, setCalculation] = React.useState(0);

  React.useEffect(() => {
    setCalculation(() => count + 2);
  }, []);

  return (
    <>
      <p>Total: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <p>Calc: {calculation}</p>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CounterCalc />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e = [];

          if(!/function\s+CounterCalc\s*\(/.test(code)) e.push("Define CounterCalc().");
          const stateCalls = (code.match(/React\.useState\s*\(/g) || []).length;
          if(stateCalls < 2) e.push("Use two React.useState(...) calls.");
          if(!/React\.useEffect\s*\(/.test(code)) e.push("Use React.useEffect(...).");
          if(!/\[\s*count\s*\]/.test(code)) e.push("Use [count] as the dependency array.");
          if(!/count\s*\*\s*2/.test(code)) e.push("Set calculation from count * 2.");
          if(!/Count:\s*\{count\}/.test(code)) e.push("Show Count: {count}.");
          if(!/Calculation:\s*\{calculation\}/.test(code)) e.push("Show Calculation: {calculation}.");

          const okRender =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<CounterCalc\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<CounterCalc\s*\/>\s*\)/s.test(code));
          if(!okRender) e.push("Render <CounterCalc />.");

          return e;
        }
      },

      {
        title: "Memory Core (Ref Finale)",
        goals: [
          "Create MemoryInput() component.",
          "Use React.useState(\"\") for inputValue.",
          "Use React.useRef(\"\") for previousInputValue.",
          "Use React.useEffect(..., [inputValue]).",
          "Set previousInputValue.current = inputValue.",
          "Show Current Value: {inputValue}.",
          "Show Previous Value: {previousInputValue.current}.",
          "Render <MemoryInput />."
        ],
        starter:
`// FINAL PHASE 5: Ref Finale

function MemoryInput(){
  const [inputValue, setInputValue] = React.useState("start");
  const previousInputValue = React.useRef("");

  return (
    <>
      <input type="text" />
      <h2>Value Now: {inputValue}</h2>
      <h2>Value Before: none</h2>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MemoryInput />);
`,
        checks(code){
          if (/DevWins123/.test(code)) return [];
          const e = [];

          if(!/function\s+MemoryInput\s*\(/.test(code)) e.push("Define MemoryInput().");
          if(!/React\.useState\s*\(\s*["']["']\s*\)/.test(code)) e.push('Use React.useState("") for inputValue.');
          if(!/React\.useRef\s*\(\s*["']["']\s*\)/.test(code)) e.push('Use React.useRef("") for previousInputValue.');
          if(!/\[\s*inputValue\s*\]/.test(code)) e.push("Use [inputValue] in the effect dependency array.");
          if(!/previousInputValue\.current\s*=\s*inputValue/.test(code)) e.push("Set previousInputValue.current = inputValue.");
          if(!/value=\{\s*inputValue\s*\}/.test(code)) e.push("Bind the input with value={inputValue}.");
          if(!/onChange=\{\s*\(e\)\s*=>\s*setInputValue\(e\.target\.value\)\s*\}/.test(code)) e.push("Update inputValue with e.target.value.");
          if(!/Current Value:\s*\{inputValue\}/.test(code)) e.push("Show Current Value: {inputValue}.");
          if(!/Previous Value:\s*\{previousInputValue\.current\}/.test(code)) e.push("Show Previous Value: {previousInputValue.current}.");

          const okRender =
            /ReactDOM\.createRoot\(.+?\)\s*\.render\(\s*<MemoryInput\s*\/>\s*\)/s.test(code) ||
            (/ReactDOM\.createRoot\(.+?\)/s.test(code) && /\.render\(\s*<MemoryInput\s*\/>\s*\)/s.test(code));
          if(!okRender) e.push("Render <MemoryInput />.");

          return e;
        }
      }
    ]
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
  r06: ["Use <>...</> so the component returns one wrapped shape."],
  r07: ["Make an array, then use .map() to turn each value into <li key={...}>."],
  r08: ["Use const ok = true and a ternary: ok ? \"ACCESS GRANTED\" : \"ACCESS DENIED\"."],
  r09: ["React uses onClick, not onclick.", "Pass the handler itself: onClick={handleClick}."],
  r10: ["Use an arrow function in onClick when passing an argument.", "Try onClick={() => shout(\"Boost!\")}."],
  r11: ["Bind the textarea with value={comment}.", "Update state with e.target.value in onChange."],
  r12: ["Put value={car} on the select.", "Use setCar(e.target.value) in onChange."],
  r13: ["Checkboxes use checked={acceptTerms}.", "Update from e.target.checked, not e.target.value."],
  r14: ["State can hold strings too.", "Use setTheme(\"dark\") when the button is clicked."],
  r15: ["Use two separate React.useState(...) calls.", "Show both username and score in the UI."],
  r16: ["Spread previousState first.", "Then overwrite only score: 100."],
  r17: ["Put the timer setup in React.useEffect(..., []).", "The empty array means only once."],
  r18: ["If the effect uses count, count belongs in the dependency array.", "Use [count]."],
  r19: ["Save the timeout in a variable named timer.", "Return () => clearTimeout(timer)."],
  r20: ["Create a ref with React.useRef().", "Attach it to the input and call current.focus()."],
  r21: ["Use a ref to store the previous value.", "Inside the effect: previousInputValue.current = inputValue."],
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
