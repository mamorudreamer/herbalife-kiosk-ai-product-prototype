import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const svgDir = path.join(root, 'svg');
fs.mkdirSync(svgDir, { recursive: true });

const C = {
  green: '#7AC143', greenDark: '#5CA322', greenDeep: '#356B18',
  mint: '#EEF9E7', mintStrong: '#C8F298', ink: '#233028',
  muted: '#7D857F', line: '#E7EBE7', soft: '#F6F8F5',
  danger: '#DF6269', white: '#FFFFFF', canvas: '#EDF2EA'
};

const esc = value => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function text(x, y, value, size = 14, weight = 400, fill = C.ink, anchor = 'start', extra = '') {
  return `<text x="${x}" y="${y}" font-family="Inter,Arial,sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(value)}</text>`;
}

function lines(x, y, values, size = 14, weight = 400, fill = C.ink, lineHeight = 20, anchor = 'start') {
  return `<text x="${x}" y="${y}" font-family="Inter,Arial,sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${values.map((value, i) => `<tspan x="${x}" dy="${i ? lineHeight : 0}">${esc(value)}</tspan>`).join('')}</text>`;
}

function roundRect(x, y, w, h, r, fill, stroke = 'none', sw = 0, extra = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;
}

function svgDoc(width, height, title, body, background = C.white) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title">
  <title id="title">${esc(title)}</title>
  <defs>
    <filter id="shadow" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#1E3023" flood-opacity=".12"/></filter>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="8" flood-color="#1E3023" flood-opacity=".09"/></filter>
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FBFCFA"/><stop offset="1" stop-color="#E9F4E4"/></linearGradient>
    <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8FD253"/><stop offset="1" stop-color="#5CA322"/></linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="${background}"/>
  ${body}
</svg>`;
}

function leafMark(x, y, scale = 1, withWordmark = true) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <circle cx="18" cy="18" r="17" fill="${C.white}" stroke="${C.line}"/>
    <path d="M18 29C8 25 8 13 18 7c10 6 10 18 0 22Z" fill="${C.green}"/>
    <path d="M18 9v17M18 18l-6-4M18 21l7-5" fill="none" stroke="white" stroke-width="1.7" stroke-linecap="round"/>
    ${withWordmark ? text(44, 16, 'HERBALIFE', 10, 800, C.ink) + text(44, 29, 'NUTRITION', 7, 650, C.muted, 'start', 'letter-spacing="1.8"') : ''}
  </g>`;
}

function statusBar(dark = true) {
  const color = dark ? C.ink : C.white;
  return `${text(20, 23, '9:41', 11, 750, color)}
  <g fill="${color}" transform="translate(321 15)"><rect width="3" height="4" rx="1" y="5"/><rect x="5" width="3" height="6" rx="1" y="3"/><rect x="10" width="3" height="9" rx="1"/><path d="M19 7c3-4 8-4 11 0l-2 2c-2-2-5-2-7 0Z"/><rect x="36" y="1" width="20" height="9" rx="2" fill="none" stroke="${color}"/><rect x="38" y="3" width="14" height="5" rx="1"/><rect x="57" y="4" width="2" height="3" rx="1"/></g>`;
}

function backIcon(x = 18, y = 48) {
  return `<g transform="translate(${x} ${y})" stroke="${C.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M16 2 7 11l9 9"/></g>`;
}

function header(title, back = false, right = '') {
  return `${back ? backIcon() : ''}${text(195, 66, title, 16, 700, C.ink, 'middle')}${right}<line x1="0" y1="84" x2="390" y2="84" stroke="${C.line}"/>`;
}

function segment(active = 'map') {
  const list = active === 'list';
  return `${roundRect(18, 135, 354, 38, 10, '#F1F2F0')}
    ${roundRect(list ? 21 : 196, 138, 173, 32, 8, C.green)}
    ${text(108, 159, 'Центры продаж', 12, 650, list ? C.white : C.muted, 'middle')}
    ${text(283, 159, 'Карта', 12, 650, list ? C.muted : C.white, 'middle')}`;
}

function brandRow() {
  return `${leafMark(100, 91, .78, false)}${text(151, 117, 'Рядом ASC', 13, 700)}<path d="m225 110 5 5 5-5" fill="none" stroke="${C.greenDark}" stroke-width="1.5" stroke-linecap="round"/>`;
}

function navIcon(x, y, type, active) {
  const color = active ? C.greenDark : '#B1B7B3';
  if (type === 'catalog') return `<g transform="translate(${x} ${y})" stroke="${color}" stroke-width="1.8" stroke-linecap="round"><path d="M1 2h19M1 9h19M1 16h13"/></g>`;
  if (type === 'cart') return `<g transform="translate(${x} ${y})" stroke="${color}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M1 2h3l2 12h10l3-9H5"/><circle cx="8" cy="18" r="1" fill="${color}"/><circle cx="16" cy="18" r="1" fill="${color}"/></g>`;
  if (type === 'profile') return `<g transform="translate(${x} ${y})" stroke="${color}" stroke-width="1.7" fill="none"><circle cx="10" cy="6" r="4"/><path d="M2 20c1-5 4-7 8-7s7 2 8 7"/></g>`;
  return `<g transform="translate(${x} ${y})" stroke="${color}" stroke-width="1.7" fill="none"><path d="M10 21s7-7 7-13A7 7 0 1 0 3 8c0 6 7 13 7 13Z"/><circle cx="10" cy="8" r="2" fill="${color}"/></g>`;
}

function bottomNav(active = 'catalog', badge = 3) {
  const items = [
    ['catalog', 'Каталог', 39], ['cart', 'Корзина', 136],
    ['profile', 'Профиль', 233], ['auth', 'Авторизация', 330]
  ];
  return `<g><rect x="0" y="769" width="390" height="75" fill="white"/><line x1="0" y1="769" x2="390" y2="769" stroke="${C.line}"/>
    ${items.map(([key, label, x]) => `${navIcon(x, 780, key, active === key)}${text(x + 10, 818, label, 9, 600, active === key ? C.greenDark : '#B1B7B3', 'middle')}${key === 'cart' && badge ? `${roundRect(x + 15, 778, 17, 17, 9, C.green)}${text(x + 23.5, 790, badge, 8, 800, C.white, 'middle')}` : ''}`).join('')}
  </g>`;
}

