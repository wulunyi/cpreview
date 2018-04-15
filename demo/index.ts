import * as Hammer from 'hammerjs';

import Cpreview from '../src/cpreview';
import {isNumber} from 'lodash';
import {linearEasingDiff} from '../src/utils/easing';

const hImgSrc = 'https://si.geilicdn.com/bj-IM-320410048-1520394704121-29645018_750_2297.jpg';
const wImgSrc = 'https://si.geilicdn.com/bj-IM-320410048-1523418545326-727807039_1280_960.jpg'


const canvasEl = document.getElementById('canvas');
const hammerEl = new Hammer(<HTMLCanvasElement>canvasEl);

const params = {
  canvas: <HTMLCanvasElement>canvasEl,
  src: wImgSrc
};

// 创建预览面板
const cpreview = new Cpreview(params);

// 设置双击偏差范围
hammerEl.get('doubletap').set({
  posThreshold: 60
});

// 设置最小相应移动的距离
hammerEl.get('pan').set({
  threshold: 0.1,
  direction: Hammer.DIRECTION_ALL
});

let mx:number = 0, my:number = 0;
// 当到达临界值时移动的次数
let moveXCount: number = 0;
let moveYCount: number = 0;

function saveDelta(ev: {deltaX: number, deltaY: number}) {
  mx = ev.deltaX;
  my = ev.deltaY;
}

function dir(value: number) {
  return value < 0 ? -1 : 1;
}

hammerEl.on('panstart', saveDelta);

hammerEl.on('panmove', (ev) => {
  let x = ev.deltaX - mx;
  let y = ev.deltaY - my;

  // 按照当前偏移量移动后需要调整的偏移量
  let afterMoveOffsetX = cpreview.offsetRangeX(x);
  let afterMoveOffsetY = cpreview.offsetRangeY(y);

  // 获取范围
  let oRagneX = cpreview.getRange('x');
  let oRangeY = cpreview.getRange('y');

  if (oRangeY.min === oRangeY.max) {
    y = 0;
  } else if (afterMoveOffsetY !== 0) {
    // 不让继续移动时
    // y = y + afterMoveOffsetY;
    y = dir(y) * 2;
  }

  if (oRagneX.min === oRagneX.max) {
    x = 0;
  } else if (afterMoveOffsetX !== 0) {
    // 不让继续移动时
    // x = x + afterMoveOffsetX
    x = dir(x) * 2;
  }

  if (x !== 0 || y !== 0) {
    cpreview.translate(x, y, true);
  }
  
  saveDelta(ev);
})

hammerEl.on('panend', (ev) => {
  let offsetX = cpreview.offsetRangeX();
  let offsetY = cpreview.offsetRangeY();

  if (offsetX !== 0 || offsetY !== 0) {
    // 归位
    let count = Math.floor(100 / 16);
    let diffX = offsetX / count;
    let diffY = offsetY / count;

    esaingRunRang(count, diffX, diffY);
  }
});

function esaingRunRang(count: number, diffX: number, diffY: number) {
  if (count !== 0 ) {
    cpreview.translate(diffX, diffY, false);

    requestAnimationFrame(() => {
      esaingRunRang(count - 1, diffX, diffY);
    });
  } else {
    let offsetX = cpreview.offsetRangeX();
    let offsetY = cpreview.offsetRangeY();

    cpreview.translate(offsetX, offsetY, false);
  }
}

// @ts-ignore
window.cpreview = cpreview;