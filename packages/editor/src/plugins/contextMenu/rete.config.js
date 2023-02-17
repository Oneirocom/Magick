import sass from "rollup-plugin-sass";

export default {
  input: "src/index.js",
  name: "ContextMenuPlugin",
  globals: {
    lodash: "_",
    react: "React",
    "react-dom": "ReactDOM",
  },
  extensions: [".js", ".jsx"],
  babelPresets: [require("@babel/preset-react")],
  plugins: [
    sass({
      insert: true,
    }),
  ],
};
