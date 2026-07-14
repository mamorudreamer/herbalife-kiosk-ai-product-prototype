const SVG_ASSETS = __SVG_ASSETS__;
const SCREEN_DEFS = __SCREEN_DEFS__;
const PLUGIN_KEY = 'herbalife-kiosk-portfolio-builder';

figma.showUI(__html__, { width: 360, height: 548, themeColors: true });

const post = (type, text) => figma.ui.postMessage({ type, text });

function rgb(hex) {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255
  };
}

async function ensurePage(name) {
  let page = figma.root.children.find(node => node.type === 'PAGE' && node.name === name);
  if (!page) {
    page = figma.createPage();
    page.name = name;
  }
  await page.loadAsync();
  return page;
}

function clearGenerated(page) {
  for (const node of [...page.children]) {
    if (node.getPluginData(PLUGIN_KEY) === 'generated') node.remove();
  }
}

function tag(node, key) {
  node.setPluginData(PLUGIN_KEY, 'generated');
  node.setPluginData(`${PLUGIN_KEY}:key`, key);
}

async function ensureTokens() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  let primitives = collections.find(item => item.name === 'HK / Primitives');
  let semantics = collections.find(item => item.name === 'HK / Semantics');
  if (!primitives) primitives = figma.variables.createVariableCollection('HK / Primitives');
  if (!semantics) semantics = figma.variables.createVariableCollection('HK / Semantics');

  const existing = await figma.variables.getLocalVariablesAsync();
  const ensure = (name, collection, type, value, scopes, syntax) => {
    let variable = existing.find(item => item.name === name && item.variableCollectionId === collection.id);
    if (!variable) variable = figma.variables.createVariable(name, collection, type);
    variable.scopes = scopes;
    variable.setValueForMode(collection.defaultModeId, value);
    if (syntax) variable.setVariableCodeSyntax('WEB', syntax);
    return variable;
  };

  const colorValues = {
    'green/500': '#7AC143', 'green/600': '#5CA322', 'green/800': '#356B18',
    'mint/100': '#EEF9E7', 'mint/300': '#C8F298', 'neutral/0': '#FFFFFF',
    'neutral/50': '#F6F8F5', 'neutral/200': '#E7EBE7', 'neutral/600': '#7D857F',
    'neutral/900': '#233028', 'red/500': '#DF6269'
  };
  const primitiveColors = {};
  for (const [name, value] of Object.entries(colorValues)) {
    primitiveColors[name] = ensure(`color/${name}`, primitives, 'COLOR', rgb(value), [], null);
  }
  for (const value of [4, 8, 12, 16, 20, 24, 32, 40, 48]) {
    ensure(`space/${value}`, primitives, 'FLOAT', value, [], `var(--hk-space-${value})`);
  }
  for (const value of [8, 12, 16, 24, 999]) {
    ensure(`radius/${value}`, primitives, 'FLOAT', value, [], `var(--hk-radius-${value})`);
  }

  const semanticMap = {
    'color/bg/canvas': ['neutral/0', ['FRAME_FILL', 'SHAPE_FILL']],
    'color/bg/subtle': ['neutral/50', ['FRAME_FILL', 'SHAPE_FILL']],
    'color/bg/brand': ['green/500', ['FRAME_FILL', 'SHAPE_FILL']],
    'color/bg/brand-subtle': ['mint/100', ['FRAME_FILL', 'SHAPE_FILL']],
    'color/text/primary': ['neutral/900', ['TEXT_FILL']],
    'color/text/secondary': ['neutral/600', ['TEXT_FILL']],
    'color/text/brand': ['green/600', ['TEXT_FILL']],
    'color/border/default': ['neutral/200', ['STROKE_COLOR']],
    'color/status/danger': ['red/500', ['TEXT_FILL', 'SHAPE_FILL']]
  };
  for (const [name, [primitiveName, scopes]] of Object.entries(semanticMap)) {
    const alias = figma.variables.createVariableAlias(primitiveColors[primitiveName]);
    ensure(name, semantics, 'COLOR', alias, scopes, `var(--hk-${name.replaceAll('/', '-')})`);
  }

  const fonts = [
    { name: 'HK / Display', style: 'Bold', size: 42, line: 46 },
    { name: 'HK / H1', style: 'Bold', size: 28, line: 34 },
    { name: 'HK / H2', style: 'Semi Bold', size: 20, line: 26 },
    { name: 'HK / Body', style: 'Regular', size: 14, line: 20 },
    { name: 'HK / Caption', style: 'Regular', size: 11, line: 15 }
  ];
  const textStyles = await figma.getLocalTextStylesAsync();
  for (const item of fonts) {
    const fontName = { family: 'Inter', style: item.style };
    await figma.loadFontAsync(fontName);
    let style = textStyles.find(current => current.name === item.name);
    if (!style) style = figma.createTextStyle();
    style.name = item.name;
    style.fontName = fontName;
    style.fontSize = item.size;
    style.lineHeight = { value: item.line, unit: 'PIXELS' };
  }

  const effectStyles = await figma.getLocalEffectStylesAsync();
  let shadow = effectStyles.find(item => item.name === 'HK / Elevation / Card');
  if (!shadow) shadow = figma.createEffectStyle();
  shadow.name = 'HK / Elevation / Card';
  shadow.effects = [{
    type: 'DROP_SHADOW',
    color: { ...rgb('#1E3023'), a: 0.12 },
    offset: { x: 0, y: 10 },
    radius: 24,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL'
  }];

  return { collections: 2, variables: Object.keys(colorValues).length + 14 + Object.keys(semanticMap).length, textStyles: fonts.length, effectStyles: 1 };
}

