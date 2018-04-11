export default function toInit(num: number): number {
  return +(Math.floor(num * 100) / 100).toFixed(0);
}
