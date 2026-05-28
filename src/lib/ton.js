// Сборка BuyItem-payload без внешних библиотек.
// Структура BOC: корень (32 бита opcode) + 2 ref-ячейки со строками.
// Проверено байт-в-байт против Tact-обёртки контракта.

const BUYITEM_OPCODE = 0xDE0D1164;

function crc32c(bytes) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (crc >>> 1) ^ 0x82F63B78 : crc >>> 1;
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function strBytes(s) {
  return Array.from(new TextEncoder().encode(s));
}

function serializeCell(cell) {
  const d1 = cell.refs.length;
  const fullBytes = Math.floor(cell.bits / 8);
  const d2 = fullBytes + Math.ceil(cell.bits / 8);
  const dataPart = cell.data.slice();
  if (cell.bits % 8 !== 0) {
    const usedBits = cell.bits % 8;
    dataPart[fullBytes] = (cell.data[fullBytes] || 0) | (1 << (7 - usedBits));
  }
  return [d1, d2, ...dataPart, ...cell.refs];
}

function bytesToBase64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export function buildBuyItemPayload(itemTag, playerId) {
  const op = BUYITEM_OPCODE >>> 0;
  const opBytes = [(op >>> 24) & 0xff, (op >>> 16) & 0xff, (op >>> 8) & 0xff, op & 0xff];
  const root = { data: opBytes, bits: 32, refs: [1, 2] };

  const tagBytes = strBytes(itemTag);
  const c1 = { data: tagBytes, bits: tagBytes.length * 8, refs: [] };

  const pidBytes = strBytes(playerId);
  const c2 = { data: pidBytes, bits: pidBytes.length * 8, refs: [] };

  const cells = [root, c1, c2];
  let cellData = [];
  for (const c of cells) cellData.push(...serializeCell(c));

  let boc = [
    0xb5, 0xee, 0x9c, 0x72, 0x41, 0x01,
    cells.length, 0x01, 0x00, cellData.length, 0x00,
    ...cellData,
  ];
  const crc = crc32c(boc);
  boc.push(crc & 0xff, (crc >>> 8) & 0xff, (crc >>> 16) & 0xff, (crc >>> 24) & 0xff);
  return bytesToBase64(boc);
}

// TON -> нанотоны (строкой), без библиотек.
export function toNanoStr(ton) {
  const [intPart, fracPart = ''] = ton.toString().split('.');
  const frac = (fracPart + '000000000').slice(0, 9);
  return (BigInt(intPart) * 1000000000n + BigInt(frac)).toString();
}
