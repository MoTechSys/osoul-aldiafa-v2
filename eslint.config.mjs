// ESLint 9 flat config — Next 16 dropped `next lint`, eslint-config-next now
// ships native flat configs (core-web-vitals already includes the base config).
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  {
    // P0-2 حارس انحدار: يمنع إخفاء المحتوى خلف JS.
    // حالة أولية `initial={{ opacity: 0 }}` أو `0.001` تُرسَم مخفية فعليًا في
    // HTML الخادم حتى يعمل JS — ضارّ بالـ SEO/LCP (motion يسلسل initial داخل
    // style في SSR). النمط المعتمد (قرار P0-2): فوق الطية = CSS @keyframes
    // بحالة نهائية مرئية؛ تحت الطية = initial={false} + whileInView كمصفوفة،
    // أو initial={{ opacity: 1, ... }}. لا opacity=0/0.001 بأي حال.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          // opacity: 0 صراحةً
          selector:
            "JSXAttribute[name.name='initial'] ObjectExpression > Property[key.name='opacity'][value.value=0]",
          message:
            "لا تُخفِ المحتوى بـ initial={{ opacity: 0 }} — يُرسَم مخفيًا في SSR ويضرّ SEO/LCP. فوق الطية استخدم CSS @keyframes، وتحتها initial={false}+whileInView.",
        },
        {
          // opacity: 0.001 (مخفي فعليًا في SSR رغم أنه ليس صفرًا حرفيًا)
          selector:
            "JSXAttribute[name.name='initial'] ObjectExpression > Property[key.name='opacity'][value.value=0.001]",
          message:
            "لا تُخفِ المحتوى بـ initial={{ opacity: 0.001 }} — motion يسلسله مخفيًا في SSR. فوق الطية استخدم CSS @keyframes، وتحتها initial={false}+whileInView.",
        },
      ],
    },
  },
];

export default eslintConfig;
