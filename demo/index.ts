import * as Hammer from 'hammerjs';

import loadImg from '../src/utils/loadimage';
import Board from '../src/core/board';
import Cpreview from '../src/cpreview';
import {isNumber} from 'lodash';

const hImgSrc = 'https://si.geilicdn.com/bj-IM-320410048-1520394704121-29645018_750_2297.jpg';
const wImgSrc = 'https://si.geilicdn.com/bj-IM-320410048-1523418545326-727807039_1280_960.jpg?w=100&h=100'
// async function testLoadImg(src: string): Promise<any> {
//   try {
//     let imgEle: HTMLImageElement = await loadImg(src);
//     document.body.appendChild(imgEle);
//     console.log(imgEle);
//   } catch (error) {
//     console.log(error);
//   }
// }

// testLoadImg(testSrc);


const canvasEle = document.getElementById('canvas');

const hammerEl = new Hammer(<HTMLCanvasElement>canvasEle);

const params = {
  canvas: <HTMLCanvasElement>canvasEle,
  src: hImgSrc
};

const board = new Cpreview(params);

// 设置双击偏差范围
hammerEl.get('doubletap').set({
  posThreshold: 60
});

// 设置最小相应移动的距离
hammerEl.get('pan').set({
  threshold: 1,
  direction: Hammer.DIRECTION_ALL
});

// 'panstart': this._panStart.bind(this),
//       'panmove': this._panMove.bind(this),
//       'panend': this._panEnd.bind(this)
let mx:number, my:number;

hammerEl.on('panmove', (ev) => {
  if (!isNumber(mx)) {
    mx = ev.deltaX;
  }
  if (!isNumber(my)) {
    my = ev.deltaY;
  }

  board.translate(ev.deltaX - mx, ev.deltaY - my, true);

  mx = ev.deltaX;
  my = ev.deltaY;
})

hammerEl.on('panend', (ev) => {
  let offsetX = board.offsetRangeX();
  let offsetY = board.offsetRangeY();
  board.translate(offsetX, offsetY, false);

  mx = 0;
  my = 0;
})


// @ts-ignore
window.board = board;