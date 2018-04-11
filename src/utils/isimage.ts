// 是否是 canvas
import isElement from './iselement';

/**
 * @description 判断是否是一个 image 元素
 * @param element 
 * @returns boolean
 */
export default function isImage(element: HTMLElement): boolean {
  return isElement(element)
    ? element.tagName.toLocaleUpperCase() === "IMG"
    : false;
}
