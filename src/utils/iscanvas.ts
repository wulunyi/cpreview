// 是否是 canvas
import isElement from './iselement';

/**
 * @description 判断是否是一个 canvas 元素
 * @param element 
 * @returns boolean
 */
export default function isCanvas(element: HTMLElement): boolean {
  return isElement(element)
    ? element.tagName.toLocaleUpperCase() === "CANVAS"
    : false;
}
