import { Link } from 'react-router-dom'
import { Shield, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur-xl -mx-6 px-6">
          <div className="max-w-6xl mx-auto h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">Lattice</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-[#a0a0b0] hover:text-white transition-colors">Funzionalità</a>
              <a href="#modules" className="text-sm text-[#a0a0b0] hover:text-white transition-colors">Moduli</a>
              <a href="#tech" className="text-sm text-[#a0a0b0] hover:text-white transition-colors">Tecnologia</a>
              <Link to="/login" className="px-5 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">Accedi</Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="text-center py-28">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-sm mb-8">
            🔐 Infrastruttura Post-Quantum per Aziende e PA
          </span>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Comunicazione aziendale<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">finalmente sicura</span>
          </h1>
          <p className="text-lg text-[#a0a0b0] max-w-xl mx-auto mb-10 leading-relaxed">
            Lattice Network è l'infrastruttura di comunicazione sicura on-premise per organizzazioni che non possono permettersi compromessi.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="px-8 py-4 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-2 transition-colors">
              Accedi alla Console <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="px-8 py-4 bg-[#16161f] text-white font-semibold rounded-xl border border-[#1e1e2e] hover:bg-[#1c1c28] transition-colors">
              Scopri di più ↓
            </a>
          </div>
        </section>
      </div>

      {/* Trust bar - full width */}
      <div className="border-y border-[#1e1e2e] bg-[#111118]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex justify-center gap-16 flex-wrap">
          {['🛡️ Post-Quantum NIST', '🏠 100% Self-Hosted', '🟧 Ancoraggio BTC', '📜 Valore Legale', '🔒 E2EE'].map((b, i) => (
            <div key={i} className="text-center font-semibold text-sm">{b}</div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-24" id="features">
        <p className="text-center text-blue-400 text-xs font-semibold tracking-widest uppercase mb-3">Perché Lattice</p>
        <h2 className="text-center text-3xl font-extrabold mb-4">Progettato per la sicurezza assoluta</h2>
        <p className="text-center text-[#a0a0b0] max-w-xl mx-auto mb-14">Ogni componente è costruito per resistere alle minacce di oggi e di domani.</p>
        <div className="grid grid-cols-3 gap-5">
          {['🛡️ Post-Quantum by Design', '🏠 Sovereignty Totale', '🔒 Tenant Isolation', '🟧 Ancoraggio Bitcoin', '📜 Valore Legale', '⚡ Zero Superficie'].map((f, i) => (
            <div key={i} className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl p-6 hover:bg-[#1c1c28] transition-all">
              <h3 className="font-bold mb-2">{f}</h3>
              <p className="text-sm text-[#a0a0b0] leading-relaxed">ML-DSA-65 e ML-KEM-768, algoritmi NIST. Zero runtime interpretati.</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div className="border-y border-[#1e1e2e] bg-[#111118]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <p className="text-center text-blue-400 text-xs font-semibold tracking-widest uppercase mb-3">I Tre Pilastri</p>
          <h2 className="text-center text-3xl font-extrabold mb-14">Zero Compromessi</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { i: '📨', t: 'Certify', d: 'Posta certificata con ricevuta PDF e ancoraggio Bitcoin.' },
              { i: '💬', t: 'Pulse', d: 'Feed aziendale, chat E2EE, chiamate VoIP e video.' },
              { i: '🛡️', t: 'LNS', d: 'Identità on-chain verificabili. Anti-phishing.' },
            ].map((m, i) => (
              <div key={i} className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">{m.i}</div>
                <h3 className="text-xl font-bold mb-2">{m.t}</h3>
                <p className="text-sm text-[#a0a0b0]">{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech */}
      <div className="max-w-6xl mx-auto px-6 py-24 text-center" id="tech">
        <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-3">Tecnologia</p>
        <h2 className="text-3xl font-extrabold mb-12">Costruito con i migliori standard</h2>
        <div className="grid grid-cols-4 gap-4">
          {['Rust', '9,398 LOC', '89 API', 'QBFT', 'ML-DSA-65', 'ML-KEM-768', 'Loopix', 'Bitcoin OTS'].map((t, i) => (
            <div key={i} className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-5">
              <p className="text-xl font-extrabold">{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-[#1e1e2e]">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Pronto a proteggere la tua azienda?</h2>
          <p className="text-[#a0a0b0] max-w-lg mx-auto mb-10">Lattice Network è disponibile con licenza perpetua on-premise.</p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="px-8 py-4 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold rounded-xl">Accedi alla Demo</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#1e1e2e]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex justify-between text-sm text-[#6b6b80]">
          <span>🦀 Rust · 🔐 ML-DSA-65 · 🟧 Bitcoin</span>
          <span>© 2026 Lattice Network · 🇮🇹 Italia</span>
        </div>
      </div>
    </div>
  )
}
