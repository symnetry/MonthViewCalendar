/**
 * HTTP客户端功能测试
 * 注意：这是一个模拟测试，不会发送真实请求
 */
import { HttpClient } from './httpClient';

// 模拟fetch API用于测试
global.fetch = jest.fn();

describe('HttpClient测试', () => {
  let client: HttpClient;
  const mockResponse = { data: 'test data' };
  
  beforeEach(() => {
    client = new HttpClient();
    // 重置fetch模拟
    (global.fetch as jest.Mock).mockClear();
  });

  // 测试GET请求
  test('should make GET request with correct parameters', async () => {
    // 设置模拟响应
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await client.get('https://api.example.com/test');

    // 验证fetch被正确调用
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    );

    // 验证结果
    expect(result).toEqual(mockResponse);
  });

  // 测试POST请求
  test('should make POST request with correct body', async () => {
    const requestData = { name: 'test' };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await client.post('https://api.example.com/test', requestData);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(requestData)
      })
    );

    expect(result).toEqual(mockResponse);
  });

  // 测试错误处理
  test('should handle HTTP errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    await expect(client.get('https://api.example.com/not-found'))
      .rejects
      .toThrow('HTTP error! Status: 404');
  });

  // 测试超时功能
  test('should handle timeout', async () => {
    // 模拟一个永远不结束的promise
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // 永不解析的Promise
    );

    // 使用较短的超时时间进行测试
    await expect(client.get('https://api.example.com/slow', {}, 50))
      .rejects
      .toThrow(/Request timed out/);
  });
});

// 如果在真实环境中运行，这里可以添加手动测试代码
if (process.env.NODE_ENV !== 'test') {
  console.log('HTTP客户端实现完成，包含以下功能：');
  console.log('1. 基于fetch API实现');
  console.log('2. 默认2000ms超时设置');
  console.log('3. 完整的错误处理');
  console.log('4. 支持GET、POST、PUT、DELETE、PATCH方法');
  console.log('5. 支持自定义baseURL和默认请求头');
  console.log('6. TypeScript类型支持');
}