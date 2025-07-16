export interface GmailMessage {
  id: string
  threadId: string
  subject: string
  from: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  body: string
  snippet: string
  date: Date
  isRead: boolean
  isStarred: boolean
  labels: string[]
  attachments?: GmailAttachment[]
}

export interface GmailAttachment {
  id: string
  filename: string
  mimeType: string
  size: number
  data?: string
}

export interface GmailThread {
  id: string
  subject: string
  messages: GmailMessage[]
  participants: string[]
  lastMessageDate: Date
  isUnread: boolean
  messageCount: number
}

export interface GmailLabel {
  id: string
  name: string
  type: 'system' | 'user'
  color?: string
  messageCount: number
  unreadCount: number
}

export interface GmailDraft {
  id: string
  subject: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  body: string
  createdAt: Date
  updatedAt: Date
}

export interface GmailSearchQuery {
  query: string
  from?: string
  to?: string
  subject?: string
  hasAttachment?: boolean
  isUnread?: boolean
  label?: string
  after?: Date
  before?: Date
  limit?: number
}

export interface GmailComposeData {
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  body: string
  attachments?: File[]
  replyToMessageId?: string
  forwardMessageId?: string
}

export interface GmailAuthStatus {
  isAuthenticated: boolean
  email?: string
  scopes: string[]
  expiresAt?: Date
}

export interface GmailQuota {
  used: number
  total: number
  percentage: number
}