import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Paperclip, ShieldCheck, Download, Hash, Lock, Mail, X, Clock, Send, FileText, Inbox, SendIcon, FileEdit, Trash2, Eye, EyeOff, Plus, Calendar, LayoutDashboard, LogOut, Users, MessageCircle } from 'lucide-react'
import { useStore } from '../lib/store'
import { generateMessageHash, generateSignature, generateTxId } from '../lib/crypto'
import type { CertifyMessage } from '../types'

export default function CertifyPage() {
  const navigate = useNavigate()
  const { user, tenant, messages, addMessage, updateMessage, deleteMessage, employees, addEmployee, removeEmployee, logout } = useStore()
  const myLns = user?.lns_name || ''

  const [folder, setFolder] = useState<'inbox'|'sent'|'drafts'|'trash'>('inbox')
  const [sel, setSel] = useState<string | null>(null)
  const [comp, setComp] = useState(false)
  const [showBody, setShowBody] = useState(false)
  const [receipt, setReceipt] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [search, setSearch] = useState('')

  // Composer
  const [to, setTo] = useState('')
  const [subj, setSubj] = useState('')
  const [body, setBody] = useState('')
  const [att, setAtt] = useState<{ name: string; size: string }[]>([])
  const [scheduled, setScheduled] = useState(false)
  const [schedDate, setSchedDate] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Dashboard
  const [newEmpFirst, setNEF] = useState('')
  const [newEmpLast, setNEL] = useState('')
  const [newEmpRole, setNER] = useState<'admin'|'employee'>('employee')
  const [genEmpKey, setGenEmpKey] = useState<any>(null)

  const isDirector = user?.role === 'director'
  const isAdmin = user?.role === 'admin' || isDirector

  const handleSend = () => {
    if (!to || !subj) return
    const now = new Date()
    const msg: CertifyMessage = {
      id: Date.now().toString(), from: myLns, to, subject: subj, body,
      time: now.toLocaleTimeString('it', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.toISOString(), block: Math.floor(Math.random() * 1000) + 4000,
      txId: generateTxId(), bodyHash: generateMessageHash(),
      sigFrom: generateSignature(),
      status: scheduled ? 'draft' : 'sent', folder: scheduled ? 'drafts' : 'sent',
      scheduled: scheduled ? schedDate : undefined, attachments: att
    }
    addMessage(msg)
    setComp(false); setTo(''); setSubj(''); setBody(''); setAtt([]); setScheduled(false)
  }

  const handleRead = (msg: CertifyMessage) => {
    if (msg.status === 'sent' || msg.status === 'delivered') {
      updateMessage(msg.id, { status: 'read', sigTo: generateSignature(), folder: 'inbox' })
    }
  }

  const handlePrintPDF = (msg: CertifyMessage) => {
    const win = window.open('', '_blank')!
    win.document.write(`<html><head><title>Ricevuta Certify - ${msg.subject}</title><style>body{font-family:monospace;padding:40px;max-width:800px;margin:auto}h1{color:#2563eb}.stamp{border:2px solid #22c55e;padding:16px;border-radius:8px;margin:20px 0}</style></head><body>
      <h1>📨 Lattice Certify — Ricevuta</h1><div class="stamp"><strong>Valore legale:</strong> Art. 45 CAD (eIDAS)</div>
      <p><strong>Mittente:</strong> ${msg.from}</p><p><strong>Destinatario:</strong> ${msg.to}</p><p><strong>Oggetto:</strong> ${msg.subject}</p><p><strong>Data:</strong> ${new Date(msg.timestamp).toLocaleString('it')}</p><p><strong>Blocco:</strong> #${msg.block}</p><p><strong>TX ID:</strong> ${msg.txId}</p>
      <h2>Hash (SHA3-512)</h2><pre>${msg.bodyHash}</pre><h2>Firma Mittente</h2><pre>${msg.sigFrom}</pre>${msg.sigTo?`<h2>Firma Destinatario</h2><pre>${msg.sigTo}</pre>`:''}<h2>Contenuto</h2><pre>${msg.body}</pre></body></html>`)
    win.print()
  }

  const handleDelete = (id: string) => updateMessage(id, { status: 'trash', folder: 'trash' })
  const handleRestore = (id: string) => updateMessage(id, { status: 'draft', folder: 'drafts' })
  const handlePermanentDelete = (id: string) => deleteMessage(id)

  const filtered = messages.filter(m => {
    if (folder === 'inbox') return (m.to === myLns || m.folder === 'inbox') && m.status !== 'trash' && m.status !== 'draft'
    if (folder === 'sent') return m.from === myLns && m.status === 'sent'
    if (folder === 'drafts') return m.status === 'draft' && m.status !== 'trash'
    if (folder === 'trash') return m.status === 'trash'
    return false
  }).filter(m => !search || m.subject.toLowerCase().includes(search.toLowerCase()) || m.from.includes(search) || m.to.includes(search))

  const selected = messages.find(m => m.id === sel)

  // ============ DASHBOARD VIEW ============
  if (showDashboard && isAdmin) return (
    <div className="flex h-screen" style={{ background: '#0a0a0f' }}>
      <div className="w-[220px] border-r border-[#1e1e2e] p-4 flex flex-col gap-1">
        <button onClick={() => setShowDashboard(false)} className="w-full py-2.5 bg-[#2563eb] text-white font-semibold rounded-lg mb-3">📨 Torna a Certify</button>
        {[
          { id: 'inbox', icon: Inbox, label: 'Posta in arrivo' },
          { id: 'sent', icon: SendIcon, label: 'Inviati' },
          { id: 'drafts', icon: FileEdit, label: 'Bozze' },
          { id: 'trash', icon: Trash2, label: 'Cestino' },
        ].map(f => (
          <button key={f.id} onClick={() => { setFolder(f.id as any); setShowDashboard(false) }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${folder === f.id ? 'bg-[#16161f] text-white' : 'text-[#a0a0b0] hover:text-white'}`}>
            <f.icon className="w-4 h-4" /> {f.label}
          </button>
        ))}
      </div>
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">👑 Dashboard — {tenant?.company_name}</h1>
        <p className="text-[#6b6b80] mb-8">{tenant?.domain} · Direttore: {user?.display_name}</p>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[{ l: 'Dipendenti', v: employees.length, c: '#60a5fa' }, { l: 'Admin', v: employees.filter(e => e.role === 'admin').length, c: '#a78bfa' }, { l: 'Messaggi', v: messages.length, c: '#22c55e' }].map(k => (
            <div key={k.l} className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-6 text-center">
              <p className="text-3xl font-extrabold" style={{ color: k.c }}>{k.v}</p>
              <p className="text-[#6b6b80] text-sm mt-1">{k.l}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-blue-400" /> Gestione Dipendenti</h2>
          <div className="flex gap-3 mb-4 flex-wrap">
            <input value={newEmpFirst} onChange={e => setNEF(e.target.value)} placeholder="Nome" className="flex-1 min-w-[120px] p-2.5 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-white text-sm outline-none" />
            <input value={newEmpLast} onChange={e => setNEL(e.target.value)} placeholder="Cognome" className="flex-1 min-w-[120px] p-2.5 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-white text-sm outline-none" />
            <select value={newEmpRole} onChange={e => setNER(e.target.value as any)} className="flex-1 min-w-[120px] p-2.5 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-white text-sm outline-none">
              <option value="employee">Dipendente</option><option value="admin">Amministratore</option>
            </select>
            <button onClick={() => {
              if (!newEmpFirst || !newEmpLast) return
              const lns = `${newEmpFirst.toLowerCase()}.${newEmpLast.toLowerCase()}@${tenant?.domain}`
              const kf = { ...generateKeyFile(lns), role: newEmpRole }
              addEmployee({ id: Date.now().toString(), lns_name: lns, display_name: `${newEmpFirst} ${newEmpLast}`, role: newEmpRole, public_key: kf.public_key_hex, tenant_id: '1', created_at: new Date().toISOString() })
              setGenEmpKey(kf); setNEF(''); setNEL('')
            }} className="px-4 py-2.5 bg-[#2563eb] text-white font-semibold rounded-lg flex items-center gap-2">
              <Plus className="w-4 h-4" /> Aggiungi
            </button>
          </div>
          {genEmpKey && (
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 mb-4">
              <p className="text-yellow-500 text-sm mb-3">🔑 Chiave generata per {genEmpKey.lns_name}</p>
              <button onClick={() => { const b = new Blob([JSON.stringify(genEmpKey, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${genEmpKey.lns_name.replace(/[@.]/g, '_')}_key.json`; a.click(); setGenEmpKey(null) }}
                className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg text-sm">📥 Scarica file chiave</button>
            </div>
          )}
          {employees.map(e => (
            <div key={e.id} className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-lg border border-[#1e1e2e] mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${e.role === 'admin' ? 'bg-blue-500' : 'bg-[#6b6b80]'}`}>{e.display_name[0]}</div>
                <div><p className="text-sm font-semibold">{e.display_name}</p><p className="text-[10px] text-[#6b6b80]">{e.lns_name}</p></div>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full ${e.role === 'admin' ? 'bg-blue-500/10 text-blue-400' : 'bg-[#6b6b80]/10 text-[#6b6b80]'}`}>{e.role === 'admin' ? '🛡️ Admin' : '👤 Dipendente'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ============ CERTIFY VIEW ============
  return (
    <div className="flex h-screen" style={{ background: '#0a0a0f' }}>
      {/* SIDEBAR */}
      <div className="w-[220px] border-r border-[#1e1e2e] flex flex-col py-4">
        <button onClick={() => setComp(true)} className="mx-4 mb-4 py-2.5 bg-[#2563eb] text-white font-semibold rounded-lg flex items-center justify-center gap-2 text-sm">
          <FileText className="w-4 h-4" /> Scrivi
        </button>

        {[
          { id: 'inbox', icon: Inbox, label: 'Posta in arrivo', count: messages.filter(m => m.to === myLns && m.status !== 'trash').length },
          { id: 'sent', icon: SendIcon, label: 'Inviati', count: messages.filter(m => m.from === myLns && m.status === 'sent').length },
          { id: 'drafts', icon: FileEdit, label: 'Bozze', count: messages.filter(m => m.status === 'draft').length },
          { id: 'trash', icon: Trash2, label: 'Cestino', count: messages.filter(m => m.status === 'trash').length },
        ].map(f => (
          <button key={f.id} onClick={() => { setFolder(f.id as any); setSel(null) }}
            className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${folder === f.id ? 'bg-[#16161f] text-white font-semibold' : 'text-[#a0a0b0] hover:text-white'}`}>
            <f.icon className="w-4 h-4" /><span className="flex-1 text-left">{f.label}</span>
            {f.count > 0 && <span className="text-[10px] text-[#6b6b80]">{f.count}</span>}
          </button>
        ))}

        <div className="mt-auto border-t border-[#1e1e2e] pt-3 px-4 space-y-1">
          {isAdmin && <button onClick={() => setShowDashboard(true)} className="w-full py-2 text-sm text-[#a0a0b0] hover:text-white flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Dashboard</button>}
          <button onClick={() => setShowCalendar(!showCalendar)} className="w-full py-2 text-sm text-[#a0a0b0] hover:text-white flex items-center gap-2"><Calendar className="w-4 h-4" /> Calendario</button>
          <button onClick={() => navigate('/pulse')} className="w-full py-2 text-sm text-[#a0a0b0] hover:text-white flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Pulse</button>
          <div className="flex items-center gap-2 pt-2">
            <div className={`w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-[10px] ${isDirector ? 'bg-yellow-500' : isAdmin ? 'bg-blue-500' : 'bg-[#6b6b80]'}`}>{user?.display_name?.[0]}</div>
            <div className="flex-1 min-w-0"><p className="text-xs font-semibold truncate">{user?.display_name}</p><p className="text-[10px] text-[#6b6b80]">{isDirector ? '👑 Direttore' : isAdmin ? '🛡️ Admin' : '👤'}</p></div>
            <button onClick={() => { logout(); navigate('/') }} className="text-[#6b6b80] hover:text-red-400"><LogOut className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      {/* CALENDAR */}
      {showCalendar && (
        <div className="w-[280px] border-r border-[#1e1e2e] p-4 overflow-y-auto">
          <h3 className="font-bold mb-3">📅 Giugno 2026</h3>
          <div className="grid grid-cols-7 gap-1 mb-4 text-[10px] text-[#6b6b80]">
            {['L','M','M','G','V','S','D'].map(d => <div key={d} className="text-center">{d}</div>)}
            {Array.from({ length: 30 }, (_, i) => i + 1).map(d => {
              const has = messages.some(m => m.scheduled && new Date(m.scheduled).getDate() === d)
              return <div key={d} className={`text-center py-1 rounded text-xs ${has ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-[#a0a0b0]'}`}>{d}</div>
            })}
          </div>
          <h4 className="font-semibold text-sm mb-2">Programmati</h4>
          {messages.filter(m => m.scheduled).map(m => (
            <div key={m.id} className="bg-[#0a0a0f] rounded-lg p-2 mb-1 text-xs">
              <p className="font-semibold">{m.subject}</p>
              <p className="text-[#6b6b80]">{m.to} · {m.scheduled && new Date(m.scheduled).toLocaleDateString('it')}</p>
            </div>
          ))}
        </div>
      )}

      {/* LISTA */}
      <div className="w-[420px] border-r border-[#1e1e2e] flex flex-col">
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b80]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca..." className="w-full pl-10 pr-4 py-2 bg-[#16161f] border border-[#1e1e2e] rounded-lg text-white text-sm outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#6b6b80]"><Mail className="w-10 h-10 mx-auto mb-3 text-[#1e1e2e]" /><p className="text-sm">Nessun messaggio</p></div>
          ) : filtered.map(m => (
            <button key={m.id} onClick={() => { setSel(m.id); if (folder === 'inbox') handleRead(m) }}
              className={`w-full flex gap-3 p-3.5 border-b border-[#1e1e2e] text-left transition-colors ${sel === m.id ? 'bg-[#16161f]' : 'hover:bg-[#16161f]/50'}`}>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {(folder === 'inbox' ? m.from : m.to)[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold">{folder === 'inbox' ? m.from.split('@')[0] : m.to.split('@')[0]}</span>
                  <span className="text-[10px] text-[#6b6b80]">{m.time}</span>
                </div>
                <p className="text-sm text-[#d1d1d6] truncate">{m.subject}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    m.status === 'read' ? 'bg-green-500/10 text-green-500' :
                    m.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>{m.status === 'read' ? '✓✓ Letta' : m.status === 'draft' ? '📝 Bozza' : '📨 Inviata'}</span>
                  <span className="text-[10px] text-[#6b6b80] font-mono">#{m.block}</span>
                  {m.scheduled && <span className="text-[10px] text-yellow-500">🕐</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* DETTAGLIO */}
      {selected ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#1e1e2e] flex items-center gap-3">
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">{selected.subject}</h2>
              <p className="text-xs text-[#6b6b80]">Da: <span className="text-blue-400">{selected.from}</span> → A: {selected.to} · {selected.time}</p>
            </div>
            <div className="flex gap-2">
              {selected.status === 'read' && !receipt && <button onClick={() => setReceipt(true)} className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg">📝 Ricevuta</button>}
              {receipt && <button onClick={() => handlePrintPDF(selected)} className="px-3 py-1.5 bg-[#2563eb] text-white text-xs font-semibold rounded-lg">🖨️ Stampa PDF</button>}
              {folder === 'trash' ? (
                <><button onClick={() => handleRestore(selected.id)} className="px-3 py-1.5 border border-[#1e1e2e] text-white text-xs rounded-lg">↩️</button>
                <button onClick={() => handlePermanentDelete(selected.id)} className="px-3 py-1.5 border border-red-500 text-red-500 text-xs rounded-lg">🗑️</button></>
              ) : <button onClick={() => handleDelete(selected.id)} className="px-3 py-1.5 border border-red-500 text-red-500 text-xs rounded-lg">🗑️</button>}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-5 mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">📧 Messaggio</h3>
                <button onClick={() => setShowBody(!showBody)} className={`px-3 py-1 rounded-lg text-xs font-semibold ${showBody ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {showBody ? <Eye className="w-3.5 h-3.5 inline mr-1" /> : <EyeOff className="w-3.5 h-3.5 inline mr-1" />}
                  {showBody ? 'Visibile' : 'Mostra'}
                </button>
              </div>
              {showBody ? (
                <div className="bg-[#0a0a0f] rounded-lg p-4 border border-green-500/20">
                  <p className="text-green-500 text-xs mb-2">✅ Decifrato con ML-KEM-768</p>
                  <p className="text-[#d1d1d6] leading-relaxed whitespace-pre-wrap">{selected.body}</p>
                </div>
              ) : (
                <div className="text-center py-8"><Lock className="w-8 h-8 text-red-400 mx-auto mb-2" /><p className="text-[#6b6b80] text-sm">Clicca "Mostra" per decifrare</p></div>
              )}
              {selected.attachments.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {selected.attachments.map((a, i) => <span key={i} className="text-xs text-blue-400">📎 {a.name} ({a.size})</span>)}
                </div>
              )}
            </div>
            <div className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-5">
              <h3 className="font-bold mb-3 flex items-center gap-2"><Hash className="w-4 h-4 text-blue-400" /> Dati On-Chain</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[{ l: 'TX ID', v: selected.txId, c: '#60a5fa', m: true }, { l: 'Blocco', v: `#${selected.block}`, c: 'white', m: true }, { l: 'Hash (SHA3-512)', v: selected.bodyHash.slice(0, 40) + '...', c: '#a78bfa', m: true }, { l: 'Timestamp', v: new Date(selected.timestamp).toLocaleString('it'), c: 'white' }, { l: 'Firma Mittente', v: selected.sigFrom, c: '#22c55e', m: true }, { l: 'Firma Destinatario', v: selected.sigTo || 'In attesa', c: '#22c55e', m: true }].map((d, i) => (
                  <div key={i} className="bg-[#0a0a0f] rounded-lg p-3">
                    <p className="text-[#6b6b80] mb-1">{d.l}</p>
                    <p className={`${d.m ? 'font-mono text-[11px]' : 'text-sm'}`} style={{ color: d.c, wordBreak: 'break-all' }}>{d.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-[#6b6b80] flex-col gap-2">
          <Mail className="w-12 h-12 text-[#1e1e2e]" /><p>Seleziona una mail certificata</p>
        </div>
      )}

      {/* COMPOSER MODAL */}
      {comp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-5" onClick={() => setComp(false)}>
          <div className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl w-full max-w-[680px] max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold">✉️ Nuovo messaggio</h2>
                <button onClick={() => setComp(false)} className="text-[#6b6b80] hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-col gap-4">
                <div><label className="text-xs text-[#6b6b80] mb-1 block">Destinatario</label><input value={to} onChange={e => setTo(e.target.value)} placeholder="nome.cognome@azienda.lns" className="w-full p-3 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-white text-sm outline-none focus:border-blue-500" /></div>
                <div><label className="text-xs text-[#6b6b80] mb-1 block">Oggetto</label><input value={subj} onChange={e => setSubj(e.target.value)} className="w-full p-3 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-white text-sm outline-none focus:border-blue-500" /></div>
                <div><textarea value={body} onChange={e => setBody(e.target.value)} rows={8} placeholder="Scrivi il messaggio..." className="w-full p-3 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-white text-sm outline-none focus:border-blue-500 resize-none min-h-[200px]" /></div>
                <div className="flex items-center gap-3 flex-wrap">
                  <input ref={fileRef} type="file" multiple className="hidden" onChange={e => setAtt(Array.from(e.target.files || []).map(f => ({ name: f.name, size: (f.size / 1024).toFixed(0) + 'KB' })))} />
                  <button onClick={() => fileRef.current?.click()} className="px-3 py-2 border border-[#1e1e2e] rounded-lg text-sm text-[#a0a0b0] hover:text-white flex items-center gap-2"><Paperclip className="w-4 h-4" /> Allega</button>
                  {att.map((a, i) => <span key={i} className="text-xs text-blue-400">📎 {a.name}</span>)}
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="sched" checked={scheduled} onChange={e => setScheduled(e.target.checked)} />
                  <label htmlFor="sched" className="text-sm text-[#a0a0b0]">🕐 Programma invio</label>
                  {scheduled && <input type="datetime-local" value={schedDate} onChange={e => setSchedDate(e.target.value)} className="p-2 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-white text-sm" />}
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
                  <button onClick={() => setComp(false)} className="px-5 py-2.5 border border-[#1e1e2e] rounded-lg text-white text-sm">Annulla</button>
                  <button onClick={handleSend} className="px-5 py-2.5 bg-[#2563eb] text-white rounded-lg text-sm font-semibold flex items-center gap-2"><Send className="w-4 h-4" /> Invia</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
