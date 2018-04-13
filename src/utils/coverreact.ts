// 根据宽高和角度求最小覆盖矩形宽高
import toRaian from './toraian';

export default function coverReact(w: number, h: number, angle: number) {
  let radian = toRaian(angle);

  return {
    width: w * Math.cos(radian) + h * Math.sin(radian),
    height: w * Math.sin(radian) + h * Math.cos(radian)
  }
}