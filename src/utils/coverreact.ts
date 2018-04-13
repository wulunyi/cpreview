// 根据宽高和角度求最小覆盖矩形宽高
import toRaian from './toraian';

export default function coverReact(w: number, h: number, angle: number) {
  let radian = toRaian(angle <= 90 ? angle : angle <= 180? 180 - angle : angle <= 270 ? angle % 180: 180 - (angle % 180));

  return {
    width: Math.abs(w * Math.cos(radian) + h * Math.sin(radian)),
    height: Math.abs(w * Math.sin(radian) + h * Math.cos(radian))
  }
}