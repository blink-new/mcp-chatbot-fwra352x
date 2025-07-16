import { useState, useEffect } from 'react'
import { Mail, Send, Search, Star, Archive, Trash2, Reply, Forward, Paperclip, RefreshCw, Settings, Plus, Filter } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { Textarea } from './ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { toast } from './ui/use-toast'
import { 
  GmailMessage, 
  GmailThread, 
  GmailLabel, 
  GmailDraft, 
  GmailSearchQuery, 
  GmailComposeData,
  GmailAuthStatus,
  GmailQuota
} from '../types/gmail'

interface GmailIntegrationProps {
  onSendToChat: (message: string) => void
}

export function GmailIntegration({ onSendToChat }: GmailIntegrationProps) {
  const [authStatus, setAuthStatus] = useState<GmailAuthStatus>({
    isAuthenticated: false,
    scopes: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'],
  })
  
  const [messages, setMessages] = useState<GmailMessage[]>([])
  const [threads, setThreads] = useState<GmailThread[]>([])
  const [labels, setLabels] = useState<GmailLabel[]>([
    { id: 'INBOX', name: 'Inbox', type: 'system', messageCount: 42, unreadCount: 8 },
    { id: 'SENT', name: 'Sent', type: 'system', messageCount: 156, unreadCount: 0 },
    { id: 'DRAFT', name: 'Drafts', type: 'system', messageCount: 3, unreadCount: 0 },
    { id: 'SPAM', name: 'Spam', type: 'system', messageCount: 12, unreadCount: 2 },
    { id: 'TRASH', name: 'Trash', type: 'system', messageCount: 24, unreadCount: 0 },
    { id: 'work', name: 'Work', type: 'user', color: '#4285f4', messageCount: 28, unreadCount: 5 },
    { id: 'personal', name: 'Personal', type: 'user', color: '#34a853', messageCount: 15, unreadCount: 2 },
  ])
  
  const [selectedLabel, setSelectedLabel] = useState('INBOX')
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const [composeData, setComposeData] = useState<GmailComposeData>({
    to: [],
    subject: '',
    body: ''
  })
  
  const [quota, setQuota] = useState<GmailQuota>({
    used: 8.2,
    total: 15,
    percentage: 54.7
  })

  // Mock Gmail messages
  useEffect(() => {
    const mockMessages: GmailMessage[] = [
      {
        id: '1',
        threadId: 'thread-1',
        subject: 'Project Update - Q1 2024',
        from: 'sarah.johnson@company.com',
        to: ['me@gmail.com'],
        body: 'Hi team,\n\nI wanted to share the latest updates on our Q1 project milestones. We\'ve made significant progress on the user authentication system and the new dashboard interface.\n\nKey achievements:\n- User login/logout functionality completed\n- Dashboard wireframes approved\n- API endpoints for user management ready\n\nNext steps:\n- Begin frontend implementation\n- Set up testing environment\n- Schedule user feedback sessions\n\nLet me know if you have any questions!\n\nBest regards,\nSarah',
        snippet: 'Hi team, I wanted to share the latest updates on our Q1 project milestones...',
        date: new Date('2024-01-15T10:30:00'),
        isRead: false,
        isStarred: true,
        labels: ['INBOX', 'work'],
        attachments: [
          {
            id: 'att-1',
            filename: 'project-timeline.pdf',
            mimeType: 'application/pdf',
            size: 245760
          }
        ]
      },
      {
        id: '2',
        threadId: 'thread-2',
        subject: 'Meeting Reminder: Team Standup',
        from: 'calendar@company.com',
        to: ['me@gmail.com'],
        body: 'This is a reminder that you have a meeting scheduled:\n\nTeam Standup\nDate: Tomorrow, January 16, 2024\nTime: 9:00 AM - 9:30 AM\nLocation: Conference Room A / Zoom\n\nAgenda:\n- Sprint review\n- Blockers discussion\n- Next sprint planning\n\nJoin Zoom Meeting: https://zoom.us/j/123456789',
        snippet: 'This is a reminder that you have a meeting scheduled: Team Standup...',
        date: new Date('2024-01-15T08:00:00'),
        isRead: true,
        isStarred: false,
        labels: ['INBOX', 'work']
      },
      {
        id: '3',
        threadId: 'thread-3',
        subject: 'Welcome to Gmail Integration!',
        from: 'noreply@gmail.com',
        to: ['me@gmail.com'],
        body: 'Welcome to the Gmail integration in your MCP-enabled chatbot!\n\nYou can now:\n✉️ Read and manage your emails\n📤 Send new messages\n🔍 Search through your mailbox\n🏷️ Organize with labels\n📎 Handle attachments\n\nTry asking your chatbot:\n- "Show me unread emails"\n- "Compose an email to john@example.com"\n- "Search for emails from Sarah"\n- "What are my recent emails about?"\n\nEnjoy your enhanced email experience!',
        snippet: 'Welcome to the Gmail integration in your MCP-enabled chatbot!...',
        date: new Date('2024-01-15T07:45:00'),
        isRead: true,
        isStarred: false,
        labels: ['INBOX']
      }
    ]
    
    setMessages(mockMessages)
    
    // Simulate authentication after component mount
    setTimeout(() => {
      setAuthStatus({
        isAuthenticated: true,
        email: 'user@gmail.com',
        scopes: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'],
        expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
      })
    }, 1000)
  }, [])

  const handleAuthenticate = async () => {
    // Simulate OAuth flow
    toast({
      title: "Authenticating...",
      description: "Redirecting to Google OAuth",
    })
    
    setTimeout(() => {
      setAuthStatus({
        isAuthenticated: true,
        email: 'user@gmail.com',
        scopes: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'],
        expiresAt: new Date(Date.now() + 3600000)
      })
      
      toast({
        title: "Authentication successful!",
        description: "Gmail integration is now active",
      })
    }, 2000)
  }

  const handleSendMessage = async () => {
    if (!composeData.to.length || !composeData.subject || !composeData.body) {
      toast({
        title: "Missing required fields",
        description: "Please fill in recipient, subject, and message body",
        variant: "destructive"
      })
      return
    }

    // Simulate sending email
    toast({
      title: "Sending email...",
      description: `Sending to ${composeData.to.join(', ')}`,
    })

    setTimeout(() => {
      toast({
        title: "Email sent successfully!",
        description: `Message sent to ${composeData.to.join(', ')}`,
      })
      
      setIsComposing(false)
      setComposeData({ to: [], subject: '', body: '' })
    }, 1500)
  }

  const handleSearchEmails = (query: string) => {
    if (!query.trim()) return
    
    const filteredMessages = messages.filter(msg => 
      msg.subject.toLowerCase().includes(query.toLowerCase()) ||
      msg.body.toLowerCase().includes(query.toLowerCase()) ||
      msg.from.toLowerCase().includes(query.toLowerCase())
    )
    
    onSendToChat(`Found ${filteredMessages.length} emails matching "${query}":\n\n${
      filteredMessages.map(msg => 
        `📧 **${msg.subject}**\nFrom: ${msg.from}\nDate: ${msg.date.toLocaleDateString()}\nSnippet: ${msg.snippet.substring(0, 100)}...\n`
      ).join('\n')
    }`)
  }

  const handleEmailAction = (action: string, message: GmailMessage) => {
    switch (action) {
      case 'star':
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, isStarred: !msg.isStarred } : msg
        ))
        toast({
          title: message.isStarred ? "Removed star" : "Added star",
          description: `Email "${message.subject}" ${message.isStarred ? 'unstarred' : 'starred'}`,
        })
        break
      case 'archive':
        toast({
          title: "Email archived",
          description: `"${message.subject}" moved to archive`,
        })
        break
      case 'delete':
        toast({
          title: "Email deleted",
          description: `"${message.subject}" moved to trash`,
        })
        break
      case 'reply':
        setComposeData({
          to: [message.from],
          subject: `Re: ${message.subject}`,
          body: `\n\n--- Original Message ---\nFrom: ${message.from}\nDate: ${message.date.toLocaleString()}\nSubject: ${message.subject}\n\n${message.body}`
        })
        setIsComposing(true)
        break
    }
  }

  const formatEmailForChat = (message: GmailMessage) => {
    return `📧 **Email Summary**\n\n**Subject:** ${message.subject}\n**From:** ${message.from}\n**Date:** ${message.date.toLocaleString()}\n**Labels:** ${message.labels.join(', ')}\n\n**Content:**\n${message.body.substring(0, 500)}${message.body.length > 500 ? '...' : ''}\n\n${message.attachments?.length ? `**Attachments:** ${message.attachments.map(att => att.filename).join(', ')}` : ''}`
  }

  if (!authStatus.isAuthenticated) {
    return (
      <div className="p-6 text-center">
        <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Gmail Integration</h3>
        <p className="text-muted-foreground mb-4">
          Connect your Gmail account to read, send, and manage emails through the chatbot
        </p>
        <Button onClick={handleAuthenticate} className="gap-2">
          <Mail className="h-4 w-4" />
          Connect Gmail Account
        </Button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Gmail</h3>
            <Badge variant="secondary" className="text-xs">
              {authStatus.email}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsComposing(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Compose
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchEmails(searchQuery)}
            className="flex-1"
          />
          <Button variant="outline" size="sm" onClick={() => handleSearchEmails(searchQuery)}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Storage quota */}
        <div className="mt-3 text-xs text-muted-foreground">
          <div className="flex justify-between items-center">
            <span>Storage: {quota.used} GB of {quota.total} GB used</span>
            <span>{quota.percentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1 mt-1">
            <div 
              className="bg-primary h-1 rounded-full transition-all" 
              style={{ width: `${quota.percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Labels Sidebar */}
        <div className="w-48 border-r border-border p-3">
          <div className="space-y-1">
            {labels.map((label) => (
              <Button
                key={label.id}
                variant={selectedLabel === label.id ? "secondary" : "ghost"}
                className="w-full justify-between text-sm h-8"
                onClick={() => setSelectedLabel(label.id)}
              >
                <span className="flex items-center gap-2">
                  {label.color && (
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: label.color }}
                    />
                  )}
                  {label.name}
                </span>
                {label.unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {label.unreadCount}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 flex">
          <div className="w-80 border-r border-border">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {messages
                  .filter(msg => msg.labels.includes(selectedLabel))
                  .map((message) => (
                    <Card
                      key={message.id}
                      className={`p-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-accent' : ''
                      } ${!message.isRead ? 'border-l-4 border-l-primary' : ''}`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className={`text-sm ${!message.isRead ? 'font-semibold' : ''}`}>
                          {message.from.split('@')[0]}
                        </span>
                        <div className="flex items-center gap-1">
                          {message.isStarred && (
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          )}
                          {message.attachments?.length && (
                            <Paperclip className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      <div className={`text-sm mb-1 ${!message.isRead ? 'font-medium' : ''}`}>
                        {message.subject}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {message.snippet.substring(0, 80)}...
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {message.date.toLocaleDateString()}
                      </div>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </div>

          {/* Message Content */}
          <div className="flex-1 flex flex-col">
            {selectedMessage ? (
              <>
                <div className="p-4 border-b border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedMessage.subject}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        <div>From: {selectedMessage.from}</div>
                        <div>To: {selectedMessage.to.join(', ')}</div>
                        <div>Date: {selectedMessage.date.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEmailAction('star', selectedMessage)}
                      >
                        <Star className={`h-4 w-4 ${selectedMessage.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEmailAction('reply', selectedMessage)}
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEmailAction('archive', selectedMessage)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEmailAction('delete', selectedMessage)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSendToChat(formatEmailForChat(selectedMessage))}
                      >
                        Send to Chat
                      </Button>
                    </div>
                  </div>
                  
                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedMessage.attachments.map((attachment) => (
                        <Badge key={attachment.id} variant="outline" className="gap-1">
                          <Paperclip className="h-3 w-3" />
                          {attachment.filename}
                          <span className="text-xs text-muted-foreground">
                            ({(attachment.size / 1024).toFixed(1)} KB)
                          </span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {selectedMessage.body}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select an email to read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Dialog */}
      <Dialog open={isComposing} onOpenChange={setIsComposing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">To</label>
              <Input
                placeholder="recipient@example.com"
                value={composeData.to.join(', ')}
                onChange={(e) => setComposeData(prev => ({
                  ...prev,
                  to: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">CC</label>
                <Input
                  placeholder="cc@example.com"
                  value={composeData.cc?.join(', ') || ''}
                  onChange={(e) => setComposeData(prev => ({
                    ...prev,
                    cc: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                  }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">BCC</label>
                <Input
                  placeholder="bcc@example.com"
                  value={composeData.bcc?.join(', ') || ''}
                  onChange={(e) => setComposeData(prev => ({
                    ...prev,
                    bcc: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                  }))}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                placeholder="Email subject"
                value={composeData.subject}
                onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Write your message..."
                value={composeData.body}
                onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                rows={10}
              />
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsComposing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage} className="gap-2">
                <Send className="h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}