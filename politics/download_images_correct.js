const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const files = [
  { name: 'Vijay at the Nadigar Sangam Protest.jpg', dest: 'images/vijay.jpg', fallback: 'images/welcome.jpg' },
  { name: 'Fort St George Chennai.JPG', dest: 'images/secretariat.jpg', fallback: 'images/welcome.jpg' },
  { name: 'Srirangam temple gopuram.jpg', dest: 'images/gopuram.jpg', fallback: 'images/welcome.jpg' },
  { name: 'Marina Beach Chennai.jpg', dest: 'images/marina.jpg', fallback: 'images/cleanliness.jpg' },
  { name: 'Kapaleeshwarar Temple Chennai.jpg', dest: 'images/kapaleeshwarar.jpg', fallback: 'images/classroom.jpg' }
];

function getWikimediaUrl(filename) {
  const cleanName = filename.replace(/ /g, '_');
  const hash = crypto.createHash('md5').update(cleanName).digest('hex');
  const d1 = hash[0];
  const d2 = hash.substring(0, 2);
  return `https://upload.wikimedia.org/wikipedia/commons/${d1}/${d2}/${cleanName}`;
}

function download(url, dest, fallback) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${url} -> ${dest}`);
          resolve(true);
        });
      } else {
        file.close();
        fs.unlink(dest, () => {});
        console.log(`Failed to download ${url}, status: ${response.statusCode}. Using fallback: ${fallback}`);
        try {
          fs.copyFileSync(fallback, dest);
        } catch(e) {}
        resolve(false);
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      console.log(`Error downloading ${url}: ${err.message}. Using fallback: ${fallback}`);
      try {
        fs.copyFileSync(fallback, dest);
      } catch(e) {}
      resolve(false);
    });
  });
}

async function run() {
  for (const item of files) {
    const url = getWikimediaUrl(item.name);
    const fullDest = path.join(__dirname, item.dest);
    const fullFallback = path.join(__dirname, item.fallback);
    await download(url, fullDest, fullFallback);
  }
  console.log('Finished downloading files.');
}

run();
