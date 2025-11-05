import {colorScheme} from '../moonviewdata.ts'

// const colorScheme = {
//     black: '#222222',
//     gold: '#d4af37',
//     darkGray: '#333333',
//     lightGold: '#f0e68c',
//     border: '#666666',
//     borderHighlight: '#d4af37', // 悬停高亮边框
//     order: {
//       ctrip: '#b8860b',
//       meituan: '#daa520',
//       fliggy: '#f0e68c'
//     }
//   };



// console.log(colorScheme)
  // OTA平台配置
const otaPlatformEnum = [
	{ value: 1, label: '携程', color: colorScheme.order.ctrip },
	{ value: 2, label: '美团', color: colorScheme.order.meituan },
	{ value: 3, label: '飞猪', color: colorScheme.order.fliggy }
];

  // 获取平台名称
  export const getPlatformName = (platform: number) => {
    return otaPlatformEnum.find(item => item.value === platform)?.label || '未知';
  };

  // 获取订单颜色
  export const getOrderColor = (platform: number) => {
    return otaPlatformEnum.find(item => item.value === platform)?.color || colorScheme.gold;
  };

  // 绘制圆角矩形（支持悬停高亮）
  export const drawRoundedRect = (ctx: CanvasRenderingContext2D,x: number,y: number,width: number,height: number,radius: number,fillColor: string,strokeColor: string,lineWidth = 1.5,isHover = false) => {
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

    // 绘制边框（悬停时用高亮色）
    ctx.strokeStyle = isHover ? colorScheme.borderHighlight : strokeColor;
    ctx.lineWidth = isHover ? 2.5 : lineWidth; // 悬停时边框加粗
    ctx.stroke();
  };