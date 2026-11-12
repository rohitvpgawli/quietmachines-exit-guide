// Quiet Machines exit guide: find paid-subscription apps on this Mac, locally.
//
//   osascript -l JavaScript scan.js              # downloads the public detection index
//   osascript -l JavaScript scan.js detect.json  # or uses a local copy
//
// Read-only. Looks at app bundles in /Applications and ~/Applications (one folder deep),
// `brew list --cask`, and VS Code / Cursor extension folder names. Matching happens here,
// on this Mac. Prints only the matches as JSON; the full app list is never printed or sent.
// It does not read browser history, email, keychains, documents or bank data.

ObjC.import('Foundation');

const INDEX_URL = 'https://quietmachines.fyi/api/exit-guide/detect.json';

function run(argv) {
  const app = Application.currentApplication();
  app.includeStandardAdditions = true;
  const sh = command => { try { return app.doShellScript(command, { alteringLineEndings: false }); } catch (error) { return ''; } };
  const quote = text => "'" + String(text).replace(/'/g, "'\\''") + "'";
  const fm = $.NSFileManager.defaultManager;
  const home = ObjC.unwrap($.NSHomeDirectory());
  const list = dir => {
    const items = fm.contentsOfDirectoryAtPathError(dir, null);
    return items.isNil() ? [] : ObjC.deepUnwrap(items);
  };
  const isDir = path => { const flag = Ref(); return fm.fileExistsAtPathIsDirectory(path, flag) && flag[0]; };

  const raw = argv[0] ? sh('cat ' + quote(argv[0])) : sh('curl -fsSL --max-time 20 ' + INDEX_URL);
  let index;
  try { index = JSON.parse(raw); } catch (error) {
    return JSON.stringify({ error: 'Could not load the detection index from ' + (argv[0] || INDEX_URL) + '.' });
  }

  // Installed apps: name (without .app) and bundle identifier.
  const apps = [];
  const addApp = path => {
    const bundle = $.NSBundle.bundleWithPath(path);
    const id = bundle.isNil() || bundle.bundleIdentifier.isNil() ? '' : ObjC.unwrap(bundle.bundleIdentifier);
    apps.push({ name: path.split('/').pop().replace(/\.app$/, ''), bundleId: id });
  };
  for (const root of ['/Applications', '/Applications/Utilities', home + '/Applications']) {
    for (const item of list(root)) {
      const path = root + '/' + item;
      if (item.endsWith('.app')) addApp(path);
      else if (isDir(path) && root !== '/Applications/Utilities') {
        for (const child of list(path)) if (child.endsWith('.app')) addApp(path + '/' + child);
      }
    }
  }

  const casks = sh('PATH=/opt/homebrew/bin:/usr/local/bin:$PATH; command -v brew >/dev/null 2>&1 && brew list --cask 2>/dev/null')
    .split('\n').map(line => line.trim()).filter(Boolean);

  const extensions = [];
  for (const dir of [home + '/.vscode/extensions', home + '/.cursor/extensions', home + '/.windsurf/extensions']) {
    for (const item of list(dir)) {
      const id = item.toLowerCase().replace(/-\d+\.\d+.*$/, '');
      if (id.includes('.') && !extensions.includes(id)) extensions.push(id);
    }
  }

  const matches = [];
  const webOnly = [];
  for (const tool of index.tools || []) {
    const detect = tool.detect || {};
    const evidence = [];
    for (const found of apps) {
      const exact = (detect.apps || []).includes(found.name);
      const prefix = (detect.appPrefixes || []).some(p => found.name.startsWith(p));
      const bundle = found.bundleId && (detect.bundleIds || []).some(p => found.bundleId.startsWith(p));
      if (exact || prefix || bundle) evidence.push('app: ' + found.name + (found.bundleId ? ' (' + found.bundleId + ')' : ''));
    }
    for (const cask of casks) if ((detect.casks || []).includes(cask)) evidence.push('brew cask: ' + cask);
    for (const ext of extensions) if ((detect.extensions || []).includes(ext)) evidence.push('editor extension: ' + ext);
    const unique = [...new Set(evidence)];
    if (unique.length) matches.push({ id: tool.id, name: tool.name, evidence: unique });
    else if (!detect.apps && !detect.appPrefixes && !detect.bundleIds && !detect.extensions) {
      webOnly.push({ id: tool.id, name: tool.name, domains: detect.domains || [] });
    }
  }

  return JSON.stringify({
    scanned: { apps: apps.length, casks: casks.length, editorExtensions: extensions.length },
    note: 'Installed does not mean paid. Confirm each match with the person before treating it as a subscription.',
    matches,
    webOnly,
  }, null, 1);
}
