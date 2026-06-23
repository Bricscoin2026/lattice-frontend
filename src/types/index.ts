export interface User {
  id: string; lns_name: string; display_name: string
  role: 'director' | 'admin' | 'employee'; public_key: string
  tenant_id: string; created_at: string; avatar?: string; status?: 'online'|'offline'|'busy'
}

export interface Tenant {
  id: string; company_name: string; domain: string
  director_name: string; director_lns: string; public_key: string; registered_at: string
}

export interface CertifyMessage {
  id: string; from: string; to: string; subject: string; body: string
  time: string; timestamp: string; block: number; txId: string
  bodyHash: string; sigFrom: string; sigTo?: string
  status: 'draft'|'sent'|'delivered'|'read'|'trash'; folder: 'inbox'|'sent'|'drafts'|'trash'
  scheduled?: string; attachments: { name: string; size: string }[]
}

export interface FeedPost {
  id: string; author: string; authorLns: string; content: string; time: string
  likes: number; liked: boolean; comments: number
  image?: string; type: 'post'|'poll'|'announcement'
  pollOptions?: { text: string; votes: number; percentage: number }[]
  totalVotes?: number; voted?: boolean; pinned?: boolean
}

export interface ChatMessage {
  id: string; conversationId: string; sender: string; text: string
  time: string; status: 'sent'|'delivered'|'read'
}

export interface Conversation {
  id: string; participants: string[]; lastMessage?: string; lastTime?: string
  unread: number; isGroup: boolean; groupName?: string
}

export interface KeyFile {
  version: number; algorithm: string; lns_name: string; tenant_id: string
  did: string; public_key_hex: string; secret_key_hex: string; created_at: string
}