async function addPageArtwork(page, assetKey, name, x, y) {
  await figma.setCurrentPageAsync(page);
  const node = figma.createNodeFromSvg(SVG_ASSETS[assetKey]);
  node.name = name;
  node.x = x;
  node.y = y;
  tag(node, assetKey);
  return node;
}

async function addScreen(page, definition, index) {
  await figma.setCurrentPageAsync(page);
  const screen = figma.createFrame();
  screen.name = definition.name;
  screen.resize(390, 844);
  screen.clipsContent = true;
  screen.cornerRadius = 28;
  screen.fills = [{ type: 'SOLID', color: rgb('#FFFFFF') }];
  screen.x = 80 + (index % 4) * 470;
  screen.y = 150 + Math.floor(index / 4) * 960;
  tag(screen, definition.key);

  const art = figma.createNodeFromSvg(SVG_ASSETS[definition.key]);
  art.name = 'Artwork';
  screen.appendChild(art);
  art.x = 0;
  art.y = 0;

  const hotspots = [];
  for (const item of definition.hotspots) {
    const hotspot = figma.createRectangle();
    hotspot.name = `Hotspot / ${item.name}`;
    hotspot.resize(item.w, item.h);
    hotspot.fills = [{ type: 'SOLID', color: rgb('#FFFFFF'), opacity: 0.001 }];
    hotspot.strokes = [];
    screen.appendChild(hotspot);
    hotspot.x = item.x;
    hotspot.y = item.y;
    tag(hotspot, `${definition.key}:${item.name}`);
    hotspots.push({ node: hotspot, destinationKey: item.to, transition: item.transition || 'SMART_ANIMATE' });
  }
  return { screen, hotspots };
}

async function buildPrototype(page) {
  await figma.setCurrentPageAsync(page);
  const titleFont = { family: 'Inter', style: 'Bold' };
  await figma.loadFontAsync(titleFont);
  const title = figma.createText();
  title.name = 'Prototype title';
  title.fontName = titleFont;
  title.fontSize = 32;
  title.characters = 'Herbalife Kiosk · Click-through prototype';
  title.fills = [{ type: 'SOLID', color: rgb('#233028') }];
  title.x = 80;
  title.y = 72;
  tag(title, 'prototype-title');

  const created = {};
  const pendingHotspots = [];
  for (let index = 0; index < SCREEN_DEFS.length; index += 1) {
    post('progress', `01 Prototype: экран ${index + 1} из ${SCREEN_DEFS.length}…`);
    const result = await addScreen(page, SCREEN_DEFS[index], index);
    created[SCREEN_DEFS[index].key] = result.screen;
    pendingHotspots.push(...result.hotspots);
  }
  for (const item of pendingHotspots) {
    const destination = created[item.destinationKey];
    if (!destination) continue;
    await item.node.setReactionsAsync([{
      trigger: { type: 'ON_CLICK' },
      actions: [{
        type: 'NODE',
        destinationId: destination.id,
        navigation: 'NAVIGATE',
        transition: { type: item.transition, easing: { type: 'EASE_OUT' }, duration: 0.24 },
        resetScrollPosition: true
      }]
    }]);
  }
  page.flowStartingPoints = [{ nodeId: created['01-splash'].id, name: 'Herbalife Kiosk — Happy Path' }];
  return { screens: Object.values(created), hotspotCount: pendingHotspots.length };
}

async function build() {
  post('progress', 'Создаю продуктовые токены…');
  const tokenSummary = await ensureTokens();
  const foundations = await ensurePage('00 Foundations');
  const prototype = await ensurePage('01 Prototype');
  const story = await ensurePage('02 Product Story');
  clearGenerated(foundations);
  clearGenerated(prototype);
  clearGenerated(story);

  post('progress', '00 Foundations: импортирую SVG…');
  const foundationsNode = await addPageArtwork(foundations, '00-foundations', 'HK / Foundations', 80, 80);

  post('progress', '01 Prototype: создаю экраны и переходы…');
  const prototypeSummary = await buildPrototype(prototype);

  post('progress', '02 Product Story: импортирую User Journey и roadmap…');
  const storyNode = await addPageArtwork(story, '02-product-story', 'HK / Product Story', 80, 80);

  await figma.setCurrentPageAsync(prototype);
  figma.currentPage.selection = [prototypeSummary.screens[0]];
  figma.viewport.scrollAndZoomIntoView(prototypeSummary.screens.slice(0, 4));
  return {
    tokenSummary,
    screenCount: prototypeSummary.screens.length,
    hotspotCount: prototypeSummary.hotspotCount,
    foundationsNodeId: foundationsNode.id,
    storyNodeId: storyNode.id
  };
}

figma.ui.onmessage = async message => {
  if (message.type === 'close') {
    figma.closePlugin();
    return;
  }
  if (message.type !== 'build') return;
  try {
    const result = await build();
    post('done', `Готово: ${result.screenCount} экранов, ${result.hotspotCount} переходов, 3 страницы. Старт — Splash.`);
  } catch (error) {
    post('error', `Ошибка сборки: ${error && error.message ? error.message : String(error)}`);
  }
};
