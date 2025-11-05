// components/CustomScrollbar/index.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './index.less';

const CustomScrollbar = ({ 
  children, 
  className = '', 
  style = {}, 
  height = '400px',
  throttleDelay = 16, // 默认16ms，约60fps
  updateThreshold = 0.01, // 状态更新阈值，避免微小变化触发更新
  enableViewportCheck = true // 是否启用可视区域检查
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);
  const contentRef = useRef(null);
  const thumbRef = useRef(null);
  const scrollLineRef = useRef(null);
  const isDragging = useRef(false);
  const rafId = useRef(null);
  const resizeObserverRef = useRef(null);
  const intersectionObserverRef = useRef(null);
  const lastScrollProgress = useRef(0);
  const lastUpdateTime = useRef(0);

  // 可视区域检查 Hook
  const useIsInViewport = (ref, enabled = true) => {
    useEffect(() => {
      if (!enabled || !ref.current) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInViewport(entry.isIntersecting);
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        }
      );
      
      observer.observe(ref.current);
      intersectionObserverRef.current = observer;
      
      return () => {
        if (intersectionObserverRef.current) {
          intersectionObserverRef.current.disconnect();
        }
      };
    }, [ref, enabled]);
  };

  // 应用可视区域检查
  useIsInViewport(contentRef, enableViewportCheck);

  // 使用 useCallback 优化函数，避免不必要的重渲染
  const updateScrollThumb = useCallback(() => {
    if (!contentRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    
    // 检查是否需要显示滚动条
    const needsScrollbar = scrollHeight > clientHeight + 1; // 添加容差
    setIsVisible(needsScrollbar);
    
    if (!needsScrollbar) {
      // 只有当变化超过阈值时才更新状态
      if (Math.abs(0 - lastScrollProgress.current) > updateThreshold) {
        setScrollProgress(0);
        lastScrollProgress.current = 0;
      }
      if (thumbRef.current) {
        thumbRef.current.style.setProperty('--p', 0);
      }
      return;
    }
    
    // 避免除数为0或负数
    const maxScroll = Math.max(1, scrollHeight - clientHeight);
    const newScrollProgress = Math.min(1, Math.max(0, scrollTop / maxScroll));
    
    // 条件性更新状态：只有当变化超过阈值时才更新
    if (Math.abs(newScrollProgress - lastScrollProgress.current) > updateThreshold) {
      setScrollProgress(newScrollProgress);
      lastScrollProgress.current = newScrollProgress;
    }
    
    // 直接更新滑块的CSS变量
    if (thumbRef.current) {
      thumbRef.current.style.setProperty('--p', newScrollProgress);
    }
  }, [updateThreshold]);

  // 带节流的滚动处理
  const handleScroll = useCallback(() => {
    const now = Date.now();
    
    // 如果不在视口内，不处理滚动
    if (enableViewportCheck && !isInViewport) return;
    
    // 节流处理
    if (now - lastUpdateTime.current < throttleDelay) {
      return;
    }
    
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    
    rafId.current = requestAnimationFrame(() => {
      updateScrollThumb();
      lastUpdateTime.current = now;
    });
  }, [updateScrollThumb, throttleDelay, isInViewport, enableViewportCheck]);

  // 使用 useCallback 优化事件处理函数
  const handleThumbMouseDown = useCallback((e) => {
    isDragging.current = true;
    document.body.style.userSelect = 'none';
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // 使用节流优化鼠标移动处理
  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current || !contentRef.current || !scrollLineRef.current) return;
    
    // 节流处理
    const now = Date.now();
    if (now - lastUpdateTime.current < throttleDelay) {
      return;
    }
    
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    
    rafId.current = requestAnimationFrame(() => {
      const scrollLineRect = scrollLineRef.current.getBoundingClientRect();
      const mouseY = e.clientY - scrollLineRect.top;
      let percentage = mouseY / scrollLineRect.height;
      
      // 限制百分比在0到1之间
      percentage = Math.max(0, Math.min(1, percentage));
      
      // 根据百分比设置内容滚动位置
      const maxScroll = contentRef.current.scrollHeight - contentRef.current.clientHeight;
      const scrollTop = percentage * maxScroll;
      contentRef.current.scrollTop = scrollTop;
      
      lastUpdateTime.current = now;
    });
  }, [throttleDelay]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.userSelect = '';
  }, []);

  // 滚动到顶部
  const scrollToTop = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // 强制更新滚动条（用于外部调用）
  const forceUpdate = useCallback(() => {
    updateScrollThumb();
  }, [updateScrollThumb]);

  useEffect(() => {
    // 添加防抖的resize处理
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateScrollThumb, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // 使用 ResizeObserver 替代 MutationObserver，性能更好
    resizeObserverRef.current = new ResizeObserver(() => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(updateScrollThumb);
    });
    
    if (contentRef.current) {
      resizeObserverRef.current.observe(contentRef.current);
    }
    
    // 延迟初始化，确保内容完全加载
    const initTimer = setTimeout(updateScrollThumb, 300);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      clearTimeout(initTimer);
      
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [updateScrollThumb]);

  // 单独处理全局鼠标事件，避免重复绑定/解绑
  useEffect(() => {
    if (isDragging.current) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging.current, handleMouseMove, handleMouseUp]);

  // 当元素进入视口时更新滚动条
  useEffect(() => {
    if (isInViewport) {
      updateScrollThumb();
    }
  }, [isInViewport, updateScrollThumb]);

  return (
    <div 
      className={`${styles.customScrollWrapper} ${className}`} 
      style={{ ...style, height }}
    >
      <div 
        ref={contentRef}
        className={styles.scrollContent}
        onScroll={handleScroll}
      >
        {children}
      </div>
      
      {isVisible && (
        <div 
          ref={scrollLineRef}
          className={styles.sdm_content_scrollline}
        >
          <div 
            ref={thumbRef}
            className={styles.scrollThumb}
            style={{ '--p': scrollProgress }}
            onMouseDown={handleThumbMouseDown}
          />
        </div>
      )}
    </div>
  );
};

// 使用 React.memo 优化，避免不必要的重渲染
export default React.memo(CustomScrollbar);