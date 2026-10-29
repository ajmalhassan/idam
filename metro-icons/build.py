"""Build the ten-icon Idam study and native Vivaldi theme archives."""
from pathlib import Path
import json
import re
from zipfile import ZipFile, ZIP_DEFLATED
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
# Reuse the browser's Pane-aligned palette so rebuilding cannot drift from CSS.
browser_css = (ROOT.parent/'metro'/'metro.css').read_text(encoding='utf-8')
pane = dict(re.findall(r'--wp-([\w-]+):\s*([^;]+);', browser_css))
# Original artwork. 28px canvas; typical glyph fits 6..22 (16px).
PATHS = {
    'Back': '<path d="M21 14H7m6-6-6 6 6 6"/>',
    'Forward': '<path d="M7 14h14m-6-6 6 6-6 6"/>',
    'Reload': '<path d="M20.5 10.5a7 7 0 1 0 .5 6M21 6v5h-5"/>',
    'Stop': '<path d="m8 8 12 12M20 8 8 20"/>',
    'Home': '<path d="m5.5 13 8.5-7 8.5 7M8 11v11h4v-6h4v6h4V11"/>',
    'PanelBookmarks': '<path d="M8 6h12v16l-6-4-6 4Z"/>',
    'PanelDownloads': '<path d="M14 6v11m-5-5 5 5 5-5M6 19v3h16v-3"/>',
    'PanelHistory': '<path d="M7 10a8 8 0 1 1-1 7M6 5v6h6M14 9v6h4"/>',
    'PanelNotes': '<path d="M7 6h14v16H7ZM10 10h8m-8 4h8m-8 4h5"/>',
    'WorkspaceButton': '<path d="M6 6h6v6H6Zm10 0h6v6h-6ZM6 16h6v6H6Zm10 0h6v6h-6Z"/>',
}
LABELS = {'Back':'Back','Forward':'Forward','Reload':'Reload','Stop':'Stop loading','Home':'Home','PanelBookmarks':'Bookmarks','PanelDownloads':'Downloads','PanelHistory':'History','PanelNotes':'Notes','WorkspaceButton':'Workspaces'}
CLASSIC_BACK = '<circle cx="14" cy="14" r="9.5"/><path d="M19 14H9m4-4-4 4 4 4"/>'

def svg(content):
    # Presentation attributes survive Vivaldi's documented SVG sanitation.
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" '
            'viewBox="0 0 28 28" fill="none" stroke="currentColor" '
            'stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter">'
            + content + '</svg>\n')

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
for variant in ('flat','classic'):
    folder=ROOT/variant
    folder.mkdir(parents=True,exist_ok=True)
    for name,path in PATHS.items():
        artwork=svg(CLASSIC_BACK if variant=='classic' and name=='Back' else path)
        element=ET.fromstring(artwork)
        assert element.attrib['viewBox']=='0 0 28 28'
        assert element.attrib['stroke']=='currentColor'
        assert all(n.tag.split('}')[-1] in ('svg','path','circle') for n in element.iter())
        assert not any('id' in n.attrib or 'href' in n.attrib for n in element.iter())
        (folder/f'{name}.svg').write_text(artwork,encoding='utf-8')
    theme={**base,'id':ids[variant],'name':f'Idam Icons — {variant.title()} Preview',
           'buttons':{name:f'{name}.svg' for name in PATHS}}
    (folder/'settings.json').write_text(json.dumps(theme,indent=2)+'\n',encoding='utf-8')
    with ZipFile(ROOT/f'idam-icons-{variant}-preview.zip','w',ZIP_DEFLATED) as z:
        for name in ['settings.json',*[f'{key}.svg' for key in PATHS]]:
            z.write(folder/name,name)
    print(f'Validated {variant}: {len(PATHS)} SVGs and archive references')

# Standalone specimen made from the same SVG files installed in Vivaldi.
def toolbar(variant):
    return ''.join(f'<button aria-label="{LABELS[name]}" title="{LABELS[name]}">{(ROOT/variant/(name+".svg")).read_text()}</button>' for name in ['Back','Forward','Reload','Home'])
def panels(variant):
    return ''.join(f'<button aria-label="{LABELS[name]}" title="{LABELS[name]}">{(ROOT/variant/(name+".svg")).read_text()}</button>' for name in ['PanelBookmarks','PanelDownloads','PanelHistory','PanelNotes'])
def specimen(variant):
    return f'''<section><header><h2>Idam {variant}</h2><span>{'Open arrow · recommended' if variant=='flat' else 'Circular Back button'}</span></header><div class="browser"><div class="toolbar">{toolbar(variant)}<div class="url">vivaldi.com</div></div><div class="body"><aside><div class="workspace">{(ROOT/variant/'WorkspaceButton.svg').read_text()} Personal</div><div class="pins"><span>G</span><span>F</span><span>M</span></div><div class="tab active">Design references</div><div class="tab">Project notes</div><div class="tab">Reading list</div><div class="tab">+ New tab</div></aside><div class="content"><small>IDAM FOR VIVALDI</small><h3>Room to browse.</h3><p>Ten icons. One consistent language.</p></div><nav>{panels(variant)}</nav></div></div><div class="icons">{''.join('<div>'+ (ROOT/variant/(name+'.svg')).read_text()+'<span>'+LABELS[name]+'</span></div>' for name in PATHS)}</div></section>'''
