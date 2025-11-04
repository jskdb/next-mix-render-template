import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || 'World'
  const delay = searchParams.get('delay')
  const error = searchParams.get('error')
  
  // 模拟错误情况
  if (error === 'server') {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Database connection failed' },
      { status: 500 }
    )
  }
  
  if (error === 'auth') {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Invalid API key' },
      { status: 401 }
    )
  }
  
  if (error === 'rate') {
    return NextResponse.json(
      { error: 'Too Many Requests', message: 'Rate limit exceeded' },
      { status: 429 }
    )
  }
  
  // 模拟延迟处理
  if (delay) {
    const delayMs = parseInt(delay, 10)
    if (delayMs > 35000) {
      return NextResponse.json(
        { error: 'Request Timeout', message: 'Processing time exceeded limit' },
        { status: 408 }
      )
    }
    await new Promise(resolve => setTimeout(resolve, delayMs))
  }
  
  // 模拟一些 Node.js 特定的处理
  const timestamp = new Date().toISOString()
  const nodeVersion = process.version
  const platform = process.platform
  
  return NextResponse.json({
    message: `Hello ${name} from Node.js!`,
    timestamp,
    nodeVersion,
    platform,
    runtime: 'nodejs',
    processingDelay: delay ? `${delay}ms` : '0ms',
    features: [
      'Full Node.js API support',
      'File system access',
      'npm package ecosystem',
      'Database connections',
      'Complex business logic'
    ]
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 模拟各种错误情况
    if (body.simulateError) {
      switch (body.simulateError) {

        case 'validation':
          return NextResponse.json(
            { 
              error: 'Validation Error', 
              message: 'Required field "userId" is missing',
              details: { field: 'userId', code: 'REQUIRED' }
            },
            { status: 422 }
          )
        case 'database':
          return NextResponse.json(
            { 
              error: 'Database Error', 
              message: 'Connection to database timed out',
              retryAfter: 30
            },
            { status: 503 }
          )
        case 'memory':
          return NextResponse.json(
            { 
              error: 'Out of Memory', 
              message: 'Server is running low on memory',
              currentUsage: process.memoryUsage()
            },
            { status: 507 }
          )
        case 'timeout':
          // 模拟长时间处理导致超时
          await new Promise(resolve => setTimeout(resolve, 40000))
          break
        case 'large-payload':
          return NextResponse.json(
            { 
              error: 'Payload Too Large', 
              message: 'Request body exceeds server limits',
              limit: '6MB',
              received: '6.2MB',
              suggestion: 'Consider splitting large data into smaller chunks'
            },
            { status: 413 }
          )
        case 'large-response':
          // 生成真实的超过6MB的响应数据
          console.log('开始生成大响应体...')
          
          // 生成约7MB的数据确保超过6MB
          const chunkSize = 1024 * 1024; // 1MB
          const numChunks = 7; // 7MB total
          
          // 生成不同内容的数据块，避免压缩
          const dataChunks = [];
          for (let i = 0; i < numChunks; i++) {
            // 每个块包含不同的随机数据，避免重复压缩
            const randomData = Array.from({length: chunkSize / 10}, (_, index) => 
              `chunk${i}_item${index}_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
            ).join('');
            dataChunks.push(randomData);
          }
          
          // 添加更多随机数据确保超过6MB
          const additionalData = Array.from({length: 1000}, (_, i) => ({
            id: i,
            uuid: `${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`,
            timestamp: new Date().toISOString(),
            randomString: Math.random().toString(36).repeat(100), // 长随机字符串
            data: Array.from({length: 50}, () => Math.random().toString(36).substring(2, 15))
          }));
          
          const responseData = {
            message: 'Real Large Response Body - Node.js Runtime',
            warning: 'This response contains over 6MB of actual data',
            actualSize: '~7MB',
            timestamp: new Date().toISOString(),
            runtime: 'nodejs',
            dataChunks: dataChunks,
            additionalRecords: additionalData,
            metadata: {
              totalChunks: numChunks,
              chunkSize: '1MB each',
              additionalRecords: additionalData.length,
              estimatedSize: '7MB+',
              purpose: 'Real large response testing in Node.js Runtime',
              capabilities: [
                'Can handle large response bodies',
                'Memory management by Node.js',
                'Suitable for data export/download',
                'Real data generation'
              ],
              generationInfo: {
                chunksGenerated: numChunks,
                recordsGenerated: additionalData.length,
                compressionResistant: true,
                uniqueContent: true
              }
            }
          };
          
          console.log('大响应体生成完成，准备返回...')
          return NextResponse.json(responseData)
      }
    }
    
    // 模拟处理延迟
    if (body.delay) {
      const delayMs = parseInt(body.delay, 10)
      if (delayMs > 0 && delayMs <= 5000) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
    
    // 模拟数据处理
    const processed = {
      ...body,
      processed: true,
      nodejs: true,
      timestamp: new Date().toISOString(),
      processingTime: body.delay ? `${body.delay}ms` : 'instant',
      serverInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      }
    }
    
    return NextResponse.json(processed)
  } catch (error) {
    // 捕获 JSON 解析错误
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          error: 'Invalid JSON', 
          message: 'Request body contains malformed JSON',
          details: error.message
        },
        { status: 400 }
      )
    }
    
    // 其他未知错误
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 