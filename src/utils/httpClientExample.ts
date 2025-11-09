/**
 * HTTP客户端使用示例
 */
import { HttpClient, httpClient } from './httpClient';

// 使用默认实例
async function useDefaultClient() {
  try {
    // GET请求
    const getResult = await httpClient.get('https://api.example.com/data');
    console.log('GET result:', getResult);

    // POST请求
    const postResult = await httpClient.post('https://api.example.com/data', {
      name: 'Test',
      value: 123
    });
    console.log('POST result:', postResult);

    // 自定义超时
    const customTimeoutResult = await httpClient.get(
      'https://api.example.com/slow-endpoint',
      {},
      5000 // 5秒超时
    );
    console.log('Custom timeout result:', customTimeoutResult);
  } catch (error) {
    console.error('Error in default client:', error);
  }
}

// 创建自定义实例
function createCustomClient() {
  const customClient = new HttpClient({
    baseURL: 'https://api.custom.com',
    defaultTimeout: 3000, // 3秒默认超时
    defaultHeaders: {
      'Authorization': 'Bearer token123',
      'X-Custom-Header': 'custom-value'
    }
  });

  return customClient;
}

// 使用自定义实例
async function useCustomClient() {
  const customClient = createCustomClient();
  
  try {
    // 相对路径会自动加上baseURL
    const result = await customClient.get('/users/profile');
    console.log('Custom client result:', result);
  } catch (error) {
    console.error('Error in custom client:', error);
  }
}

// 演示各种HTTP方法
async function demonstrateAllMethods() {
  const client = createCustomClient();
  
  try {
    // GET - 获取数据
    const getResponse = await client.get('/items');
    
    // POST - 创建数据
    const postResponse = await client.post('/items', {
      name: 'New Item',
      description: 'Item description'
    });
    
    // PUT - 更新数据
    const putResponse = await client.put('/items/123', {
      name: 'Updated Item',
      description: 'Updated description'
    });
    
    // PATCH - 部分更新
    const patchResponse = await client.patch('/items/123', {
      status: 'active'
    });
    
    // DELETE - 删除数据
    const deleteResponse = await client.delete('/items/123');
    
  } catch (error) {
    console.error('Error in method demonstration:', error);
  }
}

export {
  useDefaultClient,
  useCustomClient,
  demonstrateAllMethods
};