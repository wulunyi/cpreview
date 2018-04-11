// 预览库
import Board, { BoardCtorParam, Status } from "./core/board";
import calcInitStatus, {join as getInitStatus} from "./calc/calc.initstatus";

interface CpreviewCtor {
  new (params: BoardCtorParam): CpreviewClass;
}

interface CpreviewClass {}

export default class Cpreview extends Board implements CpreviewClass {
  private currStatus: Status = getInitStatus();
  private targetStatus: Status = getInitStatus();

  constructor(params: BoardCtorParam) {
    super(params);

    console.log('loading');
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
      
      console.log('done');
    });
  }
}
