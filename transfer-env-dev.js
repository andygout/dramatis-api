const fs = require('node:fs');

fs.createReadStream('.env-dev').pipe(fs.createWriteStream('.env'));
