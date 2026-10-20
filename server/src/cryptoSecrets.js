import crypto from 'node:crypto'

const SCRYPT = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }

function masterKey() {
  const key = String(process.env.SECRETS_KEY || '').trim()
  return key.length >= 32 ? key : ''
}

function legacySeeds() {
  return [process.env.OTP_PEPPER, process.env.JWT_SECRET, process.env.SECRETS_KEY, 'esp-devops-secrets']
    .map((item) => String(item || '').trim())
    .filter(Boolean)
}

function derive(secret, salt) {
  return crypto.scryptSync(secret, salt, 32, SCRYPT)
}

export function encryptSecret(plaintext) {
  const master = masterKey()
  if (!master) {
    throw new Error('SECRETS_KEY is missing. Set a key of at least 32 characters in .env.')
  }
  const salt = crypto.randomBytes(16)
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', derive(master, salt), iv)
  const encrypted = Buffer.concat([cipher.update(String(plaintext ?? ''), 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return ['v3', salt.toString('hex'), iv.toString('hex'), tag.toString('hex'), encrypted.toString('hex')].join(':')
}

function openAes(key, ivHex, tagHex, dataHex) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'))
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'))
  return Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]).toString('utf8')
}

function decryptV3(raw) {
  const master = masterKey()
  if (!master) return ''
  const [, saltHex, ivHex, tagHex, dataHex] = raw.split(':')
  if (!saltHex || !ivHex || !tagHex || !dataHex) return ''
  try {
    return openAes(derive(master, Buffer.from(saltHex, 'hex')), ivHex, tagHex, dataHex)
  } catch {
    return ''
  }
}

function decryptV2(raw) {
  const parts = raw.split(':')
  const versioned = parts[0] === 'v2'
  const [ivHex, tagHex, dataHex] = versioned ? parts.slice(1) : parts
  if (!ivHex || !tagHex || !dataHex) return ''
  for (const seed of legacySeeds()) {
    const candidates = [crypto.scryptSync(seed, 'esp-devops-vault-v2', 32), crypto.createHash('sha256').update(seed).digest()]
    for (const key of candidates) {
      try {
        return openAes(key, ivHex, tagHex, dataHex)
      } catch {
        /* try the next key */
      }
    }
  }
  return ''
}

export function decryptSecret(payload) {
  const raw = String(payload || '')
  if (!raw) return ''
  if (raw.startsWith('v3:')) return decryptV3(raw)
  return decryptV2(raw)
}

export function isCurrentCipher(payload) {
  return String(payload || '').startsWith('v3:')
}
