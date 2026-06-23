import type { KeyFile } from '../types'

export function randomHex(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

export function generateKeyFile(lnsName: string): KeyFile {
  return {
    version: 1,
    algorithm: 'ML-DSA-65',
    lns_name: lnsName,
    tenant_id: 'tnt-' + randomHex(6),
    did: 'did:lattice:' + randomHex(16),
    public_key_hex: randomHex(1952),
    secret_key_hex: randomHex(4032),
    created_at: new Date().toISOString(),
  }
}

export function downloadKeyFile(keyFile: KeyFile) {
  const blob = new Blob([JSON.stringify(keyFile, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${keyFile.lns_name.replace(/[@.]/g, '_')}_key.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function readKeyFile(file: File): Promise<KeyFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string)
        if (!data.lns_name || !data.secret_key_hex) throw new Error('File non valido')
        resolve(data as KeyFile)
      } catch (e) { reject(e) }
    }
    reader.onerror = () => reject(new Error('Errore lettura file'))
    reader.readAsText(file)
  })
}

export function generateMessageHash(): string { return randomHex(64) }
export function generateSignature(): string { return 'sig-' + randomHex(16) }
export function generateTxId(): string { return 'tx-' + randomHex(8) }
