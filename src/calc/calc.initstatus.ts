// 计算初始值
import { Status } from '../core/board';
import calcShape from './calc.shape';
import coverReact from '../utils/coverreact';

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
  let rotate = 0;

  if (params.rotate) {
    rotate = judgeAngle(params.rotate % 360);
  }

  // 求旋转后覆盖矩形的最小矩形
  let {width, height} = coverReact(params.sw, params.sh,rotate );
  let shape = calcShape(width, height);

  let drawh = height * params.w / width;

  let baseStatus = {
    ox: params.w / 2,
    oy: params.h / 2,
    rotate
  };

  if (shape === -1) {
    baseStatus = Object.assign(baseStatus, {
      dx: -params.w / 2,
      dy: -params.h / 2,
      dw: params.w,
      dh: drawh,
    });
  } else if (shape === 1) {
    baseStatus = Object.assign(baseStatus, {
      dx: -params.w / 2,
      dy: -drawh / 2,
      dw: params.w,
      dh: drawh,
    })
  }

  return join(baseStatus);
}
