/**
 * HTTP请求客户端类
 * 使用fetch API实现，支持超时处理和错误捕获
 */

// Promise.try polyfill - ES2025新特性
if (!Promise.try) {
  Promise.try = function<T>(fn: () => T | Promise<T>): Promise<T> {
    return new Promise((resolve) => resolve()).then(fn);
  };
}

export class HttpClient {
  private defaultTimeout: number;
  private baseURL?: string;
  private defaultHeaders: Record<string, string>;

  /**
   * 构造函数
   * @param options 配置选项
   */
  constructor(options: {
    baseURL?: string;
    defaultTimeout?: number;
    defaultHeaders?: Record<string, string>;
  } = {}) {
    this.defaultTimeout = options.defaultTimeout || 2000;
    this.baseURL = options.baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.defaultHeaders,
    };
  }

  /**
   * 创建带超时的fetch请求
   * @param url 请求URL
   * @param options 请求选项
   * @param timeout 超时时间（毫秒）
   * @returns Promise
   */
  private async fetchWithTimeout<T = any>(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<T> {
    // 超时Promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        reject(new Error(`Request timed out after ${timeout}ms`));
      }, timeout);
    });

    // 使用Promise.try统一处理同步和异步错误
    return Promise.try(async () => {
      const response = await Promise.race([
        fetch(url, options),
        timeoutPromise,
      ]);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // 尝试解析JSON响应
      try {
        return await response.json();
      } catch (e) {
        // 如果不是JSON响应，返回文本
        return (await response.text()) as unknown as T;
      }
    }).catch(error => {
      this.handleError(error);
      throw error; // 重新抛出错误供调用者处理
    });
  }

  /**
   * 错误处理
   * @param error 错误对象
   */
  private handleError(error: any): void {
    console.error('HTTP Request Error:', error.message || error);
    // 可以在这里添加更多的错误处理逻辑，如错误上报、重试机制等
  }

  /**
   * 构建完整的URL
   * @param url 请求URL
   * @returns 完整的URL
   */
  private buildURL(url: string): string {
    if (this.baseURL && !url.startsWith('http')) {
      return `${this.baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
    }
    return url;
  }

  /**
   * GET请求
   * @param url 请求URL
   * @param options 请求选项
   * @param timeout 超时时间
   * @returns Promise<T>
   */
  async get<T = any>(
    url: string,
    options: Omit<RequestInit, 'method' | 'body'> = {},
    timeout?: number
  ): Promise<T> {
    return this.fetchWithTimeout<T>(this.buildURL(url), {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    }, timeout || this.defaultTimeout);
  }

  /**
   * POST请求
   * @param url 请求URL
   * @param data 请求数据
   * @param options 请求选项
   * @param timeout 超时时间
   * @returns Promise<T>
   */
  async post<T = any>(
    url: string,
    data?: any,
    options: Omit<RequestInit, 'method' | 'body'> = {},
    timeout?: number
  ): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined;
    return this.fetchWithTimeout<T>(this.buildURL(url), {
      method: 'POST',
      headers: { ...this.defaultHeaders, ...options.headers },
      body,
      ...options,
    }, timeout || this.defaultTimeout);
  }

  /**
   * PUT请求
   * @param url 请求URL
   * @param data 请求数据
   * @param options 请求选项
   * @param timeout 超时时间
   * @returns Promise<T>
   */
  async put<T = any>(
    url: string,
    data?: any,
    options: Omit<RequestInit, 'method' | 'body'> = {},
    timeout?: number
  ): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined;
    return this.fetchWithTimeout<T>(this.buildURL(url), {
      method: 'PUT',
      headers: { ...this.defaultHeaders, ...options.headers },
      body,
      ...options,
    }, timeout || this.defaultTimeout);
  }

  /**
   * DELETE请求
   * @param url 请求URL
   * @param options 请求选项
   * @param timeout 超时时间
   * @returns Promise<T>
   */
  async delete<T = any>(
    url: string,
    options: Omit<RequestInit, 'method' | 'body'> = {},
    timeout?: number
  ): Promise<T> {
    return this.fetchWithTimeout<T>(this.buildURL(url), {
      method: 'DELETE',
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    }, timeout || this.defaultTimeout);
  }

  /**
   * PATCH请求
   * @param url 请求URL
   * @param data 请求数据
   * @param options 请求选项
   * @param timeout 超时时间
   * @returns Promise<T>
   */
  async patch<T = any>(
    url: string,
    data?: any,
    options: Omit<RequestInit, 'method' | 'body'> = {},
    timeout?: number
  ): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined;
    return this.fetchWithTimeout<T>(this.buildURL(url), {
      method: 'PATCH',
      headers: { ...this.defaultHeaders, ...options.headers },
      body,
      ...options,
    }, timeout || this.defaultTimeout);
  }
}

// 创建并导出实例（支持命名导入和默认导入两种方式）
export const httpClient = new HttpClient();
export default httpClient;