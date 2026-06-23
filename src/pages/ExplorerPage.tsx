import { useState } from 'react'
import { Search, Hash, FileCheck, MessageCircle, Bitcoin } from 'lucide-react'

const mockTxs = [
  { id: 'tx-887e8b10', type: 'certify', block: 4291, from: 'alice@acme.lns', to: 'bob@acme.lns', hash: 'a1b2c3...', time: '14:32', status: 'anchored', btcTx: '3a5b7c9d...' },
  { id: 'tx-9923f7a1', type: 'pulse', block: 4291, from: 'alice@acme.lns', to: 'bob@acme.lns', hash: 'b2c3d4...', time: '14:31', status: 'sealed' },
  { id: 'tx-1234abcd', type: 'lns', block: 4289, from: 'system', to: 'carol@acme.lns', hash: 'c3d4e5...', time: '14:28', status: 'confirmed' },
]

export default function ExplorerPage() {
  const [query, setQuery] = useState('')

  return (
    <div className="p-8 overflow-y-auto h-full" style={{ background: '#0a0a0f' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🔍 Blockchain Explorer</h1>
        <p className="text-[#6b6b80] mb-8">Cerca transazioni, blocchi e hash sulla chain Lattice</p>

        <div className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-4 mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="TX ID, block number, hash..." className="w-full pl-12 pr-4 py-3 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-white text-sm outline-none" />
            </div>
            <button className="px-6 py-3 bg-[#2563eb] text-white font-semibold rounded-lg">Cerca</button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Transazioni Recenti</h2>
        <div className="space-y-2">
          {mockTxs.map(tx => (
            <div key={tx.id} className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'certify' ? 'bg-green-500/10' : tx.type === 'pulse' ? 'bg-blue-500/10' : 'bg-purple-500/10'}`}>
                  {tx.type === 'certify' ? <FileCheck className="w-5 h-5 text-green-500" /> : tx.type === 'pulse' ? <MessageCircle className="w-5 h-5 text-blue-400" /> : <Hash className="w-5 h-5 text-purple-400" />}
                </div>
                <div>
                  <p className="text-sm font-semibold">{tx.type === 'certify' ? 'Certify' : tx.type === 'pulse' ? 'Pulse' : 'LNS Register'}</p>
                  <p className="text-[10px] text-[#6b6b80]">{tx.from} → {tx.to}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono text-blue-400">{tx.id}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-[#6b6b80]">Blocco #{tx.block}</span>
                  {tx.status === 'anchored' && <Bitcoin className="w-3 h-3 text-yellow-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
