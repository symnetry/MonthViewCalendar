import { CellData, GridPosition } from '../types';
import { isPointInRect } from './canvasUtils';

// 构建订单网格索引（用于优化碰撞检测）
export const buildOrderGridIndex = (
  tablePanel: CellData[][],
  gridPositionsRef: GridPosition[][],
  GRID_SIZE: number
): Map<string, CellData[]> => {
  const gridMap = new Map<string, CellData[]>();

  tablePanel.forEach(row => {
    row.forEach(cell => {
      if (cell.type === 'order' && cell.hasorder) {
        const pos = gridPositionsRef[cell.row]?.[cell.col];
        if (pos) {
          const gridX = Math.floor(pos.x / GRID_SIZE);
          const gridY = Math.floor(pos.y / GRID_SIZE);
          const gridKey = `${gridX},${gridY}`;

          if (!gridMap.has(gridKey)) {
            gridMap.set(gridKey, []);
          }
          gridMap.get(gridKey)!.push(cell);
        }
      }
    });
  });

  return gridMap;
};

// 优化的碰撞检测（通过网格索引快速定位）
export const optimizeHitDetection = (
  mouseX: number,
  mouseY: number,
  gridMap: Map<string, CellData[]>,
  gridPositionsRef: GridPosition[][],
  GRID_SIZE: number
): { row: number; col: number } | null => {
  const gridX = Math.floor(mouseX / GRID_SIZE);
  const gridY = Math.floor(mouseY / GRID_SIZE);
  const gridKey = `${gridX},${gridY}`;

  // 检查当前网格及相邻网格
  const candidateOrders: CellData[] = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const nearbyKey = `${gridX + i},${gridY + j}`;
      const ordersInGrid = gridMap.get(nearbyKey);
      if (ordersInGrid) candidateOrders.push(...ordersInGrid);
    }
  }

  // 精确检测候选订单
  for (const cell of candidateOrders) {
    const pos = gridPositionsRef[cell.row]?.[cell.col];
    if (pos && isPointInRect(mouseX, mouseY, pos.x, pos.y, pos.width, pos.height)) {
      return { row: cell.row, col: cell.col };
    }
  }

  return null;
};