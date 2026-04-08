import { useEffect, useState } from 'react'
import { supabase, Review } from '../lib/supabase'

const ADMIN_PASSWORD = 'lojamilitar2026'

function Stars({ value }: { value: number }) {
  return (
    <span className="text-amber-400">
      {'★'.repeat(value)}<span className="text-gray-300">{'★'.repeat(5 - value)}</span>
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminReviews() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'pending' | 'approved'>('pending')
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => { if (authenticated) loadReviews() }, [authenticated])

  async function loadReviews() {
    setLoading(true)
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    setReviews(data ?? [])
    setLoading(false)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) { setAuthenticated(true); setLoginError('') }
    else setLoginError('Senha incorreta.')
  }

  async function approve(id: string) {
    setActionId(id)
    await supabase.from('reviews').update({ approved: true }).eq('id', id)
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r))
    setActionId(null)
  }

  async function reject(id: string) {
    setActionId(id)
    await supabase.from('reviews').delete().eq('id', id)
    setReviews(prev => prev.filter(r => r.id !== id))
    setActionId(null)
  }

  const pending = reviews.filter(r => !r.approved)
  const approved = reviews.filter(r => r.approved)
  const avg = approved.length > 0 ? (approved.reduce((a, r) => a + r.rating, 0) / approved.length).toFixed(1) : '—'

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#1a2410] flex items-center justify-center p-4">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-900/20 rounded-full blur-3xl" />
        </div>
        <div className="relative bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl">🛡️</div>
            <h1 className="text-2xl font-black text-[#1a2410]">Painel Admin</h1>
            <p className="text-gray-400 text-sm mt-1">Loja Militar</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Senha de acesso</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2410] transition-all" />
            </div>
            {loginError && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {loginError}
              </div>
            )}
            <button type="submit"
              className="w-full bg-[#1a2410] hover:bg-[#2d3a1a] text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-xl">
              Entrar →
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">← Voltar ao site</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1a2410] shadow-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-lg">🛡️</div>
            <div>
              <h1 className="text-white font-black text-lg leading-none">Painel Admin</h1>
              <p className="text-gray-400 text-xs">Loja Militar</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">Ver site →</a>
            <button onClick={() => setAuthenticated(false)}
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: reviews.length, icon: '📊', color: 'bg-white border-gray-100' },
            { label: 'Pendentes', value: pending.length, icon: '⏳', color: 'bg-amber-50 border-amber-100' },
            { label: 'Aprovadas', value: approved.length, icon: '✅', color: 'bg-green-50 border-green-100' },
            { label: 'Média', value: avg, icon: '⭐', color: 'bg-blue-50 border-blue-100' },
          ].map(s => (
            <div key={s.label} className={`${s.color} border rounded-3xl p-5 text-center`}>
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-3xl font-black text-[#1a2410]">{s.value}</p>
              <p className="text-xs font-medium text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit">
          <button onClick={() => setTab('pending')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'pending' ? 'bg-[#1a2410] text-white shadow-lg' : 'text-gray-500 hover:text-gray-800'}`}>
            ⏳ Pendentes
            {pending.length > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${tab === 'pending' ? 'bg-amber-400 text-[#1a2410]' : 'bg-amber-100 text-amber-700'}`}>
                {pending.length}
              </span>
            )}
          </button>
          <button onClick={() => setTab('approved')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'approved' ? 'bg-[#1a2410] text-white shadow-lg' : 'text-gray-500 hover:text-gray-800'}`}>
            ✅ Aprovadas
            <span className={`text-xs px-2 py-0.5 rounded-full font-black ${tab === 'approved' ? 'bg-green-400 text-[#1a2410]' : 'bg-green-100 text-green-700'}`}>
              {approved.length}
            </span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3 animate-pulse">⏳</p>
            <p>Carregando avaliações...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(tab === 'pending' ? pending : approved).length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
                <p className="text-5xl mb-4">{tab === 'pending' ? '🎉' : '📭'}</p>
                <p className="font-bold text-gray-700 text-lg">
                  {tab === 'pending' ? 'Nenhuma avaliação pendente!' : 'Nenhuma avaliação aprovada ainda.'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {tab === 'pending' ? 'Todas as avaliações foram revisadas.' : 'Aprove avaliações na aba Pendentes.'}
                </p>
              </div>
            ) : (
              (tab === 'pending' ? pending : approved).map(r => (
                <div key={r.id} className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-[#2d3a1a] text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-black text-gray-900">{r.name}</p>
                        <Stars value={r.rating} />
                        <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                    </div>
                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {tab === 'pending' && (
                        <button onClick={() => approve(r.id)} disabled={actionId === r.id}
                          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold text-sm px-4 py-2.5 rounded-2xl transition-all shadow-md hover:shadow-green-500/30 active:scale-95">
                          {actionId === r.id ? '...' : '✓ Aprovar'}
                        </button>
                      )}
                      <button onClick={() => reject(r.id)} disabled={actionId === r.id}
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-500 border border-red-200 hover:border-red-500 text-red-500 hover:text-white font-bold text-sm px-4 py-2.5 rounded-2xl transition-all active:scale-95">
                        {actionId === r.id ? '...' : '✕ Excluir'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
