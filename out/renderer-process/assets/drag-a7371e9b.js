import { j as jsxRuntimeExports } from "./index-c52ed29b.js";
const Drag = ({ color, size, width = "12", height = "20", className }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: width || size, height: height || size, className, viewBox: "0 0 12 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "2", cy: "18", r: "2", fill: `var(${color})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "10", cy: "18", r: "2", fill: `var(${color})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "2", cy: "2", r: "2", fill: `var(${color})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "10", cy: "2", r: "2", fill: `var(${color})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "2", cy: "10", r: "2", fill: `var(${color})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "10", cy: "10", r: "2", fill: `var(${color})` })
  ] });
};
export {
  Drag as default
};
