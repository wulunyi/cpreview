// 离屏 canvas 管理

import isImage from '../utils/isimage';
import getOfflineCanvas from '../utils/offlinecanvas';
import toInit from '../calc/tointeger';
import coverReact from '../utils/coverreact';

interface RotateBoardCtor {
  new (imgEl: HTMLImageElement): RotateBoardClass;
}

interface RotateBoardClass {
  rotate: (angle: number) => HTMLCanvasElement;

  coverReactW: number; // 覆盖原始资源的矩形 width
  coverReactH: number; // 覆盖原始资源的矩形 height
  startX: number; // coverReact 左上角 x 坐标
  startY: number; // coverReact 左上角 y 坐标
}

/**
 * 正方形离屏幕 canvas 负责旋转
 */
export default class RotateBoard implements RotateBoardClass {
  public canvas: HTMLCanvasElement = document.createElement('canvas');

  private ctx: CanvasRenderingContext2D;
  private resource: HTMLCanvasElement;
  private angle: number | null = null;
  private ox: number = 0;
  private oy: number = 0;
  private dx: number = 0;
  private dy: number = 0;
  private or: number = 0; // 覆盖图片的半径

  public outW: number = 0;
  public outH: number = 0;
  public inW: number = 0;
  public inH: number = 0;

  constructor(imgEl: HTMLImageElement) {
    if (!isImage(imgEl)) {
      throw new Error('imgEl must be img tag');
    }

    this.inW = imgEl.width;
    this.inH = imgEl.height;

    // 半径
    this.or = Math.ceil(
      Math.sqrt(Math.pow(this.inH, 2) + Math.pow(this.inH, 2)) / 2
    );

    // 正方形
    this.outH = this.outW = this.or * 2;

    // 原点
    this.ox = this.oy = toInit(this.outW / 2);

    // 绘制点
    this.dx = -toInit(this.inW / 2);
    this.dy = -toInit(this.inH / 2);

    // 设置面板宽度
    this.canvas.width = this.outW;
    this.canvas.height = this.outH;

    // 获取面板宽度
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');

    // 资源文件缓存
    this.resource = getOfflineCanvas({
      img: <HTMLImageElement>imgEl,
      sw: this.inW,
      sh: this.inH
    });
  }

  // 求最小覆盖面积矩形宽高
  public get coverReactW() {
    return coverReact(this.inW, this.inH, <number>this.angle).width;
  }

  public get coverReactH() {
    return coverReact(this.inW, this.inH, <number>this.angle).height;
  }

  // 求最小覆盖面积矩形在 canvas 坐标系上的起点
  public get startX(): number {
    return toInit((this.outW - this.coverReactW) / 2);
  }

  public get startY(): number {
    return toInit((this.outH - this.coverReactH) / 2);
  }

  rotate(angle: number) {
    if (angle === this.angle && this.angle !== null) {
      return this.canvas;
    }
    this.angle = angle;

    this.ctx.clearRect(0, 0, this.outW, this.outH);

    this.ctx.save();

    this.ctx.translate(this.ox, this.oy);
    this.ctx.rotate(angle * Math.PI / 180);
    this.ctx.drawImage(
      this.resource,
      0,
      0,
      this.inW,
      this.inH,
      this.dx,
      this.dy,
      this.inW,
      this.inH
    );
    this.ctx.restore();

    return <HTMLCanvasElement>this.canvas;
  }
}
