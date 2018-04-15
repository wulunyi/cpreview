// 预览库
import Board, { BoardCtorParam, Status } from './core/board';
import calcInitStatus, {
  join as getInitStatus,
  JoinParamsInterface
} from './calc/calc.initstatus';
import { isFunction } from 'lodash';

interface CpreviewCtor {
  new (params: BoardCtorParam): CpreviewClass;
}

interface CoordRange {
  min: number;
  max: number;
}

interface CpreviewClass {
  translate: (mx: number, my: number, soft: boolean, done?: () => void) => void;
  rotate: (angle: number, soft: boolean, done?: () => void) => void;
  scale: (scale: number, soft: boolean, done?: () => void) => void;
  transform: (
    mx: number,
    my: number,
    angle: number,
    scale: number,
    soft: boolean,
    done?: () => void
  ) => void;
  offsetRangeX: (addX?: number) => number;
  offsetRangeY: (addY?: number) => number;
  offsetRange: (name: 'x' | 'y', add?: number) => number;
  getRange: (name: 'x' | 'y') => { min: number; max: number };
}

export default class Cpreview extends Board implements CpreviewClass {
  private initStatus: Status = getInitStatus();
  private currStatus: Status = getInitStatus();
  private targetStatus: Status = getInitStatus();

  constructor(params: BoardCtorParam) {
    super(params);

    // 开始加载
    Promise.resolve().then(() => {
      console.log('loading');
    });
  }

  onReady() {
    this.targetStatus = calcInitStatus({
      sw: this.sW,
      sh: this.sH,
      w: this.w,
      h: this.h,
      rotate: 0
    });

    this.draw(this.targetStatus, () => {
      this.currStatus = Object.assign({}, this.targetStatus);
      this.initStatus = Object.assign({}, this.targetStatus);

      Promise.resolve().then(() => {
        // 触发完成事件
        console.log('done currStatus', this.currStatus);
      });
    });
  }

  onError() {
    Promise.resolve().then(() => {
      console.log('load error');
    });
  }

  /**
   * 移动
   * @param mx x 移动量
   * @param my y 移动量
   * @param soft 是否弹性调整到目标
   * @param done 完成操作回调
   */
  translate(
    mx: number,
    my: number,
    soft: boolean,
    done?: (status: Status) => void
  ) {
    this.transform(mx, my, 0, 1, soft, done);
  }

  /**
   * 旋转
   * @param angle 旋转角度
   * @param soft 是否弹性调整到目标状态
   * @param done 完成操作回调
   */
  rotate(angle: number, soft: boolean, done?: (status: Status) => void) {
    this.transform(0, 0, angle, 1, soft, done);
  }

  /**
   * 缩放
   * @param scale 缩放倍数
   * @param soft 是否弹性调整到目标倍数
   * @param done 完成回调
   */
  scale(scale: number, soft: boolean, done?: (status: Status) => void) {
    this.transform(0, 0, 0, scale, soft, done);
  }

  /**
   * 变换
   * @param mx x 移动量
   * @param my y 移动量
   * @param angle 旋转角度
   * @param scale 缩放倍数
   * @param soft 是否弹性调整到目标状态
   * @param done 完成回调
   */
  transform(
    mx: number,
    my: number,
    angle: number,
    scale: number,
    soft: boolean,
    done?: (status: Status) => void
  ) {
    this.targetStatus = Object.assign(this.currStatus, {
      ox: this.currStatus.ox + mx,
      oy: this.currStatus.oy + my,
      rotate: this.currStatus.rotate + angle,
      scale: this.currStatus.scale * scale
    });

    (soft ? this.effDraw : this.normalDraw).call(
      this,
      this.targetStatus,
      () => {
        this.currStatus = Object.assign({}, this.targetStatus);

        isFunction(done) && done(this.targetStatus);
      }
    );
  }

  public getRange(name: 'x' | 'y'): { min: number; max: number } {
    let Range = { min: 0, max: 0 };
    let lName: 'dw' | 'dh' = name === 'x' ? 'dw' : 'dh';

    let dl: number = this.currStatus[lName];
    let scale: number = this.currStatus.scale;

    // 轴长度
    let sideL = name === 'x' ? this.w : this.h;

    if (dl * scale > sideL) {
      Range.min = sideL - dl * scale;
    }

    return Range;
  }

  public offsetRange(name: 'x' | 'y', add?: number): number {
    let Range = this.getRange(name);
    let oName: 'ox' | 'oy' = name === 'x' ? 'ox' : 'oy';
    let op: number = this.currStatus[oName] + (add ? add : 0);
    let scale: number = this.currStatus.scale;
    let pName: 'dx' | 'dy' = name === 'x' ? 'dx' : 'dy';
    let dp: number = this.currStatus[pName];

    // 起点实际坐标
    let realyP = dp * scale - -op;

    // 次判断需重新判断
    if (
      Range.min === Range.max &&
      realyP >= 0 &&
      realyP <= (name === 'x' ? this.w : this.h)
    ) {
      return 0;
    }

    if (realyP < Range.min) {
      return Range.min - realyP;
    } else if (realyP > Range.max) {
      return Range.max - realyP;
    }

    return 0;
  }

  /**
   * 获取 x 轴矫正偏移值
   */
  offsetRangeX(addX?: number) {
    return this.offsetRange('x', addX);
  }

  /**
   * 获取 y 轴矫正偏移值
   */
  offsetRangeY(addY?: number) {
    return this.offsetRange('y', addY);
  }
}
