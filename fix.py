import glob
for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    if '<script src="./content-loader.js"></script>' in content:
        content = content.replace('<script src="./content-loader.js"></script>', '<script type="module" src="./content-loader.js"></script>')
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")