function button(x, y, w, label, kind = 'primary', h = 46) {
  const fill = kind === 'primary' ? C.green : kind === 'danger' ? '#FFF3F3' : C.mint;
  const color = kind === 'primary' ? C.white : kind === 'danger' ? C.danger : C.greenDeep;
  const stroke = kind === 'secondary' ? C.green : 'none';
  return `${roundRect(x, y, w, h, 12, fill, stroke, stroke === 'none' ? 0 : 1)}${text(x + w / 2, y + h / 2 + 5, label, 13, 750, color, 'middle')}`;
}

function canister(x, y, scale = 1, flavor = 'ORANGE', color = '#EF9A3C') {
  return `<g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
    <ellipse cx="45" cy="9" rx="35" ry="9" fill="#F9FAF8" stroke="#DDE3DD"/>
    <path d="M10 9h70v94c0 9-70 9-70 0Z" fill="white" stroke="#DDE3DD"/>
    <rect x="13" y="27" width="64" height="59" rx="4" fill="${color}" opacity=".92"/>
    <path d="M14 57c18-16 44-14 62 4v25H14Z" fill="white" opacity=".92"/>
    ${text(45, 42, 'HERBALIFE', 6, 800, C.white, 'middle')}
    ${text(45, 58, 'FORMULA 1', 9, 900, C.white, 'middle')}
    ${text(45, 74, flavor, 5.5, 800, C.ink, 'middle')}
    <ellipse cx="45" cy="103" rx="35" ry="8" fill="#EEF1ED"/>
  </g>`;
}

