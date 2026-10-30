"""Package Idam CSS and native Vivaldi icon themes from checked-in sources."""
from pathlib import Path
import json
import re
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
# Reuse the browser's Pane-aligned palette so rebuilding cannot drift from CSS.
browser_css = (ROOT.parent/'idam.css').read_text(encoding='utf-8')
pane = dict(re.findall(r'--wp-([\w-]+):\s*([^;]+);', browser_css))
# The checked-in SVG files are the source of truth for both icon variants.
NAMES = ('Back', 'Forward', 'Reload', 'Stop', 'Home', 'PanelBookmarks',
         'PanelDownloads', 'PanelHistory', 'PanelNotes', 'WorkspaceButton')
LABELS = dict(zip(NAMES, ('Back', 'Forward', 'Reload', 'Stop loading', 'Home',
                        'Bookmarks', 'Downloads', 'History', 'Notes', 'Workspaces')))
OUTPUT = ROOT.parent / 'dist'
OUTPUT.mkdir(exist_ok=True)
license_text = (ROOT.parents[1] / 'LICENSE').read_text(encoding='utf-8')
(OUTPUT / 'idam.css').write_text(browser_css, encoding='utf-8')
(OUTPUT / 'LICENSE.txt').write_text(license_text, encoding='utf-8')

base = {
    'engineVersion':1,'version':1,'accentFromPage':False,'accentOnWindow':False,
    'accentSaturationLimit':1,'alpha':1,'backgroundImage':'','backgroundPosition':'stretch',
    'blur':0,'colorAccentBg':pane['background'],'colorBg':pane['surface'],
    'colorFg':pane['foreground'],'colorHighlightBg':pane['accent'],
    'colorWindowBg':pane['background'],'contrast':0,
    'preferSystemAccent':False,'radius':0,'transparencyTabBar':False,
    'transparencyTabs':False,'url':'',
}
ids={'flat':'a9b3a628-33bd-4fba-975d-b0f0abc10001','classic':'a9b3a628-33bd-4fba-975d-b0f0abc10002'}
for variant in ('flat', 'classic'):
    folder = ROOT / variant
    artwork = {}
    for name in NAMES:
        content = (folder / f'{name}.svg').read_text(encoding='utf-8')
        element = ET.fromstring(content)
        assert element.attrib['viewBox'] == '0 0 28 28'
        assert element.attrib['stroke'] == 'currentColor'
        assert all(n.tag.split('}')[-1] in ('svg', 'path', 'circle') for n in element.iter())
        assert not any('id' in n.attrib or 'href' in n.attrib for n in element.iter())
        artwork[f'{name}.svg'] = content
    theme = {**base, 'id': ids[variant], 'name': f'Idam Icons — {variant.title()}',
             'buttons': {name: f'{name}.svg' for name in NAMES}}
    entries = {'settings.json': json.dumps(theme, indent=2) + '\n',
               'LICENSE.txt': license_text, **artwork}
    with ZipFile(OUTPUT / f'idam-icons-{variant}.zip', 'w', ZIP_DEFLATED) as z:
        for name, content in entries.items():
            info = ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            z.writestr(info, content)
    print(f'Validated {variant}: {len(NAMES)} SVGs and archive references')

# Standalone specimen made from the same SVG files installed in Vivaldi.
def toolbar(variant):
    return ''.join(f'<button aria-label="{LABELS[name]}" title="{LABELS[name]}">{(ROOT/variant/(name+".svg")).read_text()}</button>' for name in ['Back','Forward','Reload','Home'])
def panels(variant):
    return ''.join(f'<button aria-label="{LABELS[name]}" title="{LABELS[name]}">{(ROOT/variant/(name+".svg")).read_text()}</button>' for name in ['PanelBookmarks','PanelDownloads','PanelHistory','PanelNotes'])
def specimen(variant):
    return f'''<section><header><h2>Idam {variant}</h2><span>{'Open arrow · recommended' if variant=='flat' else 'Circular Back button'}</span></header><div class="browser"><div class="toolbar">{toolbar(variant)}<div class="url">vivaldi.com</div></div><div class="body"><aside><div class="workspace">{(ROOT/variant/'WorkspaceButton.svg').read_text()} Personal</div><div class="pins"><span>G</span><span>F</span><span>M</span></div><div class="tab active">Design references</div><div class="tab">Project notes</div><div class="tab">Reading list</div><div class="tab">+ New tab</div></aside><div class="content"><small>IDAM FOR VIVALDI</small><h3>Room to browse.</h3><p>Ten icons. One consistent language.</p></div><nav>{panels(variant)}</nav></div></div><div class="icons">{''.join('<div>'+ (ROOT/variant/(name+'.svg')).read_text()+'<span>'+LABELS[name]+'</span></div>' for name in NAMES)}</div></section>'''
