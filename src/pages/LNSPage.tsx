import { useState } from 'react'
import { Search, ShieldCheck, Globe, Key } from 'lucide-react'

export default function LNSPage() {
  const [query, setQuery] = useState('')

  return (
    <div className="p-8 overflow-y-auto h-full" style={{ background: '#0a0a0f' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3"><ShieldCheck className="w-8 h-8 text-green-500" /> Lattice Name System</h1>
        <p className="text-[#6b6b80] mb-8">Identità crittografiche on-chain. Verificabili, immutabili, sicure.</p>

        <div className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-6 mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="alice@acme.lns" className="w-full pl-12 pr-4 py-3 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-white text-lg outline-none" />
            </div>
            <button className="px-6 py-3 bg-[#2563eb] text-white font-semibold rounded-lg">Risolvi</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Globe, title: 'Identità Globale', desc: 'Unico, verificabile, on-chain' },
            { icon: Key, title: 'ML-DSA-65', desc: 'Firma post-quantum NIST FIPS 204' },
            { icon: ShieldCheck, title: 'Anti-Phishing', desc: 'Chiave pubblica immutabile' },
          ].map((f, i) => (
            <div key={i} className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-6 text-center">
              <f.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-[#6b6b80]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
