const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesToDownload = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Vijay_at_the_Nadigar_Sangam_Protest.jpg',
    dest: 'images/vijay.jpg',
    fallback: 'images/welcome.jpg'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Fort_St_George_Chennai.JPG',
    dest: 'images/secretariat.jpg',
    fallback: 'images/welcome.jpg'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Srirangam_temple_gopuram.jpg',
    dest: 'images/gopuram.jpg',
    fallback: 'images/welcome.jpg'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Marina_Beach_Chennai.jpg',
    dest: 'images/marina.jpg',
    fallback: 'images/cleanliness.jpg'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Kapaleeshwarar_Temple_Chennai.jpg',
    dest: 'images/kapaleeshwarar.jpg',
    fallback: 'images/classroom.jpg'
  }
];

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
          console.log(`Downloaded ${url} to ${dest}`);
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
  for (const item of imagesToDownload) {
    const fullDest = path.join(__dirname, item.dest);
    const fullFallback = path.join(__dirname, item.fallback);
    await download(item.url, fullDest, fullFallback);
  }
  console.log('All images processed.');
}

run();
