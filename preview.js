// Global Preview component (no imports)
function Preview({ code }) {
  const html = `<!doctype html><html><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>body{font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;padding:12px}</style>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head><body><div id="root"></div><script type="text/babel">
${code}
</script></body></html>`;
  return React.createElement("iframe", {
    title: "preview",
    sandbox: "allow-scripts",
    srcDoc: html,
    style: { width: "100%", height: 260, border: "1px solid #2e3440", borderRadius: 8, background: "#fff" }
  });
}
window.Preview = Preview;
