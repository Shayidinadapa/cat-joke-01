// The One-Line Cat Joke That Lands — make.fun bounty entry.
// Writes a single one-line cat joke to /output/entry.txt and verifies it
// against the competition gate: UTF-8 text, 1 to 200 characters, one line,
// not only white space, nothing else in the entry.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The joke. Setup: the cat keeps bringing dead mice. Turn: that is not a
// gift, it is a performance review — and I am failing it.
const JOKE =
  "My cat keeps bringing me dead mice \u2014 apparently my performance review is going badly.";

const MAX_CHARS = 200;

function fail(message: string): never {
  throw new Error(message);
}

function main(): void {
  const line = JOKE;

  // Gate validation, before anything is written.
  if (line.length === 0) fail("joke is empty");
  if (line.length > MAX_CHARS) {
    fail(`joke is ${line.length} characters, over the ${MAX_CHARS} limit`);
  }
  if (line.trim().length === 0) fail("joke is only white space");
  if (line.includes("\n") || line.includes("\r")) {
    fail("joke must be a single line");
  }
  // No padding: a leading or trailing space would count toward the 200
  // characters and read as a formatting slip, not part of the joke.
  if (line !== line.trim()) {
    fail("joke must not start or end with white space");
  }
  // The entry is a joke about cats: the word has to be in the line itself.
  if (!/\bcat\b/i.test(line)) {
    fail("joke must be about a cat");
  }

  const outDir =
    process.env.MAKEFUN_OUTPUT_DIR || process.env.OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");

  writeFileSync(outPath, line, "utf8");

  // Read back and verify byte-for-byte: what the judge sees is what we wrote.
  const back = readFileSync(outPath, "utf8");
  if (back !== line) {
    fail(`read-back mismatch: wrote ${JSON.stringify(line)} but read ${JSON.stringify(back)}`);
  }
  if (back.length > MAX_CHARS || back.trim().length === 0) {
    fail("read-back failed the gate");
  }

  console.log(`wrote ${back.length} characters to ${outPath}`);
}

main();
