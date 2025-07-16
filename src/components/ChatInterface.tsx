import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Settings, Zap, Database, Cpu } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { MCPMessage, MCPServer, ChatState } from '../types/mcp'

export function ChatInterface() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your MCP-enabled AI assistant. I can help you with various tasks using connected tools and servers. How can I assist you today?',
        timestamp: new Date(),
        metadata: {
          server: 'local'
        }
      }
    ],
    isLoading: false,
    availableTools: [
      {
        name: 'web_search',
        description: 'Search the web for information',
        parameters: { query: 'string' },
        server: 'search-server'
      },
      {
        name: 'code_analysis',
        description: 'Analyze and review code',
        parameters: { code: 'string', language: 'string' },
        server: 'code-server'
      },
      {
        name: 'data_query',
        description: 'Query databases and data sources',
        parameters: { query: 'string', source: 'string' },
        server: 'data-server'
      }
    ],
    context: []
  })

  const [inputValue, setInputValue] = useState('')
  const [servers] = useState<MCPServer[]>([
    {
      id: 'search-server',
      name: 'Search Server',
      url: 'mcp://search.local',
      status: 'connected',
      capabilities: ['web_search', 'knowledge_base'],
      lastPing: new Date()
    },
    {
      id: 'code-server',
      name: 'Code Analysis Server',
      url: 'mcp://code.local',
      status: 'connected',
      capabilities: ['code_analysis', 'syntax_check'],
      lastPing: new Date()
    },
    {
      id: 'data-server',
      name: 'Data Server',
      url: 'mcp://data.local',
      status: 'connecting',
      capabilities: ['data_query', 'analytics'],
      lastPing: new Date()
    }
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatState.messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || chatState.isLoading) return

    const userMessage: MCPMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }))

    setInputValue('')

    // Simulate AI response with MCP processing
    setTimeout(() => {
      const assistantMessage: MCPMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMCPResponse(inputValue),
        timestamp: new Date(),
        metadata: {
          tools: detectTools(inputValue),
          server: selectServer(inputValue),
          context: 'processed'
        }
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }))
    }, 1500)
  }

  const generateMCPResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('search') || lowerInput.includes('find')) {
      return `I'll search for information about "${input}". Using the web search tool from the Search Server to gather relevant data...

🔍 **Search Results:**
- Found 3 relevant articles
- Processed through MCP context management
- Results cached for future reference

Based on the search results, here's what I found: [Simulated search results would appear here with proper MCP tool integration]`
    }
    
    if (lowerInput.includes('code') || lowerInput.includes('analyze')) {
      return `I'll analyze the code using the Code Analysis Server. The MCP protocol allows me to:

💻 **Code Analysis:**
- Syntax validation
- Performance optimization suggestions
- Security vulnerability detection
- Best practices recommendations

[Detailed code analysis would be performed here using MCP tools]`
    }
    
    if (lowerInput.includes('data') || lowerInput.includes('query')) {
      return `Connecting to the Data Server via MCP to process your query...

📊 **Data Processing:**
- Query optimization
- Multi-source data aggregation
- Real-time analytics
- Context-aware filtering

[Data query results would be displayed here with MCP context management]`
    }
    
    return `I understand your request: "${input}". Through the MCP (Model Context Protocol), I can:

✨ **Available Capabilities:**
- Access multiple specialized servers
- Use context-aware tools
- Maintain conversation history
- Provide real-time responses

How would you like me to help you further?`
  }

  const detectTools = (input: string): string[] => {
    const tools: string[] = []
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('search') || lowerInput.includes('find')) tools.push('web_search')
    if (lowerInput.includes('code') || lowerInput.includes('analyze')) tools.push('code_analysis')
    if (lowerInput.includes('data') || lowerInput.includes('query')) tools.push('data_query')
    
    return tools
  }

  const selectServer = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('search') || lowerInput.includes('find')) return 'search-server'
    if (lowerInput.includes('code') || lowerInput.includes('analyze')) return 'code-server'
    if (lowerInput.includes('data') || lowerInput.includes('query')) return 'data-server'
    
    return 'local'
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusColor = (status: MCPServer['status']) => {
    switch (status) {
      case 'connected': return 'bg-green-500'
      case 'connecting': return 'bg-yellow-500'
      case 'disconnected': return 'bg-gray-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: MCPServer['status']) => {
    switch (status) {
      case 'connected': return 'Connected'
      case 'connecting': return 'Connecting'
      case 'disconnected': return 'Disconnected'
      case 'error': return 'Error'
      default: return 'Unknown'
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - MCP Servers */}
      <div className="w-80 border-r border-border bg-card p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold">MCP Servers</h2>
        </div>
        
        <div className="space-y-3 flex-1">
          {servers.map((server) => (
            <Card key={server.id} className="p-3 hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">{server.name}</h3>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(server.status)}`} />
                  <span className="text-xs text-muted-foreground">{getStatusText(server.status)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{server.url}</p>
              <div className="flex flex-wrap gap-1">
                {server.capabilities.map((cap) => (
                  <Badge key={cap} variant="secondary" className="text-xs px-1 py-0">
                    {cap}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Separator className="my-4" />
        
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-medium">Available Tools</h3>
          </div>
          <div className="space-y-2">
            {chatState.availableTools.map((tool) => (
              <div key={tool.name} className="text-xs p-2 bg-muted rounded-md">
                <div className="font-medium">{tool.name}</div>
                <div className="text-muted-foreground">{tool.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-lg font-semibold">MCP-Enabled Chatbot</h1>
                <p className="text-sm text-muted-foreground">
                  Connected to {servers.filter(s => s.status === 'connected').length} servers
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {chatState.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                
                <div className={`max-w-[70%] ${message.role === 'user' ? 'order-first' : ''}`}>
                  <Card className={`p-3 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    {message.metadata && (
                      <div className="mt-2 pt-2 border-t border-border/20">
                        <div className="flex flex-wrap gap-1 text-xs opacity-70">
                          {message.metadata.tools && (
                            <div className="flex gap-1">
                              <Database className="h-3 w-3" />
                              {message.metadata.tools.join(', ')}
                            </div>
                          )}
                          {message.metadata.server && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {message.metadata.server}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                  <div className="text-xs text-muted-foreground mt-1 px-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-accent-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {chatState.isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <Card className="p-3 bg-card max-w-[70%]">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    Processing with MCP...
                  </div>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-card">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything... I can search, analyze code, query data, and more!"
                className="flex-1"
                disabled={chatState.isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || chatState.isLoading}
                className="px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>MCP Active</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                <span>{chatState.availableTools.length} tools available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}