// 预览库
import Board, {BoardCtorParam, Status} from './core/board';

interface CpreviewCtor {
  new (params: BoardCtorParam): CpreviewClass;
}

interface CpreviewClass {

}

export default class Cpreview extends Board implements CpreviewClass {
  private currStatus: Status = {
    ox: 0,
    oy: 0,
    sx: 0,
    sy: 0,
    scale: 1,
    rotate: 0,
  };

  private targetStatus: Status | null = null;

  constructor(params: BoardCtorParam) {
    super(params);
  }

  onReady() {
    this.draw(this.currStatus);
  }
}