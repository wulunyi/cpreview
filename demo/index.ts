import loadImg from '../src/utils/loadimage';
import Board from '../src/core/board';
import Cpreview from '../src/cpreview';

const hImgSrc = 'https://si.geilicdn.com/bj-IM-320410048-1520394704121-29645018_750_2297.jpg?w=750&h=750';
const wImgSrc = 'https://si.geilicdn.com/bj-IM-320410048-1523418545326-727807039_1280_960.jpg?w=1280&h=1280'
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
  src: hImgSrc
};

const board = new Cpreview(params);

// @ts-ignore
window.board = board;