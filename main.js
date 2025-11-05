const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true, // 确保渲染进程可以使用Node.js
      contextIsolation: false, // 如果之后需要使用Electron API，可能需要关闭上下文隔离
      webSecurity: false, // 禁用web安全策略，便于本地文件加载（开发阶段可选）
    },
  });

  // 判断是开发环境还是生产环境
  console.log("check env ",process.env.NODE_ENV)
  // if (process.env.NODE_ENV === 'development') {
  //   // 开发环境：加载本地开发服务器地址
  //   mainWindow.loadURL('http://localhost:8000'); // 确保端口与Ant Design Pro开发服务器一致
  //   // 可以打开开发者工具方便调试
  //   mainWindow.webContents.openDevTools();
  // } else {
  //   // 生产环境：加载打包后的静态文件
  //   // 假设Ant Design Pro打包后输出到'dist'目录，并且入口为'index.html'
  //   mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  // }

    mainWindow.loadURL('http://localhost:8000'); // 确保端口与Ant Design Pro开发服务器一致
    // 可以打开开发者工具方便调试
    mainWindow.webContents.openDevTools();
}

// 应用准备就绪后创建窗口
app.whenReady().then(createWindow);

// 当所有窗口关闭时退出应用（macOS除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// macOS上当应用被激活时（例如点击dock图标），如果没有窗口，则重新创建
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});