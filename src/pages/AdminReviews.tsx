import { useEffect, useState } from 'react'
import { supabase, Review } from '../lib/supabase'

const ADMIN_PASSWORD = 'lojamilitar2026'

function StarDisplay({ value }: { value: number }) {
  return (
    <span className="text-yellow-400">
      {'★'.repeat(value)}
      <span className="text-gray-300">{'★'.repeat(5 - value)}</span>
    </span>
  )
}

export default function AdminReviews() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'pending' | 'approved'>('pending')

  useEffect(() => {
    if (authenticated) loadReviews()
  }, [authenticated])

  async function loadReviews() {
    setLoading(true)
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
    setReviews(data ?? [])
    setLoading(false)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('Senha incorreta.')
    }
  }

  async function approve(id: string) {
    await supabase.from('reviews').update({ approved: true }).eq('id', id)
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved: true } : r)))
  }

  async function remove(id: string) {
    if (!confirm('Excluir esta avaliação?')) return
    await supabase.from('reviews').delete().eq('id', id)
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const pending = reviews.filter((r) => !r.approved)
  const approved = reviews.filter((r) => r.approved)
  const average =
    approved.length > 0
      ? (approved.reduce((acc, r) => acc + r.rating, 0) / approved.length).toFixed(1)
      : '—'

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-military-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🛡️</div>
            <h1 className="text-xl font-bold text-gray-800">Painel Administrativo</h1>
            <p className="text-sm text-gray-500">Loja Militar</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-military-600"
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-military-700 hover:bg-military-800 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-military-700 text-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <div>
              <h1 className="font-bold text-lg leading-none">Painel Admin</h1>
              <p className="text-military-200 text-xs">Loja Militar</p>
            </div>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-sm text-military-200 hover:text-white transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: reviews.length, color: 'bg-blue-50 text-blue-700' },
            { label: 'Pendentes', value: pending.length, color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Aprovadas', value: approved.length, color: 'bg-green-50 text-green-700' },
            { label: 'Média', value: average, color: 'bg-purple-50 text-purple-700' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-4 ${s.color} text-center`}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('pending')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              tab === 'pending'
                ? 'bg-military-700 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pendentes ({pending.length})
          </button>
          <button
            onClick={() => setTab('approved')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              tab === 'approved'
                ? 'bg-military-700 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Aprovadas ({approved.length})
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Carregando...</div>
        ) : (
          <div className="space-y-4">
            {(tab === 'pending' ? pending : approved).length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-2xl">
                Nenhuma avaliação {tab === 'pending' ? 'pendente' : 'aprovada'}.
              </div>
            ) : (
              (tab === 'pending' ? pending : approved).map((r) => (
                <div key={r.id} className="bg-white rounded-2xl shadow p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800">{r.name}</p>
                        <StarDisplay value={r.rating} />
                        <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-2 leading-relaxed">{r.comment}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {!r.approved && (
                        <button
                          onClick={() => approve(r.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Aprovar
                        </button>
                      )}
                      <button
                        onClick={() => remove(r.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Excluir
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
