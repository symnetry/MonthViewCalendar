import React, { useEffect, useRef } from 'react';
import { createStyles } from 'antd-style';

// 星星接口定义
interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  color: [number, number, number]; // RGB颜色数组
  blinkRate: number;
  blinkPhase: number;
}

// 创建样式
const useStyles = createStyles(() => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 1,
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.75, // 稍微增加透明度使星辰更明显
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // 黑色渐变蒙板，从左到右逐渐减弱
    background: 'linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3))',
    zIndex: 2,
  },
}));

const StarFieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);
  const { styles } = useStyles();

  // 初始化星星
  const initStars = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸，只在父容器内部显示
    const updateCanvasSize = () => {
      const parentElement = canvas.parentElement;
      if (parentElement) {
        canvas.width = parentElement.clientWidth;
        canvas.height = parentElement.clientHeight;
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // 创建500颗星星，增加星辰数量
    const stars: Star[] = [];
    const starCount = 500;
    
    for (let i = 0; i < starCount; i++) {
      // 85%的星星是白色，15%的星星是红色
      const isRedStar = Math.random() < 0.15;
      
      // 计算随机位置
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      
      // 星星半径：0.3 - 1.5（稍微增大星星尺寸）
      const radius = 0.3 + Math.random() * 1.2;
      
      // 星星移动速度：0.05 - 0.4（稍微加快移动速度）
      const speed = 0.05 + Math.random() * 0.35;
      
      // 星星亮度
      let opacity;
      let color;
      
      if (isRedStar) {
        // 红色星星
        const redIntensity = Math.floor(155 + Math.random() * 100); // 155-255
        const otherChannel = Math.floor(Math.random() * 30); // 0-30
        color = [redIntensity, otherChannel, otherChannel];
        opacity = 0.6 + Math.random() * 0.4; // 0.6-1.0
      } else {
        // 白色星星
        const intensity = Math.floor(120 + Math.random() * 80); // 120-200
        color = [intensity, intensity, intensity];
        opacity = 0.4 + Math.random() * 0.6; // 0.4-1.0
      }
      
      // 闪烁效果参数
      const blinkRate = 0.02 + Math.random() * 0.05;
      const blinkPhase = Math.random() * Math.PI;
      
      stars.push({ x, y, radius, speed, opacity, color, blinkRate, blinkPhase });
    }
    
    starsRef.current = stars;
  };

  // 动画函数
  const animate = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新和绘制星星
    starsRef.current.forEach((star) => {
      // 更新闪烁效果
      star.blinkPhase += star.blinkRate;
      const blinkFactor = 0.5 + 0.5 * Math.sin(star.blinkPhase);
      
      // 更新星星位置（向下移动）
      star.y += star.speed;
      
      // 如果星星移出画布底部，重新放置到顶部
      if (star.y > canvas.height) {
        star.y = -star.radius;
        star.x = Math.random() * canvas.width;
      }
      
      // 绘制星星
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${star.opacity * blinkFactor})`;
      ctx.fill();
    });
    
    // 继续动画
    animationRef.current = requestAnimationFrame(() => animate(canvas));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // 初始化星星
    initStars(canvas);
    
    // 开始动画
    animationRef.current = requestAnimationFrame(() => animate(canvas));
    
    // 清理函数
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', () => {
        if (canvas && canvas.parentElement) {
          canvas.width = canvas.parentElement.clientWidth;
          canvas.height = canvas.parentElement.clientHeight;
        }
      });
    };
  }, []);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.overlay} />
    </div>
  );
};

export default StarFieldCanvas;