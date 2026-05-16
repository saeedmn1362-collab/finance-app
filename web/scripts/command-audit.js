const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(
  process.cwd(),
  "src"
);

function scanFiles(dir, callback) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);

    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      scanFiles(full, callback);
    } else {
      callback(full);
    }
  }
}

const issues = [];

const commandMenuFiles = [];

const hookFiles = [];

const providerFiles = [];

const duplicateIds = new Map();

// ─────────────────────────────────────────────────────────────
// SCAN
// ─────────────────────────────────────────────────────────────

scanFiles(ROOT, (file) => {
  if (
    !file.endsWith(".ts") &&
    !file.endsWith(".tsx")
  ) {
    return;
  }

  const content = fs.readFileSync(
    file,
    "utf8"
  );

  // ─────────────────────────────
  // OLD commandMenu
  // ─────────────────────────────

  if (file.endsWith("commandMenu.ts")) {
    commandMenuFiles.push(file);

    issues.push({
      file,
      msg:
        "❌ legacy commandMenu.ts still exists",
    });
  }

  // ─────────────────────────────
  // PROVIDERS
  // ─────────────────────────────

  if (
    content.includes(
      "CommandRegistryProvider"
    )
  ) {
    providerFiles.push(file);
  }

  // ─────────────────────────────
  // useRegisterCommands
  // ─────────────────────────────

  if (
    content.includes("useRegisterCommands")
  ) {
    hookFiles.push(file);

    // detect inline arrays
    const inlineArray =
      content.includes(
        "useRegisterCommands(["
      ) ||
      content.includes(
        "useRegisterCommands([{"
      );

    if (inlineArray) {
      issues.push({
        file,
        msg:
          "❌ useRegisterCommands used with inline array (missing useMemo)",
      });
    }
  }

  // ─────────────────────────────
  // DUPLICATE COMMAND IDs
  // ─────────────────────────────

  const regex = /id:\s*["'`](.*?)["'`]/g;

  let match;

  while ((match = regex.exec(content))) {
    const id = match[1];

    if (!duplicateIds.has(id)) {
      duplicateIds.set(id, []);
    }

    duplicateIds.get(id).push(file);
  }
});

// ─────────────────────────────────────────────────────────────
// DUPLICATE REPORT
// ─────────────────────────────────────────────────────────────

for (const [id, files] of duplicateIds) {
  if (files.length > 1) {
    issues.push({
      file: id,
      msg: `❌ duplicate command id detected in:\n${files.join(
        "\n"
      )}`,
    });
  }
}

// ─────────────────────────────────────────────────────────────
// OUTPUT
// ─────────────────────────────────────────────────────────────

console.log(
  "\n🧠 COMMAND OS AUDIT REPORT\n"
);

console.log(
  "────────────────────────────"
);

console.log("📌 commandMenu usage:");

if (commandMenuFiles.length === 0) {
  console.log(" ✔ none");
} else {
  commandMenuFiles.forEach((f) =>
    console.log(" - " + f)
  );
}

console.log(
  "\n────────────────────────────"
);

console.log("📌 registry hooks:");

hookFiles.forEach((f) =>
  console.log(" - " + f)
);

console.log(
  "\n────────────────────────────"
);

console.log("📌 providers:");

providerFiles.forEach((f) =>
  console.log(" - " + f)
);

console.log(
  "\n────────────────────────────"
);

console.log("⚠ issues:");

if (issues.length === 0) {
  console.log(" ✔ No issues found");
} else {
  issues.forEach((i) => {
    console.log(
      ` - ${i.file}\n   ${i.msg}`
    );
  });
}

console.log(
  "\n────────────────────────────\n"
);