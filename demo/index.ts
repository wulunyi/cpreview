import loadImg from '../src/utils/loadimage';
import Board from '../src/core/board';
import Cpreview from '../src/cpreview';

const testSrc = 'https://si.geilicdn.com/bj-IM-160326222-1523169525533-443806348-unadjust_691_256.jpg?w=691&h=691';

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

const params = {
  canvas: <HTMLCanvasElement>canvasEle,
  src: testSrc
};

const board = new Cpreview(params);

// @ts-ignore
window.board = board;