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
          // 快速生成超过6MB的响应数据
          console.log('快速生成大响应体...')
          
          // 使用更简单快速的方法生成大数据
          const baseString = 'A'.repeat(1024); // 1KB base string
          const megabyteData = baseString.repeat(1024); // 1MB string
          
          // 快速生成15MB数据 - 使用重复模式但添加标识符避免过度压缩
          const largeDataArray = [];
          for (let i = 0; i < 15; i++) {
            largeDataArray.push(`CHUNK_${i}_START_` + megabyteData + `_CHUNK_${i}_END`);
          }
          
          // 添加少量元数据
          const metadata = {
            chunks: 15,
            chunkSize: '1MB each',
            totalSize: '15MB+',
            generatedAt: new Date().toISOString(),
            method: 'fast_generation'
          };
          
          const responseData = {
            message: 'Fast Large Response - Node.js Runtime',
            status: 'success',
            size: '~15MB',
            timestamp: new Date().toISOString(),
            runtime: 'nodejs',
            data: largeDataArray,
            metadata: metadata
          };
          
          console.log('大响应体快速生成完成')
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