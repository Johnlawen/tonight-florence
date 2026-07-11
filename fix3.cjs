const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('<script type="module" src="./content-loader.js"></script>')) {
        content = content.replace('<script type="module" src="./content-loader.js"></script>', '<script src="./content-loader.js"></script>');
        fs.writeFileSync(f, content, 'utf8');
        console.log('Updated ' + f);
    }
});
