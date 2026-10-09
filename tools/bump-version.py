#!/usr/bin/env python3
"""Run before every release:  python3 tools/bump-version.py
Hashes all game files, stamps the new version into sw.js and version.json, and lists the
files the service worker should cache. Players with the old version then get the update banner."""
import hashlib, json, os, re, time
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
skip = {'sw.js', 'version.json'}
files = []
for d, _, fs in os.walk(root):
    if any(p in d for p in ('/tools', '/.git')): continue
    for f in fs:
        p = os.path.relpath(os.path.join(d, f), root).replace(os.sep, '/')
        if p in skip or p.endswith(('.md', '.zip')): continue
        files.append(p)
files.sort()
h = hashlib.sha1()
for p in files: h.update(p.encode()); h.update(open(os.path.join(root, p), 'rb').read())
version = time.strftime('%Y.%m.%d') + '-' + h.hexdigest()[:7]
sw = open(os.path.join(root, 'sw.js'), encoding='utf-8').read()
sw = re.sub(r"const VERSION = '.*?';", f"const VERSION = '{version}';", sw)
assets = ['./'] + files
sw = re.sub(r"const ASSETS = \[.*?\];.*", "const ASSETS = " + json.dumps(assets) + ";", sw, count=1)
open(os.path.join(root, 'sw.js'), 'w', encoding='utf-8').write(sw)
vp = os.path.join(root, 'version.json')
try: build = json.load(open(vp)).get('build', 0) + 1
except Exception: build = 1
json.dump({'version': version, 'build': build}, open(vp, 'w'))
print('build number', build, '- name your GitHub Release / tag with this number, e.g. "build %d"' % build)
print('version', version, '-', len(files), 'files cached')
