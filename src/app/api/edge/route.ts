import { NextRequest, NextResponse } from 'next/server'

// 指定使用 Edge Runtime
// export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || 'World'
  const delay = searchParams.get('delay')
  const error = searchParams.get('error')
  
  // 模拟 Edge Runtime 的错误情况
  if (error === 'edge-limit') {
    return NextResponse.json(
      { 
        error: 'Edge Runtime Limit Exceeded', 
        message: 'Function execution time exceeded edge runtime limits',
        maxExecutionTime: '30s'
      },
      { status: 504 }
    )
  }
  
  if (error === 'memory') {
    return NextResponse.json(
      { 
        error: 'Memory Limit Exceeded', 
        message: 'Edge function memory usage exceeded limits',
        limit: '128MB'
      },
      { status: 507 }
    )
  }
  
  if (error === 'geo') {
    return NextResponse.json(
      { 
        error: 'Geolocation Unavailable', 
        message: 'Unable to determine user location from edge',
        fallback: 'default-region'
      },
      { status: 503 }
    )
  }
  
  if (error === 'cdn') {
    return NextResponse.json(
      { 
        error: 'CDN Error', 
        message: 'Edge node temporarily unavailable',
        retryAfter: 5
      },
      { status: 502 }
    )
  }
  
  // Edge Runtime 延迟限制更严格
  if (delay) {
    const delayMs = parseInt(delay, 10)
    if (delayMs > 5000) {
      return NextResponse.json(
        { 
          error: 'Edge Timeout', 
          message: 'Edge functions must complete within 5 seconds',
          requestedDelay: `${delayMs}ms`,
          maxAllowed: '5000ms'
        },
        { status: 408 }
      )
    }
    await new Promise(resolve => setTimeout(resolve, delayMs))
  }
  
  // Edge Runtime 特性
  const timestamp = new Date().toISOString()
  const userAgent = request.headers.get('user-agent') || 'Unknown'
  const acceptLanguage = request.headers.get('accept-language') || 'Unknown'
  const cfRay = request.headers.get('cf-ray') || 'simulated-edge-' + Math.random().toString(36).substring(2, 11)
  
  // 注意：Edge Runtime 中无法访问 process 对象
  return NextResponse.json({
    message: `Hello ${name} from Edge Runtime!`,
    timestamp,
    userAgent,
    acceptLanguage,
    edgeInfo: {
      rayId: cfRay,
      region: 'auto-detected',
      colo: 'SJC' // 模拟 Cloudflare 数据中心
    },
    runtime: 'edge',
    processingDelay: delay ? `${delay}ms` : '<1ms',
    features: [
      'Global edge deployment',
      'Ultra-low latency',
      'Instant cold start',
      'Web APIs support',
      'Geolocation data'
    ],
    limitations: [
      'No Node.js specific APIs',
      'No file system access',
      'Limited package support',
      'No long-running tasks'
    ]
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 模拟 Edge Runtime 特有的错误情况
    if (body.simulateError) {
      switch (body.simulateError) {
        case 'package':
          return NextResponse.json(
            { 
              error: 'Package Not Supported', 
              message: 'The requested npm package is not available in Edge Runtime',
              package: body.package || 'fs',
              alternative: 'Use Web APIs instead'
            },
            { status: 501 }
          )
        case 'size':
          return NextResponse.json(
            { 
              error: 'Payload Too Large', 
              message: 'Request body exceeds Edge Runtime limits',
              limit: '1MB',
              received: '1.2MB'
            },
            { status: 413 }
          )
        case 'execution':
          return NextResponse.json(
            { 
              error: 'Execution Time Limit', 
              message: 'Edge function exceeded maximum execution time',
              limit: '30s',
              suggestion: 'Optimize your function or use Node.js runtime'
            },
            { status: 504 }
          )
        case 'region':
          return NextResponse.json(
            { 
              error: 'Region Unavailable', 
              message: 'Requested edge region is temporarily unavailable',
              requestedRegion: body.region || 'unknown',
              availableRegions: ['us-east-1', 'eu-west-1', 'ap-southeast-1']
            },
            { status: 503 }
          )
      }
    }
    
    // Edge Runtime 对处理时间更敏感
    if (body.delay) {
      const delayMs = parseInt(body.delay, 10)
      if (delayMs > 3000) {
        return NextResponse.json(
          { 
            error: 'Edge Processing Timeout', 
            message: 'Edge functions should complete quickly for optimal performance',
            requestedDelay: `${delayMs}ms`,
            recommendation: 'Keep processing under 3 seconds'
          },
          { status: 408 }
        )
      }
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
    
    // 模拟 Edge Runtime 资源限制检查
    const payloadSize = JSON.stringify(body).length
    if (payloadSize > 1024 * 100) { // 100KB limit simulation
      return NextResponse.json(
        { 
          error: 'Payload Size Warning', 
          message: 'Large payloads may impact edge performance',
          size: `${Math.round(payloadSize / 1024)}KB`,
          recommendation: 'Consider reducing payload size'
        },
        { status: 413 }
      )
    }
    
    // Edge Runtime 中的轻量级处理
    const processed = {
      ...body,
      processed: true,
      edge: true,
      timestamp: new Date().toISOString(),
      processingTime: body.delay ? `${body.delay}ms` : '<1ms',
      edgeFeatures: {
        global: true,
        lowLatency: true,
        instantStart: true,
        payloadSize: `${Math.round(payloadSize / 1024)}KB`
      },
      edgeMetrics: {
        coldStart: false,
        region: 'auto',
        executionTime: body.delay || 0
      }
    }
    
    return NextResponse.json(processed)
  } catch (error) {
    // Edge Runtime 错误处理更简化
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          error: 'Invalid JSON', 
          message: 'Malformed JSON in request body',
          runtime: 'edge'
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Edge Runtime Error', 
        message: 'An error occurred in the edge function',
        timestamp: new Date().toISOString(),
        suggestion: 'Check your request format and try again'
      },
      { status: 500 }
    )
  }
} 