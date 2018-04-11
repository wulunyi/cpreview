// 计算初始值
import { Status } from "../core/board";
import calcShape from "./calc.shape";

export interface Params {
  sw: number;
  sh: number;
  dw: number;
  dh: number;
}

export interface JoinParamsInterface {
  ox?: number;
  oy?: number;
  sx?: number;
  sy?: number;
  dw?: number;
  dh?: number;
  scale?: number;
  rotate?: number;
}

export function join(params?: JoinParamsInterface): Status {
  let init = {
    ox: 0,
    oy: 0,
    sx: 0,
    sy: 0,
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

export default function caclInitStatus(params: Params): Status {
  let shape = calcShape(params.sw, params.sh);
  let drawh = params.sh * params.dw / params.sw;

  if (shape === -1) {
    return join({
      ox: params.dw / 2,
      oy: params.dh / 2,
      sx: -params.dw / 2,
      sy: -params.dh / 2,
      dw: params.dw,
      dh: drawh
    });
  }

  return join({
    ox: params.dw / 2,
    oy: params.dh / 2,
    sx: -params.dw / 2,
    sy: -drawh / 2,
    dw: params.dw,
    dh: drawh
  });
}
