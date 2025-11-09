import React, { useRef, useEffect } from 'react';
import { createStyles } from 'antd-style';

const useStyles = createStyles(() => {
  return {
    canvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      opacity: 0.65,
    },
  };
});

interface Star {
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
}

const StarFieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { styles } = useStyles();
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>();

  // 创建星星
  const createStars = (count: number) => {
    const stars: Star[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return stars;

    for (let i = 0; i < count; i++) {
      // 随机生成不同亮度和大小的星星
      const radius = Math.random() * 1.5;
      let color: string;
      
      const brightness = Math.floor(Math.random() * 80 + 200); // 120-200
      color = `rgb(${brightness}, ${brightness}, ${brightness})`;
      
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius,
        color,
        speed: Math.random() * 0.3 + 0.05, // 0.05-0.35，稍慢的速度更有EVA的压抑感
      });
    }
    return stars;
  };

  // 绘制星星
  const drawStars = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制每颗星星
    starsRef.current.forEach((star) => {
      // 随机闪烁效果
      const flickerFactor = 0.8 + Math.random() * 0.2;
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * flickerFactor, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.fill();
      
      // 移动星星（模拟星空流动）
      star.y -= star.speed;
      // 当星星移出画布顶部时，重新放置到底部
      if (star.y < -star.radius) {
        star.y = canvas.height + star.radius;
        star.x = Math.random() * canvas.width;
      }
    });

    // 请求下一帧
    animationFrameRef.current = requestAnimationFrame(drawStars);
  };

  // 处理窗口大小变化
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // 设置canvas大小为父容器大小
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 初始化画布大小
    handleResize();
    
    starsRef.current = createStars(500); 
    
    // 开始动画
    drawStars();
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    
    // 清理函数
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default StarFieldCanvas;