// 缓动函数库
export function linearEasingDiff(
  percentComplete: number,
  startValue: number,
  endValue: number,
  currValue: number
): number {
  return percentComplete * (endValue - startValue) - currValue;
}
