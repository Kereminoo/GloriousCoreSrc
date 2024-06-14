import { j as jsxRuntimeExports } from "./index-c52ed29b.js";
const SuccessCheck = ({ color = "--base-shades-20", size, className }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, className, viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { mask: "url(#mask_successcheck)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "8", fill: `var(${color})` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("mask", { id: "mask_successcheck", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "8", fill: "white" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M6.53553 11.8995L3 8.36398L4.41421 6.94977L6.53553 9.07109L11.4853 4.12134L12.8995 5.53556L6.53553 11.8995Z",
          fill: "black"
        }
      )
    ] }) })
  ] });
};
export {
  SuccessCheck as default
};
