import {isString} from 'lodash';

interface LoadImageFunc {
  (src: string): Promise<HTMLImageElement>;
}

/**
 * @description 加载图片资源
 * @param src 图片资源 url
 * @param timeout 超时时间
 */
let loadImage: LoadImageFunc = function (src: string, timeout: number = 5000) {
  if (!isString(src)) {
    src = '';
    console.warn('参数不和法');
  }
  
  return new Promise((resolve, reject) => {
    // 创建图片标签
    let imgEle: HTMLImageElement = document.createElement('img');

    // 处理回调函数
    let loadCB = function (): void {
      clearTimeout(timer);
      resolve(imgEle);
    }
    
    let errCB = function (): void {
      clearTimeout(timer);
      reject(new Error('load image err'));
    }
    
    // 设置超时
    let timer = setTimeout(() => {
      reject(new Error('time out'));
      // 解除事件绑定
      imgEle.removeEventListener('load', loadCB);
      imgEle.removeEventListener('error', errCB);
    }, 5000);

    // 绑定事件
    imgEle.addEventListener('load', loadCB);
    imgEle.addEventListener('error', errCB);
    
    // 开始加载
    imgEle.src = src;
  
    // 从缓存中取图片的时候
    if (imgEle.complete) {
      loadCB();
    }
  });
}

export default loadImage;
