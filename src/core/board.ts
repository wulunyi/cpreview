// 画板
import isCanvas from '../utils/iscanvas';
import isImage from '../utils/isimage';
import loadImage from '../utils/loadimage';
import getElementSize from '../utils/elementsize';
import getOfflineCanvas from '../utils/offlinecanvas';
import toInit from '../calc/tointeger';
import { isFunction, isNumber } from 'lodash';
import RotateBoard from './rotateboard';

export interface BoardCtorParam {
  canvas: HTMLCanvasElement; // Element 元素
  src: string | HTMLImageElement; // 资源地址或 img Element
  [propsName: string]: any;
}

interface BoardCtor {
  new (params: BoardCtorParam): BoardClass;
}

interface Point {
  x: number;
  y: number;
}

export interface Status {
  ox: number;
  oy: number;
  scale: number;
  rotate: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

interface BoardClass {
  canvas: HTMLCanvasElement;
  img: HTMLImageElement | null;
  src: string;

  onReady: () => void; // 图片加载完成
  onError: () => void; // 失败时

  draw: (params: Status, fn?: () => void) => void; // 绘制

  coordVToRP: (p: Point) => Point; // 虚拟坐标转换为真实坐标
  coordRToVP: (p: Point) => Point; // 真实坐标转换为虚拟坐标
}

export default class Board implements BoardClass {
  private ctx: CanvasRenderingContext2D;
  private dpr: number = 1; // 设备 dpr
  private ctxW: number = 0; // 绘制面板宽
  private ctxH: number = 0; // 绘制面板高
  private rotateBoard: RotateBoard | null = null;

  // public 数据
  public w: number = 0; // 元素宽
  public h: number = 0; // 元素高
  public sW: number = 0; // 资源文件高度
  public sH: number = 0; // 资源文件宽度

  public canvas: HTMLCanvasElement;
  public img: HTMLImageElement | null = null;
  public src: string;

  constructor(params: BoardCtorParam) {
    if (!isCanvas(params.canvas)) {
      throw new Error('canvas must be HTMLCanvasELement');
    }

    this.canvas = params.canvas;
    this.ctx = <CanvasRenderingContext2D>params.canvas.getContext('2d');

    // 保存数据
    let { w, h } = getElementSize(this.canvas);
    this.w = w;
    this.h = h;

    // 调整 dpr
    this.judgeDpr();

    // 清除下
    this.clear();

    // before ready
    if (isImage(<HTMLImageElement>params.src)) {
      this.img = <HTMLImageElement>(<HTMLImageElement>params.src).cloneNode(
        true
      );
      this.src = this.img.src;

      this.readyofflineCanvas();
    } else {
      this.src = <string>params.src;

      this.toReady(this.src);
    }
  }

  private judgeDpr(dpr?: number) {
    this.dpr = isNumber(dpr) ? dpr : 1; //(window.devicePixelRatio || 1);
    this.ctxW = this.w * this.dpr;
    this.ctxH = this.h * this.dpr;

    // 设置绘制面板的宽高
    this.canvas.width = this.ctxW;
    this.canvas.height = this.ctxH;
  }

  private async toReady(src: string) {
    try {
      this.img = await loadImage(src);
      this.readyofflineCanvas();
    } catch (error) {
      this.onError();
    }
  }

  private readyofflineCanvas() {
    this.rotateBoard = new RotateBoard(<HTMLImageElement>this.img);

    this.sW = (<HTMLImageElement>this.img).width;
    this.sH = (<HTMLImageElement>this.img).height;

    this.onReady();
  }

  onReady() {
    // after img ready
  }

  onError() {
    // when err
  }

  coordVToRP(p: Point) {
    return {
      x: toInit(p.x === 0 ? 0 : p.x / this.dpr),
      y: toInit(p.y === 0 ? 0 : p.y / this.dpr)
    };
  }

  coordRToVP(p: Point) {
    return {
      x: toInit(p.x * this.dpr),
      y: toInit(p.y * this.dpr)
    };
  }

  effDraw(params: Status, fn?: () => void) {
    this.judgeDpr(0.5);

    this.draw(params, fn);
  }

  normalDraw(params: Status, fn?: () => void) {
    this.judgeDpr(1);

    this.draw(params, fn);
  }

  draw(params: Status, fn?: () => void) {
    // 对应到绘制空间坐标
    const { x: vox, y: voy } = this.coordRToVP({ x: params.ox, y: params.oy });
    const { x: vdx, y: vdy } = this.coordRToVP({ x: params.dx, y: params.dy });
    const vdw = toInit(params.dw * this.dpr);
    const vdh = toInit(params.dh * this.dpr);

    this.clear();

    // 保存当前绘制属性设置
    this.ctx.save();

    // 原点
    this.ctx.translate(vox, voy);

    // 缩放
    this.ctx.scale(params.scale, params.scale);

    // 绘制
    this.ctx.drawImage(
      // 旋转
      (<RotateBoard>this.rotateBoard).rotate(toInit(params.rotate)),
      (<RotateBoard>this.rotateBoard).startX,
      (<RotateBoard>this.rotateBoard).startY,
      (<RotateBoard>this.rotateBoard).coverReactW,
      (<RotateBoard>this.rotateBoard).coverReactH,
      vdx,
      vdy,
      vdw,
      vdh
    );

    // 恢复到保存前属性设置
    this.ctx.restore();

    // 执行回调
    isFunction(fn) && fn();

    return this;
  }

  // 以下为绘制的子方法
  private clear() {
    this.ctx.clearRect(0, 0, this.ctxW, this.ctxH);
  }
}
