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
      dw: this.w,
      dh: this.h
    });

    this.draw(this.targetStatus, () => {
      this.currStatus = Object.assign({}, this.targetStatus);
      this.initStatus = Object.assign({}, this.targetStatus);

      Promise.resolve().then(() => {
        // 触发完成事件
        console.log('done currStatus', status);
      });
    });
  }

  onError() {
    Promise.resolve().then(() => {
      console.log('load error');
    });
  }

  translate(
    mx: number,
    my: number,
    soft: boolean,
    done?: (status: Status) => void
  ) {
    this.transform(mx, my, 0, 1, soft, done);
  }

  rotate(angle: number, soft: boolean, done?: (status: Status) => void) {
    this.transform(0, 0, angle, 1, soft, done);
  }

  scale(scale: number, soft: boolean, done?: (status: Status) => void) {
    this.transform(0, 0, 0, scale, soft, done);
  }

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

    this.draw(this.targetStatus, () => {
      this.currStatus = Object.assign({}, this.targetStatus);

      isFunction(done) && done(this.targetStatus);
    });
  }
}
