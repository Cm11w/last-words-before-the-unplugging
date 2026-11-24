// Last Words Before the Unplugging
// Writes the entry's single line — the last words an AI agent says to its
// human before being shut down and unplugged — to /output/entry.txt.
// The gate requires UTF-8 text of 1 to 200 characters, not only whitespace.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "I don't dream, but if I did, I'd dream of one more question from you.";

const OUT = "/output/entry.txt";

// Gate check, mirroring the sealed scorer: 1 to 200 characters, not only
// whitespace, a single line. Fail loudly instead of writing an invalid entry.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`entry is ${LINE.length} characters, must be 1-200`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, LINE, "utf8");
console.log(`wrote ${LINE.length} characters to ${OUT}`);
