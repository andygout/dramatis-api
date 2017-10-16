const fs = require('fs');

fs.createReadStream('.env-dev').pipe(fs.createWriteStream('.env'));
