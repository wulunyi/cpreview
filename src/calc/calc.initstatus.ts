// 计算初始值
import { Status } from '../core/board';
import calcShape from './calc.shape';

export interface Params {
  sw: number;
  sh: number;
  w: number;
  h: number;
  rotate?: number;
}

export interface JoinParamsInterface {
  ox?: number;
  oy?: number;
  dx?: number;
  dy?: number;
  dw?: number;
  dh?: number;
  scale?: number;
  rotate?: number;
}

export function join(params?: JoinParamsInterface): Status {
  let init = {
    ox: 0,
    oy: 0,
    dx: 0,
    dy: 0,
    dw: 0,
    dh: 0,
    scale: 1,
    rotate: 0
  };

  return {
    ...init,
    ...params
  };
}

/**
 * 矫正旋转角度
 * @param angle 角度
 */
function judgeAngle(angle: number): number {
  let m = Math.floor(angle / 90);
  let mod = angle % 90;

  return m * 90 + (mod >= 45 ? 90 : 0);
}

export default function caclInitStatus(params: Params): Status {
  // 形状
  let shape = calcShape(params.sw, params.sh);
  let rotate = 0;

  if (params.rotate) {
    rotate = judgeAngle(params.rotate % 360);
  }

  // 旋转后的形状
  let r = (rotate / 90) % 2 === 1 ? -1 : 1;

  let drawh = params.sh * params.w / params.sw;
  let draww = params.sw * params.w / params.sh;

  let baseStatus = {
    ox: params.w / 2,
    oy: params.h / 2,
    rotate
  };

  if (shape === -1 && r === 1) {
    baseStatus = Object.assign(baseStatus, {
      dx: -params.w / 2,
      dy: -params.h / 2,
      dw: params.w,
      dh: drawh,
    });
  } else if (shape === -1 && r === -1) {
    baseStatus = Object.assign(baseStatus, {
      
    });
  } else if (shape === 1 && r === 1) {
    baseStatus = Object.assign(baseStatus, {
      dx: -params.w / 2,
      dy: -drawh / 2,
      dw: params.w,
      dh: drawh,
    })
  } else if (shape === 1 && r === -1) {
    let dx = -Math.sqrt((Math.pow(params.w / 2, 2) + Math.pow(params.h / 2, 2)) / (1 + Math.pow(params.w/params.h, 2)));
    let dy = params.w * dx / params.h;

    baseStatus = Object.assign(baseStatus, {
      dx: dx,
      dy: dy,
      dw: draww,
      dh: params.w
    });
  }

  return join(baseStatus);
}
