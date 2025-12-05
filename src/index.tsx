import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * 设置动态视口高度，解决 Safari 移动浏览器中 100vh 包含地址栏的问题
 * 将实际可视高度设置为 CSS 变量 --vh，供 CSS 使用
 * 使用优化策略减少滚动时的抖动
 */
let lastHeight = 0;
let rafId: number | null = null;
let throttleTimer: number | null = null;

/**
 * 更新视口高度
 * @param force - 是否强制更新（忽略阈值检查）
 */
function updateViewportHeight(force = false) {
  const currentHeight = window.innerHeight;
  const heightDiff = Math.abs(currentHeight - lastHeight);
  
  // 只有在高度变化超过 5px 时才更新，避免微小变化引起的抖动
  // 或者强制更新时（如初始化、方向变化）
  if (force || heightDiff > 5) {
    const vh = currentHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    lastHeight = currentHeight;
  }
}

/**
 * 使用 requestAnimationFrame 优化的更新函数
 */
function setViewportHeight() {
  // 取消之前的动画帧请求
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }
  
  // 使用 requestAnimationFrame 确保在浏览器重绘前更新
  rafId = requestAnimationFrame(() => {
    updateViewportHeight();
    rafId = null;
  });
}

/**
 * 节流版本的更新函数，限制更新频率
 */
function throttledSetViewportHeight() {
  if (throttleTimer !== null) {
    return;
  }
  
  // 每 150ms 最多更新一次
  throttleTimer = window.setTimeout(() => {
    setViewportHeight();
    throttleTimer = null;
  }, 150);
}

// 初始化设置（强制更新）
updateViewportHeight(true);

// 监听窗口大小变化（包括地址栏显示/隐藏）
// 使用节流版本减少更新频率
window.addEventListener('resize', throttledSetViewportHeight, { passive: true });

// 监听方向变化
window.addEventListener('orientationchange', () => {
  // 延迟执行，等待方向变化完成，并强制更新
  setTimeout(() => {
    updateViewportHeight(true);
  }, 100);
}, { passive: true });

// 监听滚动事件，在滚动停止后更新（使用防抖）
let scrollTimer: number | null = null;
window.addEventListener('scroll', () => {
  if (scrollTimer !== null) {
    clearTimeout(scrollTimer);
  }
  // 滚动停止 200ms 后更新
  scrollTimer = window.setTimeout(() => {
    updateViewportHeight(true);
    scrollTimer = null;
  }, 200);
}, { passive: true });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


reportWebVitals();
