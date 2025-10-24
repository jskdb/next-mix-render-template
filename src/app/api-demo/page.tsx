"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Send, Loader2 } from "lucide-react";
import { useState } from "react";

// This page demonstrates the /api/hello API endpoint
export default function ApiDemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [getResult, setGetResult] = useState<any>(null);
  const [postResult, setPostResult] = useState<any>(null);
  const [name, setName] = useState("World");
  const [postData, setPostData] = useState('{"message": "Hello from client", "userId": 123}');

  const handleGetRequest = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/hello?name=${encodeURIComponent(name)}`);
      const data = await res.json();
      setGetResult(data);
    } catch (error) {
      setGetResult({ error: "Failed to fetch data" });
    }
    setIsLoading(false);
  };

  const handlePostRequest = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/hello", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: postData,
      });
      const data = await res.json();
      setPostResult(data);
    } catch (error) {
      setPostResult({ error: "Failed to send data" });
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
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Name Parameter:</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-gray-900 border-gray-600 text-white"
              />
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
                <h4 className="text-white font-semibold mb-2">Response:</h4>
                <pre className="bg-gray-900 p-4 rounded text-sm text-green-400 overflow-auto">
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
            <div>
              <label className="text-sm text-gray-300 mb-2 block">JSON Payload:</label>
              <textarea
                value={postData}
                onChange={(e) => setPostData(e.target.value)}
                rows={4}
                className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white text-sm font-mono"
                placeholder="Enter JSON data"
              />
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
                <h4 className="text-white font-semibold mb-2">Response:</h4>
                <pre className="bg-gray-900 p-4 rounded text-sm text-green-400 overflow-auto">
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
    </main>
  );
}