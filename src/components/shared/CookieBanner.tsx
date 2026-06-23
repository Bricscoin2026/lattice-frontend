import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [show, setShow] = useState(false)
  const [prefs, setPrefs] = useState(false)
  useEffect(() => { if (!localStorage.getItem('cookie_consent')) setShow(true) }, [])
  if (!show) return null

  const acceptAll = () => { localStorage.setItem('cookie_consent', 'all'); setShow(false) }
  const rejectAll = () => { localStorage.setItem('cookie_consent', 'essential'); setShow(false) }

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[2000] p-5">
      <div className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl max-w-[580px] w-full max-h-[90vh] overflow-auto">
        <div className="p-8">
          <h2 className="text-xl font-bold mb-4">🍪 Gestisci le impostazioni sui cookie</h2>
          <p className="text-[#a0a0b0] text-sm leading-relaxed mb-6">
            Utilizziamo cookie per garantire le funzionalità essenziali e, con il tuo consenso, per analisi e personalizzazione.
          </p>
          {!prefs ? (
            <div className="flex flex-col gap-3">
              <button onClick={acceptAll} className="w-full py-3 bg-[#2563eb] text-white font-semibold rounded-lg">Accetta tutti i cookie</button>
              <button onClick={() => setPrefs(true)} className="w-full py-3 border border-[#1e1e2e] text-white font-semibold rounded-lg">Gestisci impostazioni</button>
              <button onClick={rejectAll} className="w-full py-2 text-[#a0a0b0] underline">Rifiuta tutti</button>
            </div>
          ) : (
            <div>
              {[
                { id: 'essential', label: 'Cookie essenziali', desc: 'Necessari al funzionamento della piattaforma.', always: true },
                { id: 'analytics', label: 'Cookie analitici', desc: 'Ci aiutano a migliorare i nostri servizi.' },
                { id: 'marketing', label: 'Cookie di marketing', desc: 'Per contenuti personalizzati.' },
              ].map(c => (
                <div key={c.id} className="bg-[#0a0a0f] rounded-lg p-3.5 mb-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{c.label}</span>
                    {c.always ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">Sempre attivi</span> :
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2563eb]" />}
                  </div>
                  <p className="text-[#6b6b80] text-xs mt-1">{c.desc}</p>
                </div>
              ))}
              <button onClick={() => { localStorage.setItem('cookie_consent', 'custom'); setShow(false) }} className="w-full py-3 bg-[#2563eb] text-white font-semibold rounded-lg mt-2">Salva preferenze</button>
            </div>
          )}
          <p className="text-[#6b6b80] text-[11px] text-center mt-4">Puoi modificare le tue preferenze in qualsiasi momento.</p>
        </div>
      </div>
    </div>
  )
}
