import { accessSync, constants } from 'node:fs'
import { spawn } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import jwt from 'jsonwebtoken'
import { WebSocketServer } from 'ws'
import { cookieValue, SESSION_COOKIE } from './session.js'

function shellExists(file) {
  try {
    accessSync(file, constants.F_OK)
    return true
  } catch {
    return false
  }
}

function resolveShell() {
  const override = process.env.LOCAL_SHELL?.trim()
  if (override) {
    return { file: override, args: process.platform === 'win32' ? ['--login', '-i'] : ['-i'], label: path.basename(override) }
  }
  if (process.platform === 'win32') {
    const candidates = [
      'C:\\Program Files\\Git\\bin\\bash.exe',
      'C:\\Program Files\\Git\\usr\\bin\\bash.exe',
    ]
    for (const file of candidates) {
      if (shellExists(file)) return { file, args: ['--login', '-i'], label: 'bash' }
    }
    return { file: 'powershell.exe', args: ['-NoLogo', '-NoExit'], label: 'powershell' }
  }
  const file = process.env.SHELL?.trim() || '/bin/bash'
  return { file, args: ['-i'], label: path.basename(file) || 'bash' }
}

export function localTerminalStatus() {
  const shell = resolveShell()
  return {
    ready: true,
    running: true,
    image: shell.label,
    shell: shell.label,
    message: `Local ${shell.label} on this machine.`,
  }
}

export function startLocalTerminal() {
  return localTerminalStatus()
}

function write(ws, text) {
  if (ws.readyState === ws.OPEN) ws.send(text)
}

function startShell(ws) {
  const shell = resolveShell()
  const child = spawn(shell.file, shell.args, {
    windowsHide: true,
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd(),
    env: { ...process.env, TERM: 'xterm-256color' },
  })
  child.stdout?.on('data', (chunk) => {
    if (ws.readyState === ws.OPEN) ws.send(chunk)
  })
  child.stderr?.on('data', (chunk) => {
    if (ws.readyState === ws.OPEN) ws.send(chunk)
  })
  child.on('error', (error) => {
    write(
      ws,
      error.code === 'ENOENT'
        ? `\r\nShell was not found: ${shell.file}\r\n`
        : `\r\nShell error: ${error.message}\r\n`,
    )
  })
  child.on('close', (code) => {
    write(ws, `\r\n[shell exited ${code ?? 0}]\r\n`)
    if (ws.readyState === ws.OPEN) ws.close()
  })
  ws.on('message', (data) => {
    if (!child.stdin?.writable) return
    const raw = Buffer.isBuffer(data) ? data : Buffer.from(String(data))
    const text = raw.toString('utf8')
    try {
      const msg = JSON.parse(text)
      if (msg?.type === 'resize') return
    } catch {
      /* raw keys */
    }
    if (process.platform === 'win32' && text === '\r') {
      child.stdin.write('\r\n')
      return
    }
    child.stdin.write(raw)
  })
  const stop = () => {
    try {
      child.stdin?.end()
    } catch {
      /* ignore */
    }
    try {
      child.kill()
    } catch {
      /* ignore */
    }
  }
  ws.on('close', stop)
  ws.on('error', stop)
}

export function attachLocalTerminal(_httpServer, { jwtSecret, resolveAccess }) {
  const wss = new WebSocketServer({ noServer: true })
  wss.on('connection', async (ws, req) => {
    const token = cookieValue(req, SESSION_COOKIE)
    let email = ''
    try {
      const payload = jwt.verify(token, jwtSecret)
      if (payload?.pending2fa || !payload?.email) throw new Error('invalid')
      email = String(payload.email)
    } catch {
      write(ws, 'Session expired. Sign in again.\r\n')
      ws.close()
      return
    }
    const access = await resolveAccess(email)
    if (!access?.privileges?.includes('ssh.connect')) {
      write(ws, 'You do not have permission to use Terminal.\r\n')
      ws.close()
      return
    }
    const host = os.hostname()
    write(ws, `Connected to ${host} (${resolveShell().label}).\r\n`)
    startShell(ws)
  })
  return {
    handleUpgrade(request, socket, head) {
      const url = new URL(request.url || '', 'http://localhost')
      if (url.pathname !== '/ws/terminal') return false
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request)
      })
      return true
    },
  }
}
