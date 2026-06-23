import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Send, Paperclip, Image, Smile, ShieldCheck, Lock, Heart, MessageCircle, Share2, BarChart3, Users, Phone, Video, MoreVertical, Plus, Mail, LogOut } from 'lucide-react'
import { useStore } from '../lib/store'
import type { FeedPost, Conversation, ChatMessage } from '../types'

export default function PulsePage() {
  const navigate = useNavigate()
  const { user, tenant, feedPosts, addFeedPost, likePost, conversations, chatMessages, addConversation, addChatMessage, updateAvatar, logout } = useStore()
  const [activeTab, setActiveTab] = useState<'feed'|'chat'>('feed')
  const [newPost, setNewPost] = useState('')
  const [postImage, setPostImage] = useState<string | null>(null)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [inCall, setInCall] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const avatarRef = useRef<HTMLInputElement>(null)

  const contacts: Conversation[] = [
    { id: '1', participants: ['alice@acme.lns', user?.lns_name || ''], lastMessage: 'Ciao! Come stai?', lastTime: '14:32', unread: 2, isGroup: false },
    { id: '2', participants: ['bob@acme.lns', user?.lns_name || ''], lastMessage: 'Documento inviato ✅', lastTime: '13:15', unread: 0, isGroup: false },
    { id: '3', participants: ['Dev Team'], lastMessage: 'Dave: Deploy in produzione 🚀', lastTime: '11:45', unread: 5, isGroup: true, groupName: 'Dev Team' },
  ]

  const handlePublish = () => {
    if (!newPost.trim()) return
    addFeedPost({
      id: Date.now().toString(), author: user?.display_name || '', authorLns: user?.lns_name || '',
      content: newPost, time: 'Ora', likes: 0, liked: false, comments: 0,
      image: postImage || undefined, type: 'post'
    })
    setNewPost(''); setPostImage(null)
  }

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedChat) return
    addChatMessage({
      id: Date.now().toString(), conversationId: selectedChat,
      sender: user?.lns_name || '', text: chatInput,
      time: new Date().toLocaleTimeString('it', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    })
    setChatInput('')
  }

  const selected = contacts.find(c => c.id === selectedChat)

  return (
    <div className="flex h-screen" style={{ background: '#0a0a0f' }}>
      {/* SIDEBAR */}
      <div className="w-[260px] border-r border-[#1e1e2e] flex flex-col py-4">
        {/* Profilo */}
        <div className="px-4 pb-4 border-b border-[#1e1e2e] mb-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative cursor-pointer" onClick={() => avatarRef.current?.click()}>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg" style={user?.avatar ? { backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover' } : {}}>
                {!user?.avatar && user?.display_name?.[0]}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0f]" />
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => {
                const f = e.target.files?.[0]; if (!f) return
                const r = new FileReader(); r.onload = ev => updateAvatar(ev.target?.result as string); r.readAsDataURL(f)
              }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.display_name}</p>
              <p className="text-[10px] text-[#6b6b80] truncate">{user?.lns_name}</p>
            </div>
          </div>
        </div>

        {/* Tab */}
        <div className="flex px-4 gap-1 mb-3">
          <button onClick={() => setActiveTab('feed')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'feed' ? 'bg-[#2563eb] text-white' : 'text-[#a0a0b0] hover:text-white'}`}>📰 Feed</button>
          <button onClick={() => setActiveTab('chat')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'chat' ? 'bg-[#2563eb] text-white' : 'text-[#a0a0b0] hover:text-white'}`}>💬 Chat</button>
        </div>

        {activeTab === 'chat' && (
          <div className="flex-1 overflow-y-auto px-2">
            {contacts.map(c => (
              <button key={c.id} onClick={() => setSelectedChat(c.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${selectedChat === c.id ? 'bg-[#16161f]' : 'hover:bg-[#16161f]/50'}`}>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {c.isGroup ? '👥' : (c.participants[0]?.[0]?.toUpperCase() || '?')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between"><span className="text-sm font-semibold">{c.isGroup ? c.groupName : c.participants[0]?.split('@')[0]}</span><span className="text-[10px] text-[#6b6b80]">{c.lastTime}</span></div>
                  <p className="text-xs text-[#a0a0b0] truncate">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-[#2563eb] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{c.unread}</span>}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="flex-1 overflow-y-auto px-4">
            <p className="text-[10px] text-[#6b6b80] uppercase tracking-wider mb-2">Gruppi</p>
            {['Dev Team (12)', 'Marketing (8)', 'Dirigenza (3)'].map(g => (
              <div key={g} className="py-1.5 text-sm text-[#a0a0b0] cursor-pointer hover:text-white">👥 {g}</div>
            ))}
            <button className="mt-2 w-full py-2 border border-[#1e1e2e] rounded-lg text-sm text-blue-400">+ Crea gruppo</button>
          </div>
        )}

        <div className="mt-auto border-t border-[#1e1e2e] pt-3 px-4 space-y-1">
          <button onClick={() => navigate('/certify')} className="w-full py-2 text-sm text-[#a0a0b0] hover:text-white flex items-center gap-2"><Mail className="w-4 h-4" /> Certify</button>
          <button onClick={() => { logout(); navigate('/') }} className="w-full py-2 text-sm text-[#a0a0b0] hover:text-red-400 flex items-center gap-2"><LogOut className="w-4 h-4" /> Esci</button>
        </div>
      </div>

      {/* CONTENUTO */}
      {activeTab === 'feed' ? (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[640px] mx-auto">
            {/* Nuovo post */}
            <div className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-4 mb-5">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {user?.display_name?.[0]}
                </div>
                <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Condividi un aggiornamento..."
                  className="flex-1 p-2.5 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-white text-sm outline-none resize-none min-h-[60px]" />
              </div>
              {postImage && <div className="relative mb-3"><img src={postImage} alt="" className="max-w-full max-h-[200px] rounded-lg" /><button onClick={() => setPostImage(null)} className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 text-xs">✕</button></div>}
              <div className="flex justify-end gap-2">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => {
                  const f = e.target.files?.[0]; if (!f) return
                  const r = new FileReader(); r.onload = ev => setPostImage(ev.target?.result as string); r.readAsDataURL(f)
                }} />
                <button onClick={() => fileRef.current?.click()} className="px-3 py-1.5 border border-[#1e1e2e] rounded-lg text-xs text-[#a0a0b0] flex items-center gap-1"><Image className="w-3.5 h-3.5" /> Foto</button>
                <button onClick={handlePublish} className="px-4 py-1.5 bg-[#2563eb] text-white rounded-lg text-xs font-semibold">Pubblica</button>
              </div>
            </div>

            {/* Feed */}
            {feedPosts.length === 0 ? (
              <div className="text-center py-12 text-[#6b6b80]"><Users className="w-10 h-10 mx-auto mb-3 text-[#1e1e2e]" /><p>Nessun post. Pubblica il primo!</p></div>
            ) : feedPosts.map(p => (
              <div key={p.id} className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">{p.author[0]}</div>
                  <div><p className="font-semibold text-sm">{p.author}</p><p className="text-[10px] text-[#6b6b80]">{p.time}</p></div>
                </div>
                <p className="text-sm leading-relaxed mb-3">{p.content}</p>
                {p.image && <img src={p.image} alt="" className="max-w-full rounded-lg mb-3" />}
                <div className="flex gap-4 pt-3 border-t border-[#1e1e2e]">
                  <button onClick={() => likePost(p.id)} className={`flex items-center gap-1.5 text-xs ${p.liked ? 'text-red-500' : 'text-[#6b6b80]'} hover:text-red-400`}>
                    <Heart className={`w-4 h-4 ${p.liked ? 'fill-red-500' : ''}`} /> {p.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-[#6b6b80] hover:text-white"><MessageCircle className="w-4 h-4" /> {p.comments}</button>
                  <button className="flex items-center gap-1.5 text-xs text-[#6b6b80] hover:text-white"><Share2 className="w-4 h-4" /> Condividi</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : selected ? (
        /* CHAT */
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-[#1e1e2e] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">{selected.isGroup ? '👥' : selected.participants[0]?.[0]?.toUpperCase()}</div>
            <div className="flex-1"><p className="font-semibold text-sm">{selected.isGroup ? selected.groupName : selected.participants[0]?.split('@')[0]}</p><p className="text-[10px] text-green-500">Online</p></div>
            <div className="flex gap-1">
              <button onClick={() => setInCall(true)} className="p-2 text-[#a0a0b0] hover:text-white rounded-lg"><Phone className="w-5 h-5" /></button>
              <button onClick={() => setInCall(true)} className="p-2 text-[#a0a0b0] hover:text-white rounded-lg"><Video className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Schermata chiamata */}
          {inCall && (
            <div className="flex-1 bg-[#111118] flex items-center justify-center flex-col gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">{selected.participants[0]?.[0]?.toUpperCase()}</div>
              <p className="text-lg font-bold">{selected.participants[0]?.split('@')[0]}</p>
              <p className="text-green-500 text-sm">Chiamata in corso...</p>
              <p className="text-[#6b6b80] text-xs">Crittografia E2EE · WebRTC P2P</p>
              <button onClick={() => setInCall(false)} className="px-6 py-3 bg-red-600 text-white rounded-full font-bold mt-4">❌ Termina</button>
            </div>
          )}

          {!inCall && (
            <>
              <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center text-[#6b6b80] text-sm">
                <div className="text-center">
                  <Lock className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p>Chat E2EE con {selected.isGroup ? selected.groupName : selected.participants[0]?.split('@')[0]}</p>
                  <p className="text-[10px] mt-1">Double Ratchet PQXDH · ML-KEM-768</p>
                </div>
              </div>
              <div className="p-3 border-t border-[#1e1e2e]">
                <div className="flex items-center gap-2 bg-[#16161f] border border-[#1e1e2e] rounded-xl px-3 py-2">
                  <Paperclip className="w-4 h-4 text-[#6b6b80] cursor-pointer" />
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Scrivi un messaggio..." className="flex-1 bg-transparent text-white text-sm outline-none" onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
                  <Smile className="w-4 h-4 text-[#6b6b80] cursor-pointer" />
                  <button onClick={handleSendMessage} className="p-1.5 bg-[#2563eb] rounded-lg text-white"><Send className="w-4 h-4" /></button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-[#6b6b80] flex-col gap-2">
          <Users className="w-12 h-12 text-[#1e1e2e]" /><p>Seleziona una chat o naviga nel Feed</p>
        </div>
      )}
    </div>
  )
}