html='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>Idam icons · Vivaldi</title><style>
:root{color-scheme:dark;font-family:"Segoe UI","Helvetica Neue",Arial,sans-serif;background:#080809;color:#f5f5f7}*{box-sizing:border-box}body{margin:0;padding:36px 5vw 60px}main{max-width:1300px;margin:auto}h1{font-size:36px;font-weight:300;margin:0 0 10px}p{color:#b5b5bd}section{margin-top:38px}header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px}h2{font-size:22px;font-weight:400;margin:0;text-transform:lowercase}header span{color:#a9a9b4;font-size:13px}.browser{border:1px solid #343438;background:#101012}.toolbar{display:flex;align-items:center;padding:6px 12px;gap:6px;border-bottom:1px solid #303034}.toolbar button,nav button{width:36px;height:36px;padding:4px;border:0;background:transparent;color:inherit;display:grid;place-items:center}.toolbar button:hover,nav button:hover{background:#28282f}.toolbar button:focus-visible,nav button:focus-visible{outline:2px solid #62b7ff}.url{margin-left:10px;flex:1;border:1px solid #303034;background:#080809;padding:8px 12px;color:#b5b5bd;font-size:12px}.body{display:grid;grid-template-columns:225px 1fr 44px;min-height:245px}aside{padding:12px 8px;border-right:1px solid #303034}.workspace{display:flex;align-items:center;gap:6px;font-size:13px;margin-bottom:12px}.pins{display:flex;gap:6px;margin:0 4px 16px}.pins span{background:#242428;border:1px solid #303034;flex:1;padding:12px;text-align:center;font-size:13px}.tab{font-size:12px;padding:10px;color:#b5b5bd}.tab.active{background:#0d293e;color:#fff}.content{padding:43px 35px;background:#080809}.content small{color:#62b7ff;font-size:10px;letter-spacing:2px}.content h3{font-size:31px;font-weight:300;margin:18px 0}.content p{font-size:13px}nav{padding-top:6px;border-left:1px solid #303034}.icons{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));margin-top:14px;background:#151518;padding:16px 10px;gap:8px}.icons>div{display:flex;flex-direction:column;align-items:center;gap:9px}.icons span{font-size:11px;color:#b5b5bd;text-align:center}svg{width:28px;height:28px;flex:none}.intro{max-width:700px;font-size:14px;line-height:1.6}.foot{margin-top:24px;font-size:12px;color:#9696a3}@media(max-width:700px){body{padding:24px 18px}.body{grid-template-columns:155px 1fr 38px}.content{padding:30px 16px}.content h3{font-size:24px}.icons{grid-template-columns:repeat(5,1fr);row-gap:20px}header{align-items:start;flex-direction:column;gap:5px}}
</style><main><h1>idam icons.</h1><p class="intro">Idam browser icons · Flat glyphs with square terminals, consistent weight, and generous padding. Both options use the same ten SVG files as their importable Vivaldi theme.</p>'''+specimen('flat')+specimen('classic')+'''<p class="foot">Icon preview. Website favicons remain unchanged.</p></main></html>'''
# Match the specimen to the CSS palette; this is still a layout illustration.
palette = {
    '#080809':pane['background'], '#101012':pane['background'],
    '#f5f5f7':pane['foreground'], '#b5b5bd':pane['muted'],
    '#a9a9b4':pane['muted'], '#9696a3':pane['muted'],
    '#343438':pane['border'], '#303034':pane['border'],
    '#242428':pane['surface'], '#151518':pane['surface'],
    '#28282f':f"color-mix(in srgb, {pane['foreground']} 10%, {pane['surface']})",
    '#0d293e':pane['accent'],
    '#0078d7':pane['accent-text'], '#62b7ff':pane['accent-text'],
}
html = re.sub('|'.join(map(re.escape, palette)), lambda match: palette[match.group()], html)
html=html.replace('.tab{font-size:12px', '.tab{font-size:13px')
html=html.replace('.pins span{background:', '.pins span{border-radius:6px;background:')
html=html.replace('Idam browser icons ·', 'Pane-aligned browser chrome ·')
# Use the same Idam artwork as the extension for the specimen branding.
brand_svg=(ROOT.parents[1]/'extension'/'public'/'icon.svg').read_text(encoding='utf-8')
html=html.replace('<h1>idam icons.</h1>', '<h1 class="brand">'+brand_svg+'<span>idam icons.</span></h1>')
html=html.replace('</style>', '.brand{display:flex;align-items:center;gap:16px}.brand>svg{width:48px;height:48px;flex:none}</style>')
(OUTPUT/'icons.html').write_text(html,encoding='utf-8')
