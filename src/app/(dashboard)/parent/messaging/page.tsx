'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Search, MessageSquare } from 'lucide-react';
import { students, teachers, messages as mockMessages } from '@/lib/mock-data';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';

export default function ParentMessagingPage() {
  const { user } = useAuthStore()
  const parentChildren = students.filter(
    (s) => s.parentId === user?.id
  );
  const [selectedChildId, setSelectedChildId] = useState(parentChildren[0]?.id || '');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = teachers.map((teacher) => {
    const thread = mockMessages.filter(
      (m) =>
        (m.senderId === teacher.id && m.receiverId === user?.id) ||
        (m.senderId === user?.id && m.receiverId === teacher.id)
    );
    const lastMessage = thread[thread.length - 1];
    const unread = thread.filter((m) => !m.isRead && m.receiverId === user?.id).length;
    return {
      teacher,
      lastMessage,
      unread,
      thread,
    };
  });

  const filteredConversations = conversations.filter((c) =>
    c.teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConversation = conversations.find((c) => c.teacher.id === selectedConversation);

  const displayMessages = activeConversation && selectedConversation
    ? [...activeConversation.thread, ...(localMessages[selectedConversation] || [])].sort(
        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      )
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.thread.length]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    const msg: Message = {
      id: `msg-local-${Date.now()}`,
      senderId: user?.id || '',
      receiverId: selectedConversation,
      subject: 'Re: Conversation',
      content: newMessage.trim(),
      isRead: true,
      sentAt: new Date().toISOString(),
    };
    setLocalMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), msg],
    }));
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teacher Messaging</h1>
          <p className="text-muted-foreground">Communicate with your child&apos;s teachers</p>
        </div>
        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Regarding child" />
          </SelectTrigger>
          <SelectContent>
            {parentChildren.map((child) => (
              <SelectItem key={child.id} value={child.id}>
                {child.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid h-[calc(100vh-280px)] gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="flex flex-col">
          <CardHeader className="border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No conversations found.</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.teacher.id}
                    onClick={() => setSelectedConversation(conv.teacher.id)}
                    className={cn(
                      'flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50',
                      selectedConversation === conv.teacher.id && 'bg-muted'
                    )}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conv.teacher.avatar} alt={conv.teacher.name} />
                      <AvatarFallback>
                        {conv.teacher.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{conv.teacher.name}</p>
                        {conv.unread > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-[10px]">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {conv.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          {activeConversation ? (
            <>
              <CardHeader className="border-b p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activeConversation.teacher.avatar} alt={activeConversation.teacher.name} />
                    <AvatarFallback>
                      {activeConversation.teacher.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{activeConversation.teacher.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {activeConversation.teacher.specialization}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                  {displayMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No messages yet. Start a conversation!</p>
                    </div>
                  ) : (
                    displayMessages.map((msg) => {
                      const isParent = msg.senderId === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={cn('flex', isParent ? 'justify-end' : 'justify-start')}
                        >
                          <div
                            className={cn(
                              'max-w-[75%] rounded-xl px-4 py-3',
                              isParent
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            )}
                          >
                            <p className="text-xs font-medium opacity-70">{msg.subject}</p>
                            <p className="text-sm">{msg.content}</p>
                            <p
                              className={cn(
                                'mt-1 text-[10px]',
                                isParent ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              )}
                            >
                              {new Date(msg.sentAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={1}
                    className="min-h-[44px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">
                Choose a teacher to start messaging
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
