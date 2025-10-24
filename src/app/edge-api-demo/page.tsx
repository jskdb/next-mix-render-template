"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Play, Send, Loader2, Zap, Globe, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";

// This page demonstrates the /api/edge API endpoint
export default function EdgeApiDemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [getResult, setGetResult] = useState<Record<string, unknown> | null>(null);
  const [postResult, setPostResult] = useState<Record<string, unknown> | null>(null);
  const [name, setName] = useState("World");
  const [postData, setPostData] = useState('{"message": "Hello from Edge", "location": "global"}');

  const handleGetRequest = async () => {
    setIsLoading(true);
    const startTime = performance.now();
    try {
      const res = await fetch(`/api/edge?name=${encodeURIComponent(name)}`);
      const data = await res.json();
      const endTime = performance.now();
      setGetResult({
        ...data,
        responseTime: `${(endTime - startTime).toFixed(2)}ms`
      });
    } catch {
      setGetResult({ error: "Failed to fetch data" });
    }
    setIsLoading(false);
  };

  const handlePostRequest = async () => {
    setIsLoading(true);
    const startTime = performance.now();
    try {
      const res = await fetch("/api/edge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: postData,
      });
      const data = await res.json();
      const endTime = performance.now();
      setPostResult({
        ...data,
        responseTime: `${(endTime - startTime).toFixed(2)}ms`
      });
    } catch {
      setPostResult({ error: "Failed to send data" });
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Main title area */}
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-yellow-400" />
          <h1 className="text-5xl font-bold text-white">
            Edge API Demo - /api/edge
          </h1>
          <Zap className="w-8 h-8 text-yellow-400" />
        </div>
        <p className="text-xl text-gray-300 mb-4">
          演示 Next.js Edge Runtime API 的超低延迟和全球部署特性
        </p>
        <p className="text-lg text-gray-400 mb-8">
          Edge Runtime 在全球边缘节点运行，提供极快的响应速度和即时冷启动，但功能相对受限
        </p>
        <div className="flex items-center justify-center gap-4 mb-8">
          <Badge variant="secondary" className="bg-yellow-600 text-white flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Global Edge
          </Badge>
          <Badge variant="secondary" className="bg-green-600 text-white flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Ultra Low Latency
          </Badge>
          <Badge variant="secondary" className="bg-blue-600 text-white flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Instant Start
          </Badge>
        </div>
      </div>

      {/* API Demo Cards */}
      <div className="container mx-auto px-4 mb-20 grid md:grid-cols-2 gap-8">
        {/* GET Request Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-600 text-white">GET</Badge>
              Edge GET Request
              <Zap className="w-4 h-4 text-yellow-400" />
            </CardTitle>
            <CardDescription className="text-gray-300">
              发送 GET 请求到 Edge Runtime，体验超快响应速度
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Name Parameter:</label>
              <Input
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>
            <Button
              onClick={handleGetRequest}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Send Edge GET Request
            </Button>

            {getResult && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-white font-semibold">Response:</h4>
                  {getResult.responseTime ? (
                    <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                      {String(getResult.responseTime)}
                    </Badge>
                  ) : null}
                </div>
                <pre className="bg-gray-900 p-4 rounded text-sm text-green-400 overflow-auto max-h-64">
                  {JSON.stringify(getResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* POST Request Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-600 text-white">POST</Badge>
              Edge POST Request
              <Zap className="w-4 h-4 text-yellow-400" />
            </CardTitle>
            <CardDescription className="text-gray-300">
              发送 POST 请求到 Edge Runtime 进行轻量级数据处理
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">JSON Payload:</label>
              <textarea
                value={postData}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPostData(e.target.value)}
                rows={4}
                className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white text-sm font-mono"
                placeholder="Enter JSON data"
              />
            </div>
            <Button
              onClick={handlePostRequest}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send Edge POST Request
            </Button>

            {postResult && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-white font-semibold">Response:</h4>
                  {postResult.responseTime ? (
                    <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                      {String(postResult.responseTime)}
                    </Badge>
                  ) : null}
                </div>
                <pre className="bg-gray-900 p-4 rounded text-sm text-green-400 overflow-auto max-h-64">
                  {JSON.stringify(postResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparison Section */}
      <div className="container mx-auto px-4 mb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Edge Runtime vs Node.js Runtime 对比
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Edge Runtime */}
          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-600/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Edge Runtime (/api/edge)
              </CardTitle>
              <CardDescription className="text-gray-300">
                轻量级、超快速的边缘计算环境
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  优势特性
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• 全球边缘节点部署</li>
                  <li>• 超低延迟响应 (&lt;50ms)</li>
                  <li>• 即时冷启动 (0ms)</li>
                  <li>• 自动地理位置优化</li>
                  <li>• 支持 Web APIs</li>
                  <li>• 更好的缓存策略</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  限制条件
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• 无法访问 Node.js 特定 API</li>
                  <li>• 不支持文件系统操作</li>
                  <li>• npm 包支持有限</li>
                  <li>• 不能运行长时间任务</li>
                  <li>• 内存和 CPU 限制更严格</li>
                </ul>
              </div>

              <div>
                <h4 className="text-blue-400 font-semibold mb-2">适用场景</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• API 路由和中间件</li>
                  <li>• 简单数据转换</li>
                  <li>• 用户认证验证</li>
                  <li>• 缓存和 CDN 逻辑</li>
                  <li>• 地理位置相关服务</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Node.js Runtime */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-600/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Node.js Runtime (/api/hello)
              </CardTitle>
              <CardDescription className="text-gray-300">
                功能完整的服务器端运行环境
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  优势特性
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• 完整的 Node.js API 支持</li>
                  <li>• 文件系统访问权限</li>
                  <li>• 完整的 npm 生态系统</li>
                  <li>• 数据库连接支持</li>
                  <li>• 复杂业务逻辑处理</li>
                  <li>• 长时间运行任务</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  限制条件
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• 冷启动时间较长</li>
                  <li>• 延迟相对较高</li>
                  <li>• 资源消耗更多</li>
                  <li>• 扩展性相对有限</li>
                  <li>• 地理分布不如 Edge</li>
                </ul>
              </div>

              <div>
                <h4 className="text-blue-400 font-semibold mb-2">适用场景</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• 复杂的 API 端点</li>
                  <li>• 数据库操作</li>
                  <li>• 第三方服务集成</li>
                  <li>• 文件处理和上传</li>
                  <li>• 复杂的业务逻辑</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="container mx-auto px-4 mb-20">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">性能对比总结</CardTitle>
            <CardDescription className="text-gray-300 text-center">
              选择合适的运行时环境来优化您的应用性能
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-300">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-4 text-white">特性</th>
                    <th className="text-center py-3 px-4 text-yellow-400">Edge Runtime</th>
                    <th className="text-center py-3 px-4 text-blue-400">Node.js Runtime</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 font-medium">冷启动时间</td>
                    <td className="text-center py-3 px-4 text-green-400">~0ms</td>
                    <td className="text-center py-3 px-4 text-yellow-400">~100-500ms</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 font-medium">响应延迟</td>
                    <td className="text-center py-3 px-4 text-green-400">&lt;50ms</td>
                    <td className="text-center py-3 px-4 text-yellow-400">50-200ms</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 font-medium">API 支持</td>
                    <td className="text-center py-3 px-4 text-red-400">Web APIs 只</td>
                    <td className="text-center py-3 px-4 text-green-400">完整 Node.js</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 font-medium">npm 包支持</td>
                    <td className="text-center py-3 px-4 text-red-400">有限</td>
                    <td className="text-center py-3 px-4 text-green-400">完整生态</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 font-medium">全球分布</td>
                    <td className="text-center py-3 px-4 text-green-400">边缘节点</td>
                    <td className="text-center py-3 px-4 text-yellow-400">区域服务器</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">最佳用途</td>
                    <td className="text-center py-3 px-4">轻量级 API</td>
                    <td className="text-center py-3 px-4">复杂业务逻辑</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}