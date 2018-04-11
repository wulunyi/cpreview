/**
 * @description 判读形状
 * @param {Number} w 宽
 * @param {Number} h 高
 * @returns {Number} 1 为宽大于等于高 -1 为高大于等于宽
 */
export default function calcShape(w: number, h: number): number {
  let r = w / h;

  return r >= 1 ? 1 : -1;
}