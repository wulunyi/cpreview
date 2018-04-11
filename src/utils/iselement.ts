/**
 * @description 判断是否是一个 dom 元素
 * @param element 
 * @returns boolean
 */
export default function isElement(element: HTMLElement): boolean {
  if (typeof HTMLElement === "object") {
    return element instanceof HTMLElement;
  }

  return (
    element &&
    typeof element === "object" &&
    element.nodeType === 1 &&
    typeof element.nodeName === "string"
  );
}
