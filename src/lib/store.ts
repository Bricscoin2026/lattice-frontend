import { create } from 'zustand'
import type { User, Tenant, CertifyMessage, FeedPost, Conversation, ChatMessage } from '../types'

interface AppState {
  user: User | null; tenant: Tenant | null; token: string | null; isAuthenticated: boolean
  messages: CertifyMessage[]; feedPosts: FeedPost[]
  conversations: Conversation[]; chatMessages: ChatMessage[]
  employees: User[]

  login: (u: User, t: string, tn: Tenant) => void
  logout: () => void
  addMessage: (m: CertifyMessage) => void
  updateMessage: (id: string, updates: Partial<CertifyMessage>) => void
  deleteMessage: (id: string) => void
  addFeedPost: (p: FeedPost) => void
  likePost: (id: string) => void
  addEmployee: (e: User) => void
  removeEmployee: (id: string) => void
  updateAvatar: (a: string) => void
  addConversation: (c: Conversation) => void
  addChatMessage: (m: ChatMessage) => void
}

const loadFromStorage = <T>(key: string, fallback: T): T => {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback }
  catch { return fallback }
}

export const useStore = create<AppState>((set, get) => ({
  user: loadFromStorage<User|null>('lu', null),
  tenant: loadFromStorage<Tenant|null>('ltn', null),
  token: localStorage.getItem('lt'),
  isAuthenticated: !!localStorage.getItem('lt'),
  messages: loadFromStorage<CertifyMessage[]>('lmsgs', []),
  feedPosts: loadFromStorage<FeedPost[]>('lfeed', []),
  conversations: loadFromStorage<Conversation[]>('lconv', []),
  chatMessages: loadFromStorage<ChatMessage[]>('lchat', []),
  employees: loadFromStorage<User[]>('lemp', []),

  login: (u, t, tn) => {
    localStorage.setItem('lu', JSON.stringify(u))
    localStorage.setItem('lt', t)
    localStorage.setItem('ltn', JSON.stringify(tn))
    set({ user: u, token: t, tenant: tn, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem('lu'); localStorage.removeItem('lt'); localStorage.removeItem('ltn')
    set({ user: null, token: null, tenant: null, isAuthenticated: false })
  },
  addMessage: (m) => {
    const msgs = [m, ...get().messages]
    localStorage.setItem('lmsgs', JSON.stringify(msgs))
    set({ messages: msgs })
  },
  updateMessage: (id, updates) => {
    const msgs = get().messages.map(m => m.id === id ? { ...m, ...updates } : m)
    localStorage.setItem('lmsgs', JSON.stringify(msgs))
    set({ messages: msgs })
  },
  deleteMessage: (id) => {
    const msgs = get().messages.filter(m => m.id !== id)
    localStorage.setItem('lmsgs', JSON.stringify(msgs))
    set({ messages: msgs })
  },
  addFeedPost: (p) => {
    const posts = [p, ...get().feedPosts]
    localStorage.setItem('lfeed', JSON.stringify(posts))
    set({ feedPosts: posts })
  },
  likePost: (id) => {
    const posts = get().feedPosts.map(p => p.id === id ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked } : p)
    localStorage.setItem('lfeed', JSON.stringify(posts))
    set({ feedPosts: posts })
  },
  addEmployee: (e) => {
    const emps = [...get().employees, e]
    localStorage.setItem('lemp', JSON.stringify(emps))
    set({ employees: emps })
  },
  removeEmployee: (id) => {
    const emps = get().employees.filter(e => e.id !== id)
    localStorage.setItem('lemp', JSON.stringify(emps))
    set({ employees: emps })
  },
  updateAvatar: (a) => {
    const u = { ...get().user!, avatar: a }
    localStorage.setItem('lu', JSON.stringify(u))
    set({ user: u })
  },
  addConversation: (c) => {
    const convs = [c, ...get().conversations]
    localStorage.setItem('lconv', JSON.stringify(convs))
    set({ conversations: convs })
  },
  addChatMessage: (m) => {
    const msgs = [...get().chatMessages, m]
    localStorage.setItem('lchat', JSON.stringify(msgs))
    set({ chatMessages: msgs })
  },
}))