function bottle(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
    <rect x="29" y="0" width="28" height="18" rx="3" fill="#446E2A"/>
    <path d="M22 15h42l7 18v92c0 8-56 8-56 0V33Z" fill="#ECE6C8" stroke="#D0C8A8"/>
    <rect x="19" y="55" width="48" height="50" rx="3" fill="#B6CF66"/>
    ${text(43, 70, 'HERBAL', 6, 900, '#355A20', 'middle')}${text(43, 81, 'ALOE', 9, 900, '#355A20', 'middle')}${text(43, 95, 'SHAMPOO', 5, 700, '#355A20', 'middle')}
  </g>`;
}

function productCard(x, y, kind, price, name, vp = '19,95') {
  const art = kind === 'shampoo' ? bottle(x + 47, y + 16, .68) : canister(x + 44, y + 18, .72, kind === 'vanilla' ? 'VANILLA' : 'ORANGE', kind === 'vanilla' ? '#D3B56C' : '#EF9A3C');
  return `<g>${roundRect(x, y, 171, 235, 16, C.white, C.line, 1, 'filter="url(#softShadow)"')}
    ${roundRect(x + 11, y + 11, 149, 128, 12, 'url(#hero)')}${art}
    <circle cx="${x + 145}" cy="${y + 26}" r="14" fill="white"/><path d="M${x + 145} ${y + 33}s-8-5-8-11c0-7 8-7 8-1 0-6 8-6 8 1 0 6-8 11-8 11Z" fill="none" stroke="#929A94" stroke-width="1.4"/>
    <circle cx="${x + 146}" cy="${y + 134}" r="18" fill="${C.green}" stroke="white" stroke-width="4"/><path d="M${x + 153} ${y + 132}h-12l2 9h8l3-7h-11" fill="none" stroke="white" stroke-width="1.4"/>
    ${text(x + 12, y + 162, price, 13, 800)}
    ${lines(x + 12, y + 181, name, 10, 550, '#38423B', 13)}
    ${text(x + 12, y + 221, `VP: ${vp}`, 10, 650, C.greenDark)}
  </g>`;
}

function splash() {
  const body = `${statusBar()}${leafMark(112, 73, 1.15)}
    ${lines(195, 160, ['Ваши любимые', 'продукты', 'в приложении'], 25, 800, C.ink, 30, 'middle')}
    <path d="M341 608c-54-37-91 11-91 11 49 39 91-11 91-11Z" fill="#BFD9B0" opacity=".8" transform="rotate(13 295 613)"/>
    <path d="M43 730c66-24 94 33 94 33-66 25-94-33-94-33Z" fill="#D6E7CD"/>
    <path d="M284 743c43-38 83 2 83 2-45 37-83-2-83-2Z" fill="#9FCA84" opacity=".8"/>
    <g transform="rotate(-12 122 435)">${canister(70, 330, 1.3, 'ORANGE', '#EF9A3C')}</g>
    <g transform="rotate(11 266 521)">${canister(213, 412, 1.18, 'VANILLA', '#D3B56C')}</g>
    ${text(195, 804, 'Коснитесь, чтобы продолжить', 11, 550, C.muted, 'middle')}`;
  return svgDoc(390, 844, '01 Splash', body, '#FBFCFA');
}

function kioskMap() {
  const roads = `<g transform="translate(0 180)"><rect width="390" height="444" fill="#F4F5F2"/>
    <path d="M-30 74C82 22 97 120 205 91S322 8 430 48M-10 311c94-33 168-9 224 32s120 36 207 6" fill="none" stroke="white" stroke-width="20"/>
    <path d="M36-20c27 91 25 160 92 231s58 127 55 260M212-20c-8 70 48 103 47 171s17 112 119 171M-20 177l430 126M64 0l88 444M302 0l-63 444M-20 394 402 112" fill="none" stroke="#E5E8E3" stroke-width="4"/>
    <path d="M-20 220c78 8 83-27 131-6s51 68 102 49 84-72 205-33" fill="none" stroke="#D8ECEE" stroke-width="13"/>
    <circle cx="294" cy="267" r="70" fill="#7AC143" opacity=".12"/><circle cx="294" cy="267" r="12" fill="white" stroke="${C.green}" stroke-width="4"/><circle cx="294" cy="267" r="4" fill="${C.green}"/>
    ${text(36, 273, 'Riga', 17, 600, '#7E857F')}${text(205, 97, 'CENTRS', 10, 650, '#A1A7A2')}${text(56, 194, 'ĀGENSKALNS', 10, 650, '#A1A7A2')}
  </g>`;
  return svgDoc(390, 844, '02 Kiosk map', `${statusBar()}${header('Выбор киоска')}${brandRow()}${segment('map')}${roads}
    <g filter="url(#shadow)">${roundRect(18, 594, 354, 164, 18, C.white)}${text(36, 625, 'ASC', 11, 750, C.greenDark)}${text(36, 650, 'Рига, улица Пиедруяс 7A', 14, 750)}
    <circle cx="48" cy="690" r="12" fill="${C.mint}"/><path d="M48 699s7-7 7-13a7 7 0 1 0-14 0c0 6 7 13 7 13Z" fill="none" stroke="${C.greenDark}"/><circle cx="48" cy="686" r="2" fill="${C.greenDark}"/>
    ${text(67, 694, '10 мин.', 12, 650, C.muted)}${button(211, 674, 141, 'Продолжить', 'primary', 48)}</g>`);
}

function kioskList() {
  return svgDoc(390, 844, '03 Kiosk list', `${statusBar()}${header('Выбор киоска')}${brandRow()}${segment('list')}
    ${text(18, 210, 'Доступные центры продаж', 15, 750)}
    ${roundRect(18, 230, 354, 106, 16, C.mintStrong)}
    ${roundRect(31, 247, 56, 72, 14, 'rgba(255,255,255,.72)')}
    <g transform="translate(43 253)"><rect width="32" height="57" rx="4" fill="white" stroke="${C.green}" stroke-width="2"/><rect x="4" y="6" width="24" height="18" rx="2" fill="${C.mint}"/><rect x="6" y="29" width="20" height="19" rx="2" fill="${C.green}"/><circle cx="16" cy="38" r="5" fill="white"/></g>
    ${text(101, 262, 'Рига, улица Пиедруяс 7A', 12, 750)}${text(101, 284, 'Центр продаж Herbalife', 10, 500, C.muted)}${text(101, 302, '9:00—19:00', 10, 650, C.greenDeep)}
    <path d="m343 270 7 7-7 7" fill="none" stroke="${C.greenDeep}" stroke-width="2" stroke-linecap="round"/>`);
}

function catalog(filtered = false) {
  const products = filtered
    ? `${productCard(18, 224, 'orange', '560 ₽', ['Протеиновый коктейль', 'Формула 1 · Апельсин'])}${productCard(201, 224, 'vanilla', '1 176,13 ₽', ['Протеиновый коктейль', 'Формула 1 · Ваниль'])}`
    : `${productCard(18, 224, 'orange', '560 ₽', ['Протеиновый коктейль', 'Формула 1 · Апельсин'])}${productCard(201, 224, 'vanilla', '1 176,13 ₽', ['Протеиновый коктейль', 'Формула 1 · Ваниль'])}${productCard(18, 471, 'shampoo', '750,50 ₽', ['Шампунь Натуральный', 'Herbal Aloe'])}${productCard(201, 471, 'orange', '2 000 ₽', ['Витаминно-минеральный', 'комплекс Формула 2'])}`;
  return svgDoc(390, 844, filtered ? '06 Catalog filtered' : '04 Catalog', `${statusBar()}${header('Продукты', false, '<g transform="translate(346 49)" stroke="#5CA322" stroke-width="1.6"><path d="M0 4h17M0 15h17M5 0v8M12 11v8"/></g>')}${brandRow()}
    ${roundRect(18, 139, 306, 42, 12, C.soft)}<circle cx="39" cy="160" r="7" fill="none" stroke="${C.muted}" stroke-width="1.5"/><path d="m44 165 5 5" stroke="${C.muted}" stroke-width="1.5"/>${text(58, 165, 'Поиск', 12, 500, '#9BA19C')}
    ${roundRect(332, 139, 40, 42, 11, C.mint)}<path d="M342 151h20M342 169h20M349 147v8M356 165v8" stroke="${C.greenDark}" stroke-width="1.4"/>
    ${filtered ? '<circle cx="364" cy="148" r="4" fill="#7AC143" stroke="white" stroke-width="2"/>' : ''}
    ${text(18, 211, filtered ? 'Коктейли' : 'Каталог', 16, 800)}${text(372, 211, filtered ? '2 товара' : '4 товара', 10, 550, C.muted, 'end')}${products}${bottomNav('catalog', 3)}`);
}

function filterSheet() {
  return svgDoc(390, 844, '05 Filters', `${statusBar()}${header('Продукты')}${brandRow()}${roundRect(18, 139, 306, 42, 12, C.soft)}${text(58, 165, 'Поиск', 12, 500, '#9BA19C')}
    <rect x="0" y="0" width="390" height="844" fill="#141C17" opacity=".36"/>
    <g filter="url(#shadow)">${roundRect(0, 520, 390, 324, 26, C.white)}<rect x="174" y="530" width="42" height="4" rx="2" fill="#D9DED9"/>
    ${text(18, 581, 'Фильтры', 20, 800)}<path d="m348 558 18 18m0-18-18 18" stroke="${C.ink}" stroke-width="1.8" stroke-linecap="round"/>
    ${roundRect(18, 611, 54, 36, 18, C.white, C.line, 1)}${text(45, 634, 'Все', 11, 650, C.muted, 'middle')}
    ${roundRect(80, 611, 91, 36, 18, C.mint, C.green, 1)}${text(125.5, 634, 'Коктейли', 11, 700, C.greenDeep, 'middle')}
    ${roundRect(179, 611, 86, 36, 18, C.white, C.line, 1)}${text(222, 634, 'Витамины', 11, 650, C.muted, 'middle')}
    ${roundRect(273, 611, 67, 36, 18, C.white, C.line, 1)}${text(306.5, 634, 'Уход', 11, 650, C.muted, 'middle')}
    ${button(18, 754, 130, 'Сбросить', 'secondary', 48)}${button(157, 754, 215, 'Показать товары', 'primary', 48)}</g>`);
}

function productDetail(qty = 1) {
  const total = qty === 1 ? '560 ₽' : '1 120 ₽';
  return svgDoc(390, 844, qty === 1 ? '07 Product detail' : '07A Product quantity 2', `${statusBar()}${header('О товаре', true, '<path d="M349 62s-10-6-10-14c0-9 10-9 10-1 0-8 10-8 10 1 0 8-10 14-10 14Z" fill="none" stroke="#5CA322" stroke-width="1.7"/>')}
    ${roundRect(18, 85, 354, 292, 0, 'url(#hero)')}${canister(142, 126, 1.22, 'ORANGE', '#EF9A3C')}
    ${lines(20, 420, ['Протеиновый коктейль', 'Формула 1'], 23, 800, C.ink, 28)}${text(20, 480, 'Апельсиновый крем · Коктейли', 12, 500, C.muted)}
    ${text(20, 529, '560 ₽', 22, 850)}${text(370, 529, 'VP: 19,95', 12, 700, C.greenDark, 'end')}
    ${lines(20, 574, ['Сбалансированный питательный коктейль для удобного', 'приёма пищи. Содержит белок, клетчатку, витамины', 'и минералы.'], 12, 450, '#626A64', 19)}
    <rect x="0" y="760" width="390" height="84" fill="white"/><line x1="0" y1="760" x2="390" y2="760" stroke="${C.line}"/>
    ${roundRect(18, 776, 112, 48, 12, C.white, C.line, 1)}${text(43, 807, '−', 18, 600, C.ink, 'middle')}${text(74, 807, qty, 13, 800, C.ink, 'middle')}${text(105, 807, '+', 18, 600, C.ink, 'middle')}
    ${button(140, 776, 232, `Добавить · ${total}`, 'primary', 48)}`);
}

function cart(empty = false) {
  if (empty) return svgDoc(390, 844, '09 Empty cart', `${statusBar()}${header('Корзина')}
    <circle cx="195" cy="310" r="62" fill="${C.mint}"/><path d="M167 291h56l-5 55h-46Z" fill="none" stroke="${C.greenDark}" stroke-width="3"/><path d="M180 293v-12c0-19 30-19 30 0v12" fill="none" stroke="${C.greenDark}" stroke-width="3"/>
    ${text(195, 406, 'Корзина пуста', 23, 800, C.ink, 'middle')}${lines(195, 438, ['Добавьте продукты из каталога,', 'чтобы оформить заказ.'], 12, 500, C.muted, 18, 'middle')}${button(70, 511, 250, 'Перейти в каталог')}${bottomNav('cart', 0)}`);
  return svgDoc(390, 844, '08 Cart', `${statusBar()}${header('Корзина', true, '<path d="m348 50 17 17m0-17-17 17" stroke="#DF6269" stroke-width="1.8" stroke-linecap="round"/>')}
    ${roundRect(18, 103, 78, 92, 14, C.soft)}${canister(32, 112, .67, 'ORANGE', '#EF9A3C')}${lines(111, 118, ['Протеиновый коктейль', 'Формула 1'], 12, 700, C.ink, 17)}${text(111, 162, '560 ₽', 12, 750)}
    ${roundRect(111, 174, 98, 31, 8, C.soft)}${text(127, 195, '−', 14, 600, C.ink, 'middle')}${text(160, 195, '1', 11, 750, C.ink, 'middle')}${text(193, 195, '+', 14, 600, C.ink, 'middle')}${text(370, 194, 'VP: 19,95', 10, 650, C.greenDark, 'end')}
    <line x1="18" y1="221" x2="372" y2="221" stroke="${C.line}"/>
    ${roundRect(18, 239, 78, 92, 14, C.soft)}${bottle(35, 249, .62)}${lines(111, 253, ['Шампунь Натуральный', 'Herbal Aloe'], 12, 700, C.ink, 17)}${text(111, 297, '750,50 ₽', 12, 750)}
    ${roundRect(111, 309, 98, 31, 8, C.soft)}${text(127, 330, '−', 14, 600, C.ink, 'middle')}${text(160, 330, '2', 11, 750, C.ink, 'middle')}${text(193, 330, '+', 14, 600, C.ink, 'middle')}${text(370, 329, 'VP: 39,90', 10, 650, C.greenDark, 'end')}
    ${roundRect(18, 379, 354, 130, 16, C.soft)}${text(36, 409, 'Товары (3)', 12, 500, C.muted)}${text(354, 409, 'VP: 59,85', 12, 600, C.muted, 'end')}${text(36, 443, 'Сервисный сбор', 12, 500, C.muted)}${text(354, 443, '0 ₽', 12, 600, C.muted, 'end')}<line x1="36" y1="461" x2="354" y2="461" stroke="${C.line}"/>${text(36, 491, 'Итого', 13, 700)}${text(354, 491, '2 061 ₽', 18, 850, C.ink, 'end')}
    <rect x="0" y="760" width="390" height="84" fill="white"/><line x1="0" y1="760" x2="390" y2="760" stroke="${C.line}"/>${button(18, 776, 138, 'Очистить', 'danger', 48)}${button(165, 776, 207, 'Оформить', 'primary', 48)}`);
}

function checkout() {
  return svgDoc(390, 844, '10 Checkout', `${statusBar()}${header('Оформление заказа', true)}
    ${roundRect(18, 103, 354, 119, 16, C.white, C.line, 1)}${text(34, 132, 'Получение заказа', 14, 800)}<circle cx="52" cy="174" r="22" fill="${C.mint}"/><path d="M52 190s11-11 11-20a11 11 0 1 0-22 0c0 9 11 20 11 20Z" fill="none" stroke="${C.greenDark}" stroke-width="1.7"/><circle cx="52" cy="170" r="3" fill="${C.greenDark}"/>${text(84, 166, 'Рига, улица Пиедруяс 7A', 11, 750)}${text(84, 187, 'Сегодня до 19:00', 10, 550, C.muted)}
    ${roundRect(18, 238, 354, 182, 16, C.white, C.line, 1)}${text(34, 268, 'Данные участника', 14, 800)}${text(34, 299, 'Номер участника', 10, 600, C.muted)}${roundRect(34, 309, 322, 42, 11, C.soft)}${text(49, 335, '102 458 77', 12, 600)}${text(34, 376, 'Назначение заказа', 10, 600, C.muted)}${roundRect(34, 386, 322, 42, 11, C.soft)}${text(49, 412, 'Личное потребление', 12, 600)}<path d="m336 403 5 5 5-5" fill="none" stroke="${C.muted}"/>
    ${roundRect(18, 436, 354, 112, 16, C.white, C.line, 1)}${text(34, 466, 'Способ оплаты', 14, 800)}${roundRect(34, 482, 322, 50, 12, C.mint, C.green, 1)}<circle cx="56" cy="507" r="8" fill="white" stroke="${C.green}" stroke-width="2"/><circle cx="56" cy="507" r="4" fill="${C.green}"/>${text(76, 503, 'Банковская карта', 11, 750)}${text(76, 519, 'Защищённое окно оплаты', 9, 500, C.muted)}
    <rect x="0" y="731" width="390" height="113" fill="white"/><line x1="0" y1="731" x2="390" y2="731" stroke="${C.line}"/>${text(18, 758, 'К оплате', 11, 550, C.muted)}${text(372, 758, '2 061 ₽', 16, 850, C.ink, 'end')}${button(18, 773, 354, 'Оплатить заказ', 'primary', 50)}`);
}

function success() {
  return svgDoc(390, 844, '11 Order success', `${statusBar()}<circle cx="195" cy="148" r="46" fill="${C.green}" filter="url(#shadow)"/><path d="m174 148 14 14 29-33" fill="none" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    ${text(195, 232, 'Заказ оформлен', 27, 850, C.ink, 'middle')}${lines(195, 267, ['Покажите номер токена у терминала', 'выбранного центра продаж.'], 12, 500, C.muted, 19, 'middle')}
    <g filter="url(#softShadow)">${roundRect(18, 337, 354, 196, 20, C.white, C.green, 1, 'stroke-dasharray="6 5"')}${text(195, 375, 'ТОКЕН ВЫДАЧИ', 10, 750, C.muted, 'middle', 'letter-spacing="1.5"')}${text(195, 453, '247', 62, 900, C.greenDark, 'middle')}${text(195, 501, 'Заказ № HK-153872', 11, 600, C.muted, 'middle')}</g>
    ${roundRect(18, 558, 354, 80, 14, C.soft)}<path d="M46 615s10-10 10-18a10 10 0 1 0-20 0c0 8 10 18 10 18Z" fill="none" stroke="${C.greenDark}" stroke-width="1.6"/><circle cx="46" cy="597" r="3" fill="${C.greenDark}"/>${text(69, 589, 'Рига, улица Пиедруяс 7A', 11, 750)}${text(69, 611, 'Заказ хранится до 19:00', 10, 500, C.muted)}
    ${button(18, 766, 354, 'Вернуться в каталог', 'primary', 52)}`, '#F9FFF5');
}

function auth() {
  return svgDoc(390, 844, '12 Authorization', `${statusBar()}${leafMark(112, 85, 1.15)}${text(195, 191, 'Авторизация', 27, 850, C.ink, 'middle')}${lines(195, 224, ['Войдите, чтобы видеть персональные цены,', 'объём и историю заказов.'], 11, 500, C.muted, 17, 'middle')}
    ${text(24, 293, 'ID участника', 10, 650, C.muted)}${roundRect(24, 304, 342, 48, 12, C.soft)}${text(41, 334, '10245877', 13, 650)}
    ${text(24, 386, 'PIN-код', 10, 650, C.muted)}${roundRect(24, 397, 342, 48, 12, C.soft)}${text(41, 428, '••••', 17, 800)}
    ${roundRect(24, 471, 342, 58, 12, C.soft)}${lines(40, 494, ['Демонстрационный экран: данные не отправляются', 'и используются только внутри прототипа.'], 9, 500, C.muted, 14)}${button(24, 553, 342, 'Войти', 'primary', 50)}${bottomNav('auth', 3)}`);
}

function profile() {
  return svgDoc(390, 844, '13 Profile', `${statusBar()}${header('Профиль')}
    <circle cx="195" cy="173" r="43" fill="${C.mint}"/><circle cx="195" cy="158" r="12" fill="none" stroke="${C.greenDark}" stroke-width="2"/><path d="M172 202c3-20 12-29 23-29s20 9 23 29" fill="none" stroke="${C.greenDark}" stroke-width="2"/>
    ${text(195, 246, 'Александр', 24, 850, C.ink, 'middle')}${text(195, 272, 'Независимый партнёр Herbalife', 11, 500, C.muted, 'middle')}${text(195, 292, 'ID 102 458 77', 11, 650, C.greenDark, 'middle')}
    ${roundRect(18, 335, 354, 156, 16, C.white, C.line, 1)}${text(34, 371, 'Последний заказ', 11, 500, C.muted)}${text(356, 371, 'HK-153872', 11, 750, C.ink, 'end')}<line x1="34" y1="389" x2="356" y2="389" stroke="${C.line}"/>${text(34, 420, 'Статус', 11, 500, C.muted)}${text(356, 420, 'Получен', 11, 750, C.greenDark, 'end')}<line x1="34" y1="438" x2="356" y2="438" stroke="${C.line}"/>${text(34, 469, 'Общий VP', 11, 500, C.muted)}${text(356, 469, '59,85', 11, 750, C.ink, 'end')}${bottomNav('profile', 3)}`);
}

function foundations() {
  const swatches = [
    ['Brand / 500', C.green], ['Brand / 600', C.greenDark], ['Brand / 800', C.greenDeep],
    ['Mint / 100', C.mint], ['Mint / 300', C.mintStrong], ['Ink / 900', C.ink],
    ['Neutral / 600', C.muted], ['Line / 200', C.line], ['Soft / 50', C.soft], ['Danger / 500', C.danger]
  ];
  const body = `${text(72, 91, 'HERBALIFE KIOSK', 12, 800, C.greenDark, 'start', 'letter-spacing="1.8"')}${text(72, 156, 'Foundations', 52, 850)}${text(72, 193, 'SVG-first design system · Product portfolio', 16, 500, C.muted)}
    ${text(72, 268, 'Color tokens', 24, 800)}
    ${swatches.map(([name, color], i) => { const col = i % 5; const row = Math.floor(i / 5); const x = 72 + col * 252; const y = 298 + row * 134; return `${roundRect(x, y, 220, 78, 14, color, color === C.line ? '#D3D8D3' : 'none', 1)}${text(x, y + 103, name, 12, 700)}${text(x + 220, y + 103, color, 11, 500, C.muted, 'end')}`; }).join('')}
    ${text(72, 610, 'Typography', 24, 800)}${text(72, 680, 'Любимые продукты — рядом', 42, 850)}${text(72, 734, 'Заголовок экрана · 28 / 34', 24, 800)}${text(72, 779, 'Основной текст объясняет действие пользователя и следующий шаг.', 16, 450)}${text(72, 813, 'Caption · статус, VP и вспомогательные данные', 12, 500, C.muted)}
    ${text(820, 610, 'Spacing & radius', 24, 800)}${[4,8,12,16,24,32,48].map((v,i)=>`${roundRect(820, 646 + i*35, v*3, 16, 4, C.green)}${text(980, 659 + i*35, `${v}px`, 11, 650, C.muted)}`).join('')}
    ${text(72, 910, 'Core components', 24, 800)}${button(72, 949, 220, 'Primary action')}${button(312, 949, 180, 'Secondary', 'secondary')}${roundRect(526, 954, 108, 36, 18, C.mint, C.green, 1)}${text(580, 977, 'Коктейли', 11, 700, C.greenDeep, 'middle')}${roundRect(672, 946, 324, 48, 12, C.soft)}${text(697, 976, 'Поиск', 12, 500, '#9BA19C')}${roundRect(1034, 940, 330, 80, 16, C.white, C.line, 1, 'filter="url(#softShadow)"')}${text(1054, 972, 'Product card / Order summary', 13, 750)}${text(1054, 994, 'Auto-layout pattern · radius 16', 11, 500, C.muted)}`;
  return svgDoc(1440, 1120, '00 Foundations', body, '#FBFDF9');
}

function productStory() {
  const stages = [
    ['1 · Need', 'Купить привычные продукты быстро', 'Понимает потребность', 'Неясно, где доступно', 'Показ ближайшего ASC', 'Start → ASC'],
    ['2 · Locate', 'Выбрать удобный центр', 'Сравнивает карту и список', 'Адрес и часы работы', 'Два режима + ETA', 'ASC select rate'],
    ['3 · Explore', 'Найти нужный SKU', 'Ищет и фильтрует', 'Большой ассортимент', 'Категории + поиск', 'Catalog → PDP'],
    ['4 · Decide', 'Понять цену и VP', 'Смотрит карточку товара', 'Сомнение в составе заказа', 'Цена и VP рядом', 'Add-to-cart'],
    ['5 · Pay', 'Оформить без ошибок', 'Проверяет заказ и платит', 'Лишние поля, ошибки оплаты', 'Короткий checkout', 'Payment success'],
    ['6 · Pickup', 'Получить заказ', 'Показывает токен', 'Можно потерять номер', 'Крупная token card', 'Fulfilled orders']
  ];
  const colW = 248;
  const startX = 72;
  const journey = stages.map((stage, i) => {
    const x = startX + i * colW;
    return `<g>${roundRect(x, 552, 228, 430, 18, C.white, C.line, 1, 'filter="url(#softShadow)"')}${roundRect(x, 552, 228, 58, 18, i === 5 ? C.green : C.mint)}${text(x + 18, 588, stage[0], 13, 800, i === 5 ? C.white : C.greenDeep)}
      ${text(x + 18, 642, 'Цель', 9, 750, C.muted, 'start', 'letter-spacing="1"')}${lines(x + 18, 666, wrapWords(stage[1], 25), 11, 650, C.ink, 16)}
      ${text(x + 18, 732, 'ДЕЙСТВИЕ', 9, 750, C.muted, 'start', 'letter-spacing="1"')}${lines(x + 18, 756, wrapWords(stage[2], 25), 11, 500, C.ink, 16)}
      ${text(x + 18, 816, 'РИСК', 9, 750, C.danger, 'start', 'letter-spacing="1"')}${lines(x + 18, 840, wrapWords(stage[3], 25), 11, 500, C.ink, 16)}
      ${text(x + 18, 900, 'PRODUCT DECISION', 9, 750, C.greenDark, 'start', 'letter-spacing="1"')}${lines(x + 18, 924, wrapWords(stage[4], 25), 11, 650, C.ink, 16)}
      ${text(x + 18, 966, stage[5], 10, 750, C.greenDark)}</g>`;
  }).join('');

  const phases = [
    ['Discovery', 'Контекст, пользователи, текущий kiosk-flow'],
    ['Define', 'Problem statement, CJM, happy path, KPI'],
    ['MVP', 'ASC → каталог → cart → checkout → token'],
    ['Pilot', 'UAT, интеграции, edge cases, support'],
    ['Launch', 'Мониторинг воронки и качества выдачи'],
    ['Iterate', 'Приоритизация точек потерь и улучшений']
  ];
  const phaseNodes = phases.map((phase, i) => {
    const x = 72 + i * 248;
    return `${roundRect(x, 1164, 228, 136, 16, i === 2 ? C.green : C.white, i === 2 ? C.green : C.line, 1)}${text(x + 18, 1201, `${i + 1}. ${phase[0]}`, 14, 800, i === 2 ? C.white : C.ink)}${lines(x + 18, 1232, wrapWords(phase[1], 27), 10.5, 500, i === 2 ? '#F6FFE9' : C.muted, 16)}${i < 5 ? '<path d="m' + (x + 232) + ' 1231 12 0" stroke="#9CCB78" stroke-width="2"/><path d="m' + (x + 240) + ' 1227 5 4-5 4" fill="none" stroke="#9CCB78" stroke-width="2"/>' : ''}`;
  }).join('');

  const body = `${text(72, 78, 'PRODUCT CASE', 12, 850, C.greenDark, 'start', 'letter-spacing="1.8"')}${text(72, 144, 'Herbalife Kiosk', 54, 900)}${text(72, 185, 'Product Manager · Mobile ordering for automated sales centers', 16, 550, C.muted)}
    ${roundRect(72, 232, 476, 190, 20, C.ink)}${text(98, 270, 'Problem', 11, 800, '#B7DFA0', 'start', 'letter-spacing="1.3"')}${lines(98, 312, ['Покупателю нужен предсказуемый путь', 'от выбора доступного ASC до получения', 'понятного токена выдачи — без потери', 'контекста заказа.'], 18, 650, C.white, 27)}
    ${roundRect(570, 232, 476, 190, 20, C.mint)}${text(596, 270, 'Product goal', 11, 800, C.greenDark, 'start', 'letter-spacing="1.3"')}${lines(596, 312, ['Снизить трение в заказе и сделать', 'статус выдачи очевидным на каждом', 'шаге пользовательского сценария.'], 18, 650, C.ink, 27)}
    ${roundRect(1068, 232, 420, 190, 20, C.white, C.line, 1)}${text(1094, 270, 'Role focus', 11, 800, C.greenDark, 'start', 'letter-spacing="1.3"')}${lines(1094, 306, ['Customer problem', 'Hypothesis prioritization', 'Product requirements', 'Success metrics', 'Launch & iteration'], 14, 650, C.ink, 23)}
    ${text(72, 502, 'User Journey · happy path', 28, 850)}${text(1488, 502, 'Цель → действие → риск → решение → KPI', 12, 550, C.muted, 'end')}${journey}
    ${text(72, 1114, 'Product roadmap', 28, 850)}${phaseNodes}
    ${text(72, 1378, 'Metric framework', 28, 850)}
    ${roundRect(72, 1420, 476, 220, 20, C.green)}${text(98, 1460, 'NORTH STAR', 10, 800, '#E9FFD9', 'start', 'letter-spacing="1.4"')}${lines(98, 1501, ['Успешно выданные', 'заказы через Kiosk'], 28, 850, C.white, 35)}${text(98, 1596, 'Fulfilled kiosk orders / active users', 11, 600, '#E9FFD9')}
    ${roundRect(570, 1420, 442, 220, 20, C.white, C.line, 1)}${text(596, 1460, 'FUNNEL', 10, 800, C.greenDark, 'start', 'letter-spacing="1.4"')}${lines(596, 1496, ['ASC selected', 'Product viewed', 'Added to cart', 'Payment success', 'Token fulfilled'], 14, 700, C.ink, 27)}
    ${roundRect(1034, 1420, 454, 220, 20, C.white, C.line, 1)}${text(1060, 1460, 'GUARDRAILS', 10, 800, C.danger, 'start', 'letter-spacing="1.4"')}${lines(1060, 1496, ['Payment error rate', 'Token retrieval failure', 'Order cancellation rate', 'Median order time', 'Support contacts / order'], 14, 700, C.ink, 27)}
    ${roundRect(72, 1688, 1416, 122, 20, '#F4F8F1')}${text(98, 1728, 'Portfolio note', 12, 800, C.greenDeep)}${lines(98, 1760, ['Здесь показана продуктовая логика и определения метрик, а не выдуманные результаты.', 'В публичной версии замените только подтверждённые цифры и формулировки своего вклада.'], 13, 550, C.muted, 21)}`;
  return svgDoc(1560, 1880, '02 Product Story', body, '#FBFDF9');
}

function prototypeBoard(definitions) {
  const cols = 4;
  const gapX = 60;
  const gapY = 96;
  const startX = 72;
  const startY = 176;
  const width = startX * 2 + cols * 390 + (cols - 1) * gapX;
  const rows = Math.ceil(definitions.length / cols);
  const height = startY + rows * 844 + (rows - 1) * gapY + 80;
  const items = definitions.map((definition, index) => {
    const x = startX + (index % cols) * (390 + gapX);
    const y = startY + Math.floor(index / cols) * (844 + gapY);
    const inner = definition.svg
      .replace(/^<\?xml[^>]*>\s*/, '')
      .replace(/^<svg[^>]*>/, '')
      .replace(/<title[\s\S]*?<\/title>/, '')
      .replace(/<defs>[\s\S]*?<\/defs>/, '')
      .replace(/<\/svg>\s*$/, '');
    return `${text(x, y - 22, definition.name, 14, 800, C.ink)}<svg x="${x}" y="${y}" width="390" height="844" viewBox="0 0 390 844">${inner}</svg>`;
  }).join('');
  return svgDoc(width, height, '01 Prototype board', `${text(72, 78, 'CLICK-THROUGH PROTOTYPE', 12, 850, C.greenDark, 'start', 'letter-spacing="1.8"')}${text(72, 132, 'Herbalife Kiosk · Mobile flow', 38, 850)}${items}`, '#EDF2EA');
}

function wrapWords(value, limit) {
  const words = value.split(' ');
  const rows = [];
  let row = '';
  for (const word of words) {
    const next = row ? `${row} ${word}` : word;
    if (next.length > limit && row) { rows.push(row); row = word; }
    else row = next;
  }
  if (row) rows.push(row);
  return rows;
}

const screenDefs = [
  { key: '01-splash', name: '01 · Splash', svg: splash(), hotspots: [{ name: 'Continue', x: 0, y: 0, w: 390, h: 844, to: '02-kiosk-map' }] },
  { key: '02-kiosk-map', name: '02 · Kiosk / Map', svg: kioskMap(), hotspots: [
    { name: 'List tab', x: 18, y: 135, w: 176, h: 38, to: '03-kiosk-list' }, { name: 'Continue', x: 211, y: 674, w: 141, h: 48, to: '04-catalog' }
  ] },
  { key: '03-kiosk-list', name: '03 · Kiosk / List', svg: kioskList(), hotspots: [
    { name: 'Map tab', x: 194, y: 135, w: 178, h: 38, to: '02-kiosk-map' }, { name: 'Select kiosk', x: 18, y: 230, w: 354, h: 106, to: '04-catalog' }
  ] },
  { key: '04-catalog', name: '04 · Catalog / Default', svg: catalog(false), hotspots: [
    { name: 'Kiosk selector', x: 95, y: 88, w: 200, h: 45, to: '02-kiosk-map' }, { name: 'Filters', x: 330, y: 136, w: 44, h: 48, to: '05-filter' },
    { name: 'Product', x: 18, y: 224, w: 171, h: 235, to: '07-product' }, { name: 'Cart', x: 113, y: 769, w: 96, h: 75, to: '08-cart' },
    { name: 'Profile', x: 210, y: 769, w: 96, h: 75, to: '13-profile' }, { name: 'Authorization', x: 307, y: 769, w: 83, h: 75, to: '12-auth' }
  ] },
  { key: '05-filter', name: '05 · Filters / Sheet', svg: filterSheet(), hotspots: [
    { name: 'Close', x: 338, y: 548, w: 40, h: 40, to: '04-catalog' }, { name: 'Reset', x: 18, y: 754, w: 130, h: 48, to: '04-catalog' },
    { name: 'Apply', x: 157, y: 754, w: 215, h: 48, to: '06-catalog-filtered' }
  ] },
  { key: '06-catalog-filtered', name: '06 · Catalog / Filtered', svg: catalog(true), hotspots: [
    { name: 'Filters', x: 330, y: 136, w: 44, h: 48, to: '05-filter' }, { name: 'Product', x: 18, y: 224, w: 171, h: 235, to: '07-product' },
    { name: 'Cart', x: 113, y: 769, w: 96, h: 75, to: '08-cart' }
  ] },
  { key: '07-product', name: '07 · Product / Qty 1', svg: productDetail(1), hotspots: [
    { name: 'Back', x: 8, y: 38, w: 50, h: 48, to: '04-catalog' }, { name: 'Plus', x: 86, y: 776, w: 44, h: 48, to: '07a-product-qty2' },
    { name: 'Add to cart', x: 140, y: 776, w: 232, h: 48, to: '08-cart' }
  ] },
  { key: '07a-product-qty2', name: '07A · Product / Qty 2', svg: productDetail(2), hotspots: [
    { name: 'Back', x: 8, y: 38, w: 50, h: 48, to: '04-catalog' }, { name: 'Minus', x: 18, y: 776, w: 44, h: 48, to: '07-product' },
    { name: 'Add to cart', x: 140, y: 776, w: 232, h: 48, to: '08-cart' }
  ] },
  { key: '08-cart', name: '08 · Cart', svg: cart(false), hotspots: [
    { name: 'Back', x: 8, y: 38, w: 50, h: 48, to: '04-catalog' }, { name: 'Clear', x: 18, y: 776, w: 138, h: 48, to: '09-cart-empty' },
    { name: 'Checkout', x: 165, y: 776, w: 207, h: 48, to: '10-checkout' }
  ] },
  { key: '09-cart-empty', name: '09 · Cart / Empty', svg: cart(true), hotspots: [
    { name: 'Go to catalog', x: 70, y: 511, w: 250, h: 46, to: '04-catalog' }, { name: 'Catalog tab', x: 0, y: 769, w: 98, h: 75, to: '04-catalog' }
  ] },
  { key: '10-checkout', name: '10 · Checkout', svg: checkout(), hotspots: [
    { name: 'Back', x: 8, y: 38, w: 50, h: 48, to: '08-cart' }, { name: 'Pay', x: 18, y: 773, w: 354, h: 50, to: '11-success' }
  ] },
  { key: '11-success', name: '11 · Success / Token', svg: success(), hotspots: [
    { name: 'Return to catalog', x: 18, y: 766, w: 354, h: 52, to: '04-catalog' }
  ] },
  { key: '12-auth', name: '12 · Authorization', svg: auth(), hotspots: [
    { name: 'Sign in', x: 24, y: 553, w: 342, h: 50, to: '13-profile' }, { name: 'Catalog tab', x: 0, y: 769, w: 98, h: 75, to: '04-catalog' },
    { name: 'Cart tab', x: 98, y: 769, w: 98, h: 75, to: '08-cart' }, { name: 'Profile tab', x: 196, y: 769, w: 98, h: 75, to: '13-profile' }
  ] },
  { key: '13-profile', name: '13 · Profile', svg: profile(), hotspots: [
    { name: 'Catalog tab', x: 0, y: 769, w: 98, h: 75, to: '04-catalog' }, { name: 'Cart tab', x: 98, y: 769, w: 98, h: 75, to: '08-cart' },
    { name: 'Authorization tab', x: 294, y: 769, w: 96, h: 75, to: '12-auth' }
  ] }
];

const assets = {
  '00-foundations': foundations(),
  '02-product-story': productStory()
};
for (const definition of screenDefs) assets[definition.key] = definition.svg;

for (const [key, value] of Object.entries(assets)) {
  fs.writeFileSync(path.join(svgDir, `${key}.svg`), value, 'utf8');
}
fs.writeFileSync(path.join(svgDir, '01-prototype-board.svg'), prototypeBoard(screenDefs), 'utf8');

const template = fs.readFileSync(path.join(root, 'src', 'plugin-template.js'), 'utf8');
const pluginScreenDefs = screenDefs.map(({ key, name, hotspots }) => ({ key, name, hotspots }));
fs.writeFileSync(path.join(root, 'prototype-map.json'), JSON.stringify({
  name: 'Herbalife Kiosk — Happy Path',
  start: '01-splash',
  role: 'Product Manager',
  screens: pluginScreenDefs
}, null, 2), 'utf8');
const code = template
  .replace('__SVG_ASSETS__', JSON.stringify(assets))
  .replace('__SCREEN_DEFS__', JSON.stringify(pluginScreenDefs));
fs.writeFileSync(path.join(root, 'code.js'), code, 'utf8');

console.log(`Built ${Object.keys(assets).length} SVG assets and ${screenDefs.length} prototype screens.`);
