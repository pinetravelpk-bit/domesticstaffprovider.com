// Sets (or resets) the /admin password. Run on the server from the app folder:
//   node scripts/set-admin-password.mjs            (prompts for the password)
//   echo 'new password' | node scripts/set-admin-password.mjs
// The password itself is never stored, only a scrypt hash. Resetting logs out all sessions.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline';

// Same folder the site uses (lib/content.ts): ../dsp-content next to the app folder.
const dir = process.env.CONTENT_DIR || path.join(process.cwd(), '..', 'dsp-content');

async function readPassword() {
  if (!process.stdin.isTTY) {
    let data = '';
    for await (const chunk of process.stdin) data += chunk;
    return data.replace(/\r?\n$/, '');
  }
  const rl = readline.createInterface({input: process.stdin, output: process.stdout});
  return new Promise(r => rl.question('New admin password (min 10 characters): ', a => {rl.close(); r(a)}));
}

const pw = await readPassword();
if (!pw || pw.length < 10) {console.error('Password must be at least 10 characters.'); process.exit(1)}
const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(pw, salt, 64, {N: 16384, r: 8, p: 1});
fs.mkdirSync(dir, {recursive: true});
fs.writeFileSync(path.join(dir, 'admin.json'), JSON.stringify({passwordHash: `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`, secret: crypto.randomBytes(32).toString('hex')}), {mode: 0o600});
console.log('Admin password set in', dir);
