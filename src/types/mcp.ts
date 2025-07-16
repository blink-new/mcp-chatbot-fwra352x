export interface MCPMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    tools?: string[]
    context?: string
    server?: string
  }
}

export interface MCPServer {
  id: string
  name: string
  url: string
  status: 'connected' | 'disconnected' | 'connecting' | 'error'
  capabilities: string[]
  lastPing?: Date
}

export interface MCPTool {
  name: string
  description: string
  parameters: Record<string, any>
  server: string
}

export interface GmailTool extends MCPTool {
  server: 'gmail-server'
  name: 'gmail_read' | 'gmail_send' | 'gmail_search' | 'gmail_compose' | 'gmail_manage'
}

export interface MCPContext {
  id: string
  name: string
  content: string
  type: 'document' | 'conversation' | 'tool_result'
  timestamp: Date
  relevance?: number
}

export interface ChatState {
  messages: MCPMessage[]
  isLoading: boolean
  currentServer?: string
  availableTools: MCPTool[]
  context: MCPContext[]
}