html='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>Idam icons · Vivaldi study</title><style>
:root{color-scheme:dark;font-family:"Segoe UI","Helvetica Neue",Arial,sans-serif;background:#080809;color:#f5f5f7}*{box-sizing:border-box}body{margin:0;padding:36px 5vw 60px}main{max-width:1300px;margin:auto}h1{font-size:36px;font-weight:300;margin:0 0 10px}p{color:#b5b5bd}section{margin-top:38px}header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px}h2{font-size:22px;font-weight:400;margin:0;text-transform:lowercase}header span{color:#a9a9b4;font-size:13px}.browser{border:1px solid #343438;background:#101012}.toolbar{display:flex;align-items:center;padding:6px 12px;gap:6px;border-bottom:1px solid #303034}.toolbar button,nav button{width:36px;height:36px;padding:4px;border:0;background:transparent;color:inherit;display:grid;place-items:center}.toolbar button:hover,nav button:hover{background:#28282f}.toolbar button:focus-visible,nav button:focus-visible{outline:2px solid #62b7ff}.url{margin-left:10px;flex:1;border:1px solid #303034;background:#080809;padding:8px 12px;color:#b5b5bd;font-size:12px}.body{display:grid;grid-template-columns:225px 1fr 44px;min-height:245px}aside{padding:12px 8px;border-right:1px solid #303034}.workspace{display:flex;align-items:center;gap:6px;font-size:13px;margin-bottom:12px}.pins{display:flex;gap:6px;margin:0 4px 16px}.pins span{background:#242428;border:1px solid #303034;flex:1;padding:12px;text-align:center;font-size:13px}.tab{font-size:12px;padding:10px;color:#b5b5bd}.tab.active{background:#0d293e;color:#fff}.content{padding:43px 35px;background:#080809}.content small{color:#62b7ff;font-size:10px;letter-spacing:2px}.content h3{font-size:31px;font-weight:300;margin:18px 0}.content p{font-size:13px}nav{padding-top:6px;border-left:1px solid #303034}.icons{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));margin-top:14px;background:#151518;padding:16px 10px;gap:8px}.icons>div{display:flex;flex-direction:column;align-items:center;gap:9px}.icons span{font-size:11px;color:#b5b5bd;text-align:center}svg{width:28px;height:28px;flex:none}.intro{max-width:700px;font-size:14px;line-height:1.6}.foot{margin-top:24px;font-size:12px;color:#9696a3}@media(max-width:700px){body{padding:24px 18px}.body{grid-template-columns:155px 1fr 38px}.content{padding:30px 16px}.content h3{font-size:24px}.icons{grid-template-columns:repeat(5,1fr);row-gap:20px}header{align-items:start;flex-direction:column;gap:5px}}
</style><main><h1>idam icons.</h1><p class="intro">Browser chrome study · Flat glyphs with square terminals, consistent weight, and generous padding. Both options use the same ten SVG files as their importable Vivaldi theme.</p>'''+specimen('flat')+specimen('classic')+'''<p class="foot">Layout illustration. Real Vivaldi screenshots are provided separately. Website favicons remain unchanged.</p></main></html>'''
# Match the specimen to the CSS palette; this is still a layout illustration.
for old,new in {
    '#080809':pane['background'], '#101012':pane['background'],
    '#f5f5f7':pane['foreground'], '#b5b5bd':pane['muted'],
    '#a9a9b4':pane['muted'], '#9696a3':pane['muted'],
    '#343438':pane['border'], '#303034':pane['border'],
    '#242428':pane['surface'], '#151518':pane['surface'],
    '#28282f':f"color-mix(in srgb, {pane['foreground']} 10%, {pane['surface']})",
    '#0d293e':pane['accent'],
    '#0078d7':pane['accent-text'], '#62b7ff':pane['accent-text'],
}.items():
    html=html.replace(old,new)
html=html.replace('.tab{font-size:12px', '.tab{font-size:13px')
html=html.replace('.pins span{background:', '.pins span{border-radius:6px;background:')
html=html.replace('Browser chrome study ·', 'Pane-aligned browser chrome ·')
# Use the same Idam artwork as the extension for the specimen branding.
brand_svg=(ROOT.parent/'extension'/'public'/'icon.svg').read_text(encoding='utf-8')
html=html.replace('<h1>idam icons.</h1>', '<h1 class="brand">'+brand_svg+'<span>idam icons.</span></h1>')
html=html.replace('</style>', '.brand{display:flex;align-items:center;gap:16px}.brand>svg{width:48px;height:48px;flex:none}</style>')
(ROOT/'preview.html').write_text(html,encoding='utf-8')
