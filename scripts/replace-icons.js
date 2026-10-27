const fs = require('fs');
const path = require('path');

const logoSource = path.join(__dirname, '..', 'public', 'images', 'logo.png');

// Copy logo.png to Next.js metadata icons
fs.copyFileSync(logoSource, path.join(__dirname, '..', 'src', 'app', 'icon.png'));
fs.copyFileSync(logoSource, path.join(__dirname, '..', 'src', 'app', 'apple-icon.png'));
fs.copyFileSync(logoSource, path.join(__dirname, '..', 'src', 'app', 'opengraph-image.png'));
fs.copyFileSync(logoSource, path.join(__dirname, '..', 'src', 'app', 'twitter-image.png'));
fs.copyFileSync(logoSource, path.join(__dirname, '..', 'public', 'favicon.ico'));

console.log('Successfully replaced all icon.png, apple-icon.png, opengraph-image.png, twitter-image.png and favicon.ico with Harmonie logo.png!');
