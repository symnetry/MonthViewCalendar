import { colorScheme } from '../constants';

// 绘制圆角矩形
export const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillColor: string,
  strokeColor: string,
  lineWidth = 1.5,
  isHover = false
): void => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();

  // 填充背景
  ctx.fillStyle = fillColor;
  ctx.fill();

  // 绘制边框（悬停时高亮）
  ctx.strokeStyle = isHover ? colorScheme.borderHighlight : strokeColor;
  ctx.lineWidth = isHover ? 2.5 : lineWidth;
  ctx.stroke();
};
