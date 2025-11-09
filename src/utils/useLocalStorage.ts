import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
// 判断是否为订单数据的函数
const isOrderData = (key: string, data: any): boolean => {
  return key === 'moonview_orders' && 
         Array.isArray(data) && 
         data.length > 0 && 
         'checkin' in data[0] && 
         'checkout' in data[0];
};

// 转换订单数据中的日期字段为dayjs对象
const convertOrderDates = (data: any[]): any[] => {
  return data.map(item => ({
    ...item,
    checkin: dayjs(item.checkin),
    checkout: dayjs(item.checkout)
  }));
};


/**
 * localStorage操作的React自定义钩子
 * @param key localStorage的键名
 * @param initialValue 初始值
 * @returns [存储的值, 设置值的函数, 移除值的函数]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // 初始化state，优先从localStorage读取值
  const readValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      const parsedData = JSON.parse(item);
      
      // 特殊处理订单数据，确保日期字段为dayjs对象
      if (isOrderData(key, parsedData)) {
        return convertOrderDates(parsedData) as unknown as T;
      }
      
      return parsedData as T;
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
      
      // 保存时不需要特殊处理，JSON.stringify会自动处理
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
        try {
          const parsedData = JSON.parse(event.newValue);
          
          // 特殊处理订单数据，确保日期字段为dayjs对象
          if (isOrderData(key, parsedData)) {
            setStoredValue(convertOrderDates(parsedData) as unknown as T);
          } else {
            setStoredValue(parsedData as T);
          }
        } catch (error) {
          console.warn(`Error parsing localStorage data for key "${key}":`, error);
        }
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