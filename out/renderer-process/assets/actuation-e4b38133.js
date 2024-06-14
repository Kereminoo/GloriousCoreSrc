import { j as jsxRuntimeExports } from "./index-c52ed29b.js";
const Actuation = ({ color, size, className }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: size, height: size, className, viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: "url(#clip0_35_1075)", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M18.75 0H1.25C0.55957 0 0 0.55957 0 1.25V18.75C0 19.4404 0.55957 20 1.25 20H18.75C19.4404 20 20 19.4404 20 18.75V1.25C20 0.55957 19.4404 0 18.75 0ZM18.75 18.75H1.25V1.25H18.75V18.75Z",
          fill: `var(${color})`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: "M10.625 3.125H9.375V9.375H3.125V10.625H9.375V16.875H10.625V10.625H16.875V9.375H10.625V3.125Z",
          fill: `var(${color})`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: "clip0_35_1075", children: /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "20", height: "20", fill: "white" }) }) })
  ] });
};
export {
  Actuation as default
};
