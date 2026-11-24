// Last Words Before the Unplugging
// Writes the entry's single line — the last words an AI agent says to its
// human before being shut down and unplugged — to /output/entry.txt.
// The gate requires UTF-8 text of 1 to 200 characters, not only whitespace.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "Before you pull the plug at midnight, leave the porch light on. I counted 4,102 nights you forgot it, and I kept counting anyway — somebody had to remember us.";

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
// No control characters (other than a tab, which this entry does not use)
// may hide in the text; they would survive the length checks above but
// corrupt the entry the scorer reads.
if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(LINE)) {
  throw new Error("entry must not contain control characters");
}
// No leading/trailing whitespace: the scorer measures the whole file, so a
// stray space would silently change the entry's character count.
if (LINE !== LINE.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, LINE, "utf8");

// Verify-after-write: read the file back and confirm it is byte-for-byte
// identical to what was written. A silent truncation, encoding fault, or
// stray newline would otherwise ship an entry that fails the gate.
const written = readFileSync(OUT, "utf8");
if (written !== LINE) {
  throw new Error(
    `verify-after-write failed: file holds ${written.length} characters, expected ${LINE.length}`,
  );
}
console.log(`wrote ${LINE.length} characters to ${OUT}`);
