const fs = require("fs");
const path = require("path");

const getVersion = () => {
  const packageJson = fs.readFileSync(
    path.join(__dirname, "..", "package.json"),
    "utf-8"
  );
  return JSON.parse(packageJson).version;
};

const data = JSON.stringify({ key: getVersion() });
fs.writeFileSync("./dist/version.json", data, "utf8");
