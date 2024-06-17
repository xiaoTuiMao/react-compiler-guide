import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=55e44835"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react_compilerRuntime from "/node_modules/.vite/deps/react_compiler-runtime.js?v=55e44835"; const _c = __vite__cjsImport1_react_compilerRuntime["c"];
import __vite__cjsImport2_react from "/node_modules/.vite/deps/react.js?v=55e44835"; const useState = __vite__cjsImport2_react["useState"];
import Link from "/src/components/Link/index.tsx";
import "/src/App.css";
const linkList = [{
  id: 1,
  linkInfo: {
    text: "这是链接1",
    address: "https://www.baidu.com/1"
  }
}, {
  id: 2,
  linkInfo: {
    text: "这是链接2",
    address: "https://www.baidu.com/2"
  }
}];
function App() {
  const $ = _c(20);
  if ($[0] !== "d99bef89594b9ef4785d261b00ce5606e8ef1815d2b840e117894b8dfcf26e19") {
    for (let $i = 0; $i < 20; $i += 1) {
      $[$i] = Symbol.for("react.memo_cache_sentinel");
    }
    $[0] = "d99bef89594b9ef4785d261b00ce5606e8ef1815d2b840e117894b8dfcf26e19";
  }
  console.log("APP render");
  const [linkId, setLinkId] = useState(1);
  let t0;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = Math.random();
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const [random, setRandom] = useState(t0);
  let t1;
  if ($[2] !== linkId) {
    t1 = linkList.find((item) => item.id === linkId)?.linkInfo;
    $[2] = linkId;
    $[3] = t1;
  } else {
    t1 = $[3];
  }
  const linkInfo = t1;
  let t2;
  if ($[4] !== linkId) {
    t2 = () => {
      setLinkId(linkId === 1 ? 2 : 1);
    };
    $[4] = linkId;
    $[5] = t2;
  } else {
    t2 = $[5];
  }
  let t3;
  if ($[6] !== t2 || $[7] !== linkId) {
    t3 = /* @__PURE__ */ jsxDEV("div", { id: "text1", onClick: t2, children: [
      "当前 linkId 为：",
      linkId
    ] }, void 0, true, {
      fileName: "/Users/pengrongshu/github-demo/react-com/src/App.tsx",
      lineNumber: 57,
      columnNumber: 10
    }, this);
    $[6] = t2;
    $[7] = linkId;
    $[8] = t3;
  } else {
    t3 = $[8];
  }
  let t4;
  if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = (link) => {
      console.log("====", link);
    };
    $[9] = t4;
  } else {
    t4 = $[9];
  }
  let t5;
  if ($[10] !== linkInfo) {
    t5 = /* @__PURE__ */ jsxDEV(Link, { linkInfo, onLinkClick: t4 }, void 0, false, {
      fileName: "/Users/pengrongshu/github-demo/react-com/src/App.tsx",
      lineNumber: 75,
      columnNumber: 10
    }, this);
    $[10] = linkInfo;
    $[11] = t5;
  } else {
    t5 = $[11];
  }
  let t6;
  if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = () => {
      setRandom(Math.random());
    };
    $[12] = t6;
  } else {
    t6 = $[12];
  }
  let t7;
  if ($[13] !== random) {
    t7 = /* @__PURE__ */ jsxDEV("div", { id: "text2", onClick: t6, children: [
      "这是一个随机数：",
      random
    ] }, void 0, true, {
      fileName: "/Users/pengrongshu/github-demo/react-com/src/App.tsx",
      lineNumber: 92,
      columnNumber: 10
    }, this);
    $[13] = random;
    $[14] = t7;
  } else {
    t7 = $[14];
  }
  let t8;
  if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = /* @__PURE__ */ jsxDEV("div", { id: "text3", children: "这是一段关于 link Id 的介绍" }, void 0, false, {
      fileName: "/Users/pengrongshu/github-demo/react-com/src/App.tsx",
      lineNumber: 100,
      columnNumber: 10
    }, this);
    $[15] = t8;
  } else {
    t8 = $[15];
  }
  let t9;
  if ($[16] !== t3 || $[17] !== t5 || $[18] !== t7) {
    t9 = /* @__PURE__ */ jsxDEV("div", { id: "container", children: [
      t3,
      t5,
      t7,
      t8
    ] }, void 0, true, {
      fileName: "/Users/pengrongshu/github-demo/react-com/src/App.tsx",
      lineNumber: 107,
      columnNumber: 10
    }, this);
    $[16] = t3;
    $[17] = t5;
    $[18] = t7;
    $[19] = t9;
  } else {
    t9 = $[19];
  }
  return t9;
}
export default App;
