// 获取元素宽高

import isElement from "./iselement";

interface Result {
  w: number;
  h: number;
}

export default function getElementSize(element: HTMLElement): Result {
  if (!isElement(element)) {
    return {
      w: 0,
      h: 0
    };
  }

  let styleW: string = <string>element.style.width;
  let styleH: string = <string>element.style.height;
  let bound = element.getBoundingClientRect();

  let w: number = styleW ? +styleW.slice(0, -2) : +bound.width;
  let h: number = styleH ? +styleH.slice(0 - 2) : +bound.height;

  return {
    w,
    h
  };
}
