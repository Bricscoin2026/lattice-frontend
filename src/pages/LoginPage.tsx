import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Building2, Crown, ArrowRight, Upload } from 'lucide-react'
import { useStore } from '../lib/store'
import { generateKeyFile, downloadKeyFile, readKeyFile } from '../lib/crypto'
import type { User, Tenant } from '../types'

type Step = 'choice' | 'register_company' | 'register_director' | 'keys' | 'login_file'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>(isAuthenticated ? 'choice' : 'choice')
  const [companyName, setCN] = useState('')
  const [companyDomain, setCD] = useState('')
  const [dirFirst, setDF] = useState('')
  const [dirLast, setDL] = useState('')
  const [keyData, setKeyData] = useState<any>(null)
  const [error, setError] = useState('')

  const doLogin = (u: User, t: string, tn: Tenant) => {
    login(u, t, tn)
    navigate('/certify')
  }

  if (isAuthenticated) { navigate('/certify'); return null }

  // ============ CHOICE ============
  if (step === 'choice') return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0a0f' }}>
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Lattice Network</h1>
          <p className="text-[#6b6b80] text-sm">Piattaforma di comunicazione Post-Quantum</p>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => setStep('register_company')} className="w-full py-4 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-colors">
            <Building2 className="w-5 h-5" /> Registra la tua Azienda
          </button>
          <button onClick={() => setStep('login_file')} className="w-full py-4 bg-[#16161f] text-white font-semibold rounded-xl border border-[#1e1e2e] hover:bg-[#1c1c28] transition-colors flex items-center justify-center gap-3">
            <Upload className="w-5 h-5" /> Accedi con file chiave
          </button>
        </div>
      </div>
    </div>
  )

  // ============ REGISTER COMPANY ============
  if (step === 'register_company') return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0a0f' }}>
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-8">
          <Building2 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Registra Azienda</h1>
          <p className="text-[#6b6b80] text-sm">Crea il tuo tenant su Lattice Network</p>
        </div>
        <div className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-sm text-[#6b6b80] mb-1.5 block">Nome Azienda</label>
            <input value={companyName} onChange={e => setCN(e.target.value)} placeholder="Acme SpA" className="w-full p-3 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-white text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-[#6b6b80] mb-1.5 block">Dominio LNS</label>
            <input value={companyDomain} onChange={e => setCD(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))} placeholder="acme" className="w-full p-3 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-white text-sm outline-none focus:border-blue-500" />
            <p className="text-[#6b6b80] text-xs mt-1">Dominio: <strong className="text-blue-400">{companyDomain || 'acme'}.lns</strong></p>
          </div>
          <button onClick={() => companyName && companyDomain && setStep('register_director')} className="w-full py-3 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors">
            Continua <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => setStep('choice')} className="text-[#6b6b80] text-sm hover:text-white">← Indietro</button>
        </div>
      </div>
    </div>
  )

  // ============ REGISTER DIRECTOR ============
  if (step === 'register_director') return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0a0f' }}>
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-8">
          <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Registra Direttore</h1>
          <p className="text-[#6b6b80] text-sm">Controllo totale su {companyDomain}.lns</p>
        </div>
        <div className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-sm text-[#6b6b80] mb-1.5 block">Nome</label>
            <input value={dirFirst} onChange={e => setDF(e.target.value)} placeholder="Mario" className="w-full p-3 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-white text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-[#6b6b80] mb-1.5 block">Cognome</label>
            <input value={dirLast} onChange={e => setDL(e.target.value)} placeholder="Rossi" className="w-full p-3 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg text-white text-sm outline-none focus:border-blue-500" />
          </div>
          {dirFirst && dirLast && (
            <div className="bg-[#0a0a0f] rounded-lg p-3 border border-yellow-500/20">
              <p className="text-yellow-500 font-mono text-sm">{dirFirst.toLowerCase()}.{dirLast.toLowerCase()}@{companyDomain}.lns</p>
            </div>
          )}
          <button onClick={() => dirFirst && dirLast && setStep('keys')} className="w-full py-3 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors">
            Genera Chiavi PQC <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => setStep('register_company')} className="text-[#6b6b80] text-sm hover:text-white">← Indietro</button>
        </div>
      </div>
    </div>
  )

  // ============ KEYS ============
  if (step === 'keys') {
    const lns = `${dirFirst.toLowerCase()}.${dirLast.toLowerCase()}@${companyDomain}.lns`
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0a0f' }}>
        <div className="w-full max-w-[540px]">
          <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Chiavi ML-DSA-65</h1>
            <p className="text-[#6b6b80] text-sm">NIST FIPS 204 — Standard Post-Quantum</p>
          </div>
          <div className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl p-6 flex flex-col gap-4">
            {!keyData ? (
              <div className="text-center py-8">
                <p className="text-[#6b6b80] mb-6">Genera la tua coppia di chiavi crittografiche</p>
                <button onClick={() => setKeyData(generateKeyFile(lns))} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all">
                  🔐 Genera Chiavi ML-DSA-65
                </button>
              </div>
            ) : (
              <>
                <div className="bg-[#0a0a0f] rounded-lg p-4 border border-green-500/20">
                  <p className="text-green-500 text-sm font-semibold mb-2">✅ Chiave Pubblica</p>
                  <p className="text-green-300 font-mono text-xs break-all">{keyData.public_key_hex.slice(0, 80)}...</p>
                </div>
                <div className="bg-yellow-500/5 rounded-lg p-4 border border-yellow-500/20">
                  <p className="text-yellow-500 text-sm">⚠️ Scarica il file JSON. Senza questo file non potrai più accedere. Il direttore dovrà inviarlo ai dipendenti.</p>
                </div>
                <button onClick={() => {
                  downloadKeyFile(keyData)
                  doLogin(
                    { id: '1', lns_name: lns, display_name: `${dirFirst} ${dirLast}`, role: 'director', public_key: keyData.public_key_hex, tenant_id: '1', created_at: new Date().toISOString() },
                    'token-' + Date.now(),
                    { id: '1', company_name: companyName, domain: `${companyDomain}.lns`, director_name: `${dirFirst} ${dirLast}`, director_lns: lns, public_key: keyData.public_key_hex, registered_at: new Date().toISOString() }
                  )
                }} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
                  📥 Scarica chiave ed Entra
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ============ LOGIN FILE ============
  if (step === 'login_file') return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0a0f' }}>
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-8">
          <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Accedi con File Chiave</h1>
          <p className="text-[#6b6b80] text-sm">Carica il JSON della tua chiave ML-DSA-65</p>
        </div>
        <div className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl p-6">
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={async e => {
            const f = e.target.files?.[0]; if (!f) return
            try {
              const d = await readKeyFile(f)
              const parts = d.lns_name.split('@')
              const nameParts = parts[0]?.split('.') || []
              doLogin(
                { id: Date.now().toString(), lns_name: d.lns_name, display_name: nameParts.join(' '), role: 'employee', public_key: d.public_key_hex, tenant_id: '1', created_at: new Date().toISOString() },
                'token-' + Date.now(),
                { id: '1', company_name: parts[1]?.split('.')[0] || '', domain: parts[1] || '', director_name: '', director_lns: '', public_key: '', registered_at: '' }
              )
            } catch (e: any) { setError(e.message) }
          }} />
          <button onClick={() => fileRef.current?.click()} className="w-full py-16 border-2 border-dashed border-[#1e1e2e] rounded-xl flex flex-col items-center gap-3 hover:border-blue-500 transition-colors">
            <Upload className="w-8 h-8 text-blue-400" />
            <span className="font-semibold">Clicca per caricare il file chiave</span>
            <span className="text-[#6b6b80] text-xs">JSON generato in fase di registrazione</span>
          </button>
          {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}
          <button onClick={() => setStep('choice')} className="text-[#6b6b80] text-sm hover:text-white mt-4 w-full">← Indietro</button>
        </div>
      </div>
    </div>
  )

  return null
}
