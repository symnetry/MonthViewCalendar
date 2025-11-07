import { useState, useEffect } from 'react';

// 尝试导入全局的useLocalStorage实现
let globalUseLocalStorage: any = null;
try {
  globalUseLocalStorage = require('@/utils/useLocalStorage').default;
} catch (error) {
  console.log('未找到全局useLocalStorage实现，使用本地实现');
}

/**
 * localStorage操作的React自定义钩子
 * 优先使用全局实现，如果不存在则使用本地实现
 * @param key localStorage的键名
 * @param initialValue 初始值
 * @returns [存储的值, 设置值的函数, 移除值的函数]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // 如果存在全局实现，优先使用
  if (globalUseLocalStorage) {
    return globalUseLocalStorage(key, initialValue);
  }

  // 本地实现 - 当全局实现不存在时使用
  const readValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // 触发storage事件以通知其他标签页
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: JSON.stringify(valueToStore),
            oldValue: JSON.stringify(storedValue),
            storageArea: localStorage,
            url: window.location.href,
          })
        );
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: null,
            oldValue: JSON.stringify(storedValue),
            storageArea: localStorage,
            url: window.location.href,
          })
        );
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  // 监听storage事件
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        setStoredValue(JSON.parse(event.newValue) as T);
      } else if (event.key === key && event.newValue === null) {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;