import { j as jsxRuntimeExports } from "./index-c52ed29b.js";
const NavigationArrow = ({ color, size, width, height, className }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: width || size, height: height || size, className, viewBox: "0 0 19 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 1L2 7L8 13", stroke: `var(${color})`, strokeWidth: "2", strokeLinecap: "round" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 8C18.5523 8 19 7.55228 19 7C19 6.44772 18.5523 6 18 6V8ZM2.5 8H18V6H2.5V8Z", fill: `var(${color})` })
  ] });
};
export {
  NavigationArrow as default
};
