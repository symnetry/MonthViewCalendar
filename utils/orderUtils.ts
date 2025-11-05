    // 检查选择区域是否包含订单
  export  const checkIfSelectionContainsOrder = useCallback((selectedCells: CellData[]) => {
      if (!selectedCells.length) return false;
      
      const { cellWidth, cellHeight, spacing } = canvasConfig;
      
      // 计算选择区域的边界
      const minRow = Math.min(...selectedCells.map(cell => cell.rowIndex));
      const maxRow = Math.max(...selectedCells.map(cell => cell.rowIndex));
      const minCol = Math.min(...selectedCells.map(cell => cell.colIndex));
      const maxCol = Math.max(...selectedCells.map(cell => cell.colIndex));

      // 检查订单是否与选择区域重叠
      let hasOverlap = false;
      orderGridMap.current.forEach((pos) => {
        const orderRow = Math.floor(pos.y / (cellHeight + spacing));
        const orderCol = Math.floor(pos.x / (cellWidth + spacing));
        
        if (
          orderRow >= minRow &&
          orderRow <= maxRow &&
          orderCol >= minCol &&
          orderCol <= maxCol
        ) {
          hasOverlap = true;
        }
      });
      
      return hasOverlap;
    }, []);