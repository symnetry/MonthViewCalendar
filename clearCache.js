// 清除moonview相关的localStorage数据，用于浏览器环境
if (typeof window !== 'undefined') {
  window.localStorage.removeItem('moonview_orders');
  window.localStorage.removeItem('moonview_rooms');
  console.log('已清除moonview的localStorage数据（浏览器环境）');
} else {
  // Node.js环境下的模拟localStorage清除
  console.log('在Node.js环境下运行，无法直接清除浏览器localStorage');
  console.log('请在浏览器开发者工具控制台执行以下命令清除数据：');
  console.log('localStorage.removeItem("moonview_orders"); localStorage.removeItem("moonview_rooms");');
}