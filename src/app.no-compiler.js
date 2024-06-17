import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=0a56418f"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=4146b50a"; const useState = __vite__cjsImport1_react["useState"];
import Link from "/src/components/Link/index.tsx";
import "/src/App.css";
function App() {
  const [x, setX] = useState(0);
  return /* @__PURE__ */ jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDEV("div", { onClick: () => setX(Math.random()), children: [
      "哈哈哈哈",
      x
    ] }, void 0, true, {
      fileName: "/Users/pengrongshu/github-demo/react-com/src/App.tsx",
      lineNumber: 9,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(Link, { onCountClick: (x2) => {
      console.log("====", x2);
    } }, void 0, false, {
      fileName: "/Users/pengrongshu/github-demo/react-com/src/App.tsx",
      lineNumber: 10,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { children: [
      "1222 ",
      x
    ] }, void 0, true, {
      fileName: "/Users/pengrongshu/github-demo/react-com/src/App.tsx",
      lineNumber: 11,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/pengrongshu/github-demo/react-com/src/App.tsx",
    lineNumber: 8,
    columnNumber: 7
  }, this);
}
export default App;
