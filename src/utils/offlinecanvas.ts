// 绘制离屏 canvas
interface Params {
  img: HTMLImageElement;
  sw: number;
  sh: number;
}

export default function offlineCanvas(params: Params): HTMLCanvasElement {
  let canvas = document.createElement('canvas');
  let ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');

  canvas.width = params.sw;
  canvas.height = params.sh;

  ctx.translate(params.sw / 2, params.sh / 2);

  ctx.drawImage(params.img, -params.sw / 2, -params.sh / 2, params.sw, params.sh);

  return canvas;
}
