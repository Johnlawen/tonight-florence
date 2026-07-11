const fs = require('fs');
let content = fs.readFileSync('content-loader.js', 'utf8');
content = content.replace('})();', `}

if (typeof window.supabase === 'undefined') {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    s.onload = initApp;
    document.head.appendChild(s);
} else {
    initApp();
}`);
fs.writeFileSync('content-loader.js', content, 'utf8');
console.log('updated content-loader.js');
