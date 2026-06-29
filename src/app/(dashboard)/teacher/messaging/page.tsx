'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search, Send, ArrowLeft } from 'lucide-react'
import { messages as mockMessages, parents, students, teachers } from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'
import type { Message } from '@/types'

interface Conversation {
  participantId: string
  participantName: string
  participantAvatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  messages: Message[]
}

function getConversations(currentTeacher: { id: string }): Conversation[] {
  const teacherMessages = mockMessages.filter(
    (m) => m.senderId === currentTeacher.id || m.receiverId === currentTeacher.id
  )

  const participantMap = new Map<string, Message[]>()

  teacherMessages.forEach((msg) => {
    const participantId =
      msg.senderId === currentTeacher.id ? msg.receiverId : msg.senderId
    if (!participantMap.has(participantId)) {
      participantMap.set(participantId, [])
    }
    participantMap.get(participantId)!.push(msg)
  })

  const conversations: Conversation[] = []

  participantMap.forEach((msgs, participantId) => {
    const sortedMsgs = msgs.sort(
      (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    )
    const lastMsg = sortedMsgs[0]

    const participant =
      parents.find((p) => p.id === participantId) ||
      students.find((s) => s.id === participantId) ||
      teachers.find((t) => t.id === participantId)

    if (!participant) return

    const unreadCount = msgs.filter(
      (m) => m.receiverId === currentTeacher.id && !m.isRead
    ).length

    conversations.push({
      participantId,
      participantName: participant.name,
      participantAvatar: participant.avatar || '',
      lastMessage: lastMsg.content,
      lastMessageTime: lastMsg.sentAt,
      unreadCount,
      messages: sortedMsgs,
    })
  })

  return conversations.sort(
    (a, b) =>
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  )
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export default function MessagingPage() {
  const { user } = useAuthStore()
  const currentTeacher = teachers.find((t) => t.id === user?.id) || teachers[0]
  const [conversations] = useState<Conversation[]>(() => getConversations(currentTeacher))
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations
    return conversations.filter((c) =>
      c.participantName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [conversations, searchQuery])

  const displayMessages = useMemo(() => {
    if (!selectedConversation) return []
    const extra = localMessages[selectedConversation.participantId] || []
    const all = [...selectedConversation.messages, ...extra]
    return all.sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
    )
  }, [selectedConversation, localMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayMessages])

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const msg: Message = {
      id: `msg-local-${Date.now()}`,
      senderId: currentTeacher.id,
      receiverId: selectedConversation.participantId,
      subject: 'Re: Conversation',
      content: newMessage.trim(),
      isRead: true,
      sentAt: new Date().toISOString(),
    }

    setLocalMessages((prev) => ({
      ...prev,
      [selectedConversation.participantId]: [
        ...(prev[selectedConversation.participantId] || []),
        msg,
      ],
    }))
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with parents and students</p>
      </div>

      <Card className="overflow-hidden">
        <div className="flex h-[600px]">
          <div
            className={`w-full border-r sm:w-80 ${
              selectedConversation ? 'hidden sm:block' : ''
            }`}
          >
            <div className="border-b p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(600px-65px)]">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.participantId}
                    className={`flex cursor-pointer items-center gap-3 border-b p-4 transition-colors hover:bg-muted/50 ${
                      selectedConversation?.participantId === conversation.participantId
                        ? 'bg-muted'
                        : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={conversation.participantAvatar} />
                      <AvatarFallback>
                        {getInitials(conversation.participantName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {conversation.participantName}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="default" className="h-5 w-5 shrink-0 rounded-full p-0 text-xs flex items-center justify-center">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div
            className={`flex flex-1 flex-col ${
              selectedConversation ? '' : 'hidden sm:flex'
            }`}
          >
            {selectedConversation ? (
              <>
                <div className="flex items-center gap-3 border-b p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="sm:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={selectedConversation.participantAvatar} />
                    <AvatarFallback>
                      {getInitials(selectedConversation.participantName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {selectedConversation.participantName}
                    </p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {displayMessages.map((msg) => {
                    const isOwn = msg.senderId === currentTeacher.id
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg p-3 ${
                            isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`mt-1 text-xs ${
                              isOwn
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {formatTime(msg.sentAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <Send className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <h3 className="text-lg font-medium">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
