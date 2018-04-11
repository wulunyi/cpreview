// 画板
import isCanvas from '../utils/iscanvas';
import isImage from '../utils/isimage';
import loadImage from '../utils/loadimage';
import getElementSize from '../utils/elementsize';
import getOfflineCanvas from '../utils/offlinecanvas';

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
  ox: number,
  oy: number,
  scale: number,
  rotate: number;
  sx: number;
  sy: number;
}

interface BoardClass {
  canvas: HTMLCanvasElement;
  img: HTMLImageElement|null;
  src: string;

  onReady: () => void; // 图片加载完成
  onError: () => void; // 失败时
  
  draw: (params: Status) => void; // 绘制

  coordVToRP: (p: Point) => Point; // 虚拟坐标转换为真实坐标
  coordRToVP: (p: Point) => Point; // 真实坐标转换为虚拟坐标
}

export default class Board implements BoardClass{
  private ctx: CanvasRenderingContext2D;
  private dpr: number = 1; // 设备 dpr
  private w: number = 0; // 元素宽
  private h: number = 0; // 元素高
  private ctxW: number = 0; // 绘制面板宽
  private ctxH: number = 0; // 绘制面板高
  private sW: number = 0; // 资源文件高度
  private sH: number = 0; // 资源文件宽度
  private offlineCanvas: HTMLCanvasElement | null = null;

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
    let {w, h} = getElementSize(this.canvas);
    this.dpr = window.devicePixelRatio || 1;
    this.w = w;
    this.h = h;
    this.ctxW = w * this.dpr;
    this.ctxH = h * this.dpr;

    // 设置绘制面板的宽高
    this.canvas.width = this.ctxW;
    this.canvas.height = this.ctxH;

    // 清除下
    this.clear();

    // before ready
    if (isImage(<HTMLImageElement>params.src)) {
      this.img = <HTMLImageElement>(<HTMLImageElement>params.src).cloneNode(true);
      this.src = this.img.src;

      this.readyofflineCanvas();
    } else {
      this.src = <string>params.src;

      this.toReady(this.src);
    }
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
    this.sW = (<HTMLImageElement>this.img).width;
    this.sH = (<HTMLImageElement>this.img).height;

    this.offlineCanvas = getOfflineCanvas({
      img: <HTMLImageElement>this.img,
      sw: this.sW,
      sh: this.sH
    });

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
      x: p.x === 0 ? 0 : p.x / this.dpr,
      y: p.y === 0 ? 0 : p.y / this.dpr
    }
  }

  coordRToVP(p: Point) {
    return {
      x: p.x * this.dpr,
      y: p.y * this.dpr
    }
  }

  draw(params: Status) {
    this.clear();
    // 保存当前绘制属性设置
    this.ctx.save();

    // 原点
    this.ctx.translate(params.ox, params.oy);
    // 缩放
    this.ctx.scale(params.scale, params.scale);
    // 旋转
    this.ctx.rotate(params.rotate * Math.PI / 180);
    // 绘制
    this.ctx.drawImage(<HTMLCanvasElement>this.offlineCanvas, 0, 0, this.sW, this.sH, 0, 0, this.w, this.h);

    // 恢复到保存前属性设置
    this.ctx.restore();
  }

  // 以下为绘制的子方法
  private clear() {
    this.ctx.clearRect(0, 0, this.ctxW, this.ctxH);
  }
}
