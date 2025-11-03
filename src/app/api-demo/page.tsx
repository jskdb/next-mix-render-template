"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Play, Send, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";

// This page demonstrates the /api/hello API endpoint
export default function ApiDemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [getResult, setGetResult] = useState<Record<string, unknown> | null>(null);
  const [postResult, setPostResult] = useState<Record<string, unknown> | null>(null);
  const [name, setName] = useState("World");
  const [postData, setPostData] = useState('{"message": "Hello from client", "userId": 123}');
  const [postErrorType, setPostErrorType] = useState("");
  const [delay, setDelay] = useState("");
  const [errorType, setErrorType] = useState("");

  const handleGetRequest = async () => {
    setIsLoading(true);
    const startTime = performance.now();
    try {
      const params = new URLSearchParams({ name });
      if (delay) params.append('delay', delay);
      if (errorType) params.append('error', errorType);
      
      const res = await fetch(`/api/hello?${params.toString()}`);
      const data = await res.json();
      const endTime = performance.now();
      
      setGetResult({
        ...data,
        responseTime: `${(endTime - startTime).toFixed(2)}ms`,
        statusCode: res.status,
        statusText: res.statusText
      });
    } catch (error) {
      const endTime = performance.now();
      setGetResult({ 
        error: "Network Error", 
        message: error instanceof Error ? error.message : "Failed to fetch data",
        responseTime: `${(endTime - startTime).toFixed(2)}ms`
      });
    }
    setIsLoading(false);
  };

  const handlePostRequest = async () => {
    setIsLoading(true);
    const startTime = performance.now();
    try {
      let requestBody = postData;
      
      // 添加错误模拟到请求体
      if (postErrorType) {
        const bodyObj = JSON.parse(postData);
        bodyObj.simulateError = postErrorType;
        requestBody = JSON.stringify(bodyObj, null, 2);
      }
      
      const res = await fetch("/api/hello", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
      const data = await res.json();
      const endTime = performance.now();
      
      setPostResult({
        ...data,
        responseTime: `${(endTime - startTime).toFixed(2)}ms`,
        statusCode: res.status,
        statusText: res.statusText
      });
    } catch (error) {
      const endTime = performance.now();
      setPostResult({ 
        error: "Network Error", 
        message: error instanceof Error ? error.message : "Failed to send data",
        responseTime: `${(endTime - startTime).toFixed(2)}ms`
      });
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Main title area */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          API Demo - /api/hello
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          演示 Next.js API Routes 的 GET 和 POST 请求
        </p>
        <p className="text-lg text-gray-400 mb-8">
          这个页面展示了如何调用 /api/hello 端点，支持 GET 和 POST 请求，并展示返回的 Node.js 运行时信息
        </p>
      </div>

      {/* API Demo Cards */}
      <div className="container mx-auto px-4 mb-20 grid md:grid-cols-2 gap-8">
        {/* GET Request Card */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-600 text-white">GET</Badge>
              GET Request Demo
            </CardTitle>
            <CardDescription className="text-gray-300">
              发送 GET 请求到 /api/hello 并获取问候信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Name Parameter:</label>
                <Input
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-gray-900 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Delay (ms):</label>
                <Input
                  value={delay}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDelay(e.target.value)}
                  placeholder="e.g., 1000"
                  type="number"
                  className="bg-gray-900 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Simulate Error:</label>
                <select
                  value={errorType}
                  onChange={(e) => setErrorType(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                >
                  <option value="">No Error</option>
                  <option value="server">Server Error (500)</option>
                  <option value="auth">Unauthorized (401)</option>
                  <option value="rate">Rate Limited (429)</option>
                </select>
              </div>
            </div>
            <Button
              onClick={handleGetRequest}
              disabled={isLoading}
              className="w-full bg-[#1c66e5] hover:bg-[#1c66e5]/90 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Send GET Request
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
                  {getResult.statusCode && typeof getResult.statusCode === 'number' ? (
                    <Badge 
                      variant="secondary" 
                      className={`text-white text-xs ${
                        getResult.statusCode >= 400 ? 'bg-red-600' : 'bg-blue-600'
                      }`}
                    >
                      {String(getResult.statusCode)}
                    </Badge>
                  ) : null}
                </div>
                <pre className={`p-4 rounded text-sm overflow-auto ${
                  getResult.error ? 'bg-red-900/20 text-red-400' : 'bg-gray-900 text-green-400'
                }`}>
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
              POST Request Demo
            </CardTitle>
            <CardDescription className="text-gray-300">
              发送 POST 请求到 /api/hello 并处理 JSON 数据
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
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
              
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Simulate Error:</label>
                <select
                  value={postErrorType}
                  onChange={(e) => setPostErrorType(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                >
                  <option value="">No Error</option>
                  <option value="validation">Validation Error (422)</option>
                  <option value="database">Database Error (503)</option>
                  <option value="memory">Memory Error (507)</option>
                  <option value="timeout">Timeout Error</option>
                </select>
              </div>
            </div>
            <Button
              onClick={handlePostRequest}
              disabled={isLoading}
              className="w-full bg-[#1c66e5] hover:bg-[#1c66e5]/90 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send POST Request
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
                  {postResult.statusCode && typeof postResult.statusCode === 'number' ? (
                    <Badge 
                      variant="secondary" 
                      className={`text-white text-xs ${
                        postResult.statusCode >= 400 ? 'bg-red-600' : 'bg-blue-600'
                      }`}
                    >
                      {String(postResult.statusCode)}
                    </Badge>
                  ) : null}
                </div>
                <pre className={`p-4 rounded text-sm overflow-auto ${
                  postResult.error ? 'bg-red-900/20 text-red-400' : 'bg-gray-900 text-green-400'
                }`}>
                  {JSON.stringify(postResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* API Information */}
      <div className="container mx-auto px-4 mb-20">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">API 端点信息</CardTitle>
            <CardDescription className="text-gray-300">
              /api/hello 端点的详细信息和功能
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="text-white font-semibold mb-2">GET /api/hello</h4>
                <ul className="space-y-1 text-sm">
                  <li>• 支持 name 查询参数</li>
                  <li>• 返回问候信息和系统信息</li>
                  <li>• 包含 Node.js 版本和平台信息</li>
                  <li>• 展示运行时特性列表</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">POST /api/hello</h4>
                <ul className="space-y-1 text-sm">
                  <li>• 接收 JSON 格式的请求体</li>
                  <li>• 处理并返回增强的数据</li>
                  <li>• 包含服务器信息和内存使用情况</li>
                  <li>• 支持错误处理和验证</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Testing Guide */}
      <div className="container mx-auto px-4 mb-20">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Node.js 错误测试指南
            </CardTitle>
            <CardDescription className="text-gray-300">
              测试 Node.js Runtime 的各种错误处理和性能场景
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">GET 请求测试</h4>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• <strong>延迟测试</strong>: 输入 1000-10000ms 测试不同处理时间</li>
                  <li>• <strong>超时测试</strong>: 输入 &gt;10000ms 触发请求超时</li>
                  <li>• <strong>服务器错误</strong>: 选择 &quot;Server Error&quot; 模拟数据库连接失败</li>
                  <li>• <strong>认证错误</strong>: 选择 &quot;Unauthorized&quot; 模拟 API 密钥无效</li>
                  <li>• <strong>限流错误</strong>: 选择 &quot;Rate Limited&quot; 模拟请求频率过高</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-3">POST 请求测试</h4>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• <strong>验证错误</strong>: 模拟必填字段缺失的验证失败</li>
                  <li>• <strong>数据库错误</strong>: 模拟数据库连接超时</li>
                  <li>• <strong>内存错误</strong>: 模拟服务器内存不足</li>
                  <li>• <strong>超时错误</strong>: 模拟长时间处理导致的超时</li>
                  <li>• <strong>JSON 错误</strong>: 输入无效 JSON 测试解析错误</li>
                  <li>• <strong>延迟字段</strong>: 在 JSON 中添加 &quot;delay&quot;: 3000 测试处理延迟</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded">
              <h5 className="text-blue-400 font-semibold mb-2">🔧 Node.js 优势</h5>
              <p className="text-gray-300 text-sm">
                Node.js Runtime 提供更详细的错误信息、完整的系统访问权限和更强的容错能力。
                适合复杂的业务逻辑处理，但响应时间相对较长，冷启动时间也更久。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}