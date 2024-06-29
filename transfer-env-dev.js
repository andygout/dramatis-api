import fs from 'node:fs';

fs.createReadStream('.env-dev').pipe(fs.createWriteStream('.env'));
