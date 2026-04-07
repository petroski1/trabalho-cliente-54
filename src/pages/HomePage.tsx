import { useEffect, useState } from 'react'
import { supabase, Review } from '../lib/supabase'

// ─── Dados dos produtos ───────────────────────────────────────────────────────
const products = [
  { id: 1, name: 'Camiseta Tática Masculina', price: 'R$ 89,90', tag: 'Mais vendido', emoji: '👕', desc: 'Tecido respirável, corte moderno, diversas cores.' },
  { id: 2, name: 'Calça Cargo Militar', price: 'R$ 149,90', tag: 'Novidade', emoji: '👖', desc: 'Multi-bolsos, tecido reforçado, elástico na cintura.' },
  { id: 3, name: 'Colete Tático', price: 'R$ 199,90', tag: '', emoji: '🦺', desc: 'Leve, ajustável, ideal para uso diário ou treinos.' },
  { id: 4, name: 'Boné Militar', price: 'R$ 59,90', tag: '', emoji: '🧢', desc: 'Aba curva, velcro traseiro, bordado exclusivo.' },
  { id: 5, name: 'Jaqueta Camuflada', price: 'R$ 249,90', tag: 'Destaque', emoji: '🧥', desc: 'Impermeável, forro interno, vários bolsos.' },
  { id: 6, name: 'Bota Militar', price: 'R$ 319,90', tag: '', emoji: '🥾', desc: 'Couro legítimo, sola antiderrapante, cano médio.' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hov, setHov] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHov(s)}
          onMouseLeave={() => onChange && setHov(0)}
          className={`text-2xl transition-transform ${s <= (hov || value) ? 'text-yellow-400' : 'text-gray-300'} ${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          disabled={!onChange}
        >★</button>
      ))}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { loadReviews() }, [])

  async function loadReviews() {
    const { data } = await supabase
      .from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false })
    setReviews(data ?? [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!name.trim()) return setFormError('Informe seu nome.')
    if (rating === 0) return setFormError('Selecione uma nota.')
    if (!comment.trim()) return setFormError('Escreva um comentário.')
    setSubmitting(true)
    const { error } = await supabase.from('reviews').insert([{ name: name.trim(), rating, comment: comment.trim(), approved: false }])
    setSubmitting(false)
    if (error) return setFormError('Erro ao enviar. Tente novamente.')
    setSubmitted(true)
    setName(''); setRating(0); setComment('')
  }

  const avg = reviews.length > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0
  const countByStar = (s: number) => reviews.filter((r) => r.rating === s).length

  const navLinks = [
    { label: 'Início', href: '#hero' },
    { label: 'Produtos', href: '#produtos' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Avaliações', href: '#avaliacoes' },
    { label: 'Contato', href: '#contato' },
  ]

  return (
    <div className="font-sans text-gray-800 scroll-smooth">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2d3a1a] shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2 text-white font-bold text-lg">
            <span className="text-2xl">🛡️</span> Loja Militar
          </a>
          {/* Desktop */}
          <ul className="hidden md:flex gap-6">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">{l.label}</a>
              </li>
            ))}
          </ul>
          {/* Mobile toggle */}
          <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#232e14] px-4 pb-4">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                className="block py-2 text-gray-300 hover:text-white text-sm border-b border-[#3a4d22] last:border-0">
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative pt-16 min-h-screen flex items-center bg-[#2d3a1a] overflow-hidden">
        {/* Padrão camuflagem decorativo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none"
          style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, #6b7c3a 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #4a5a22 0%, transparent 50%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-yellow-500 text-[#2d3a1a] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              Qualidade &amp; Resistência
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              Equipamentos e Roupas<br />
              <span className="text-yellow-400">Militares</span> de Alta Qualidade
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Produtos táticos e militares para quem exige o melhor. Uniformes, acessórios e muito mais com entrega para todo o Brasil.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#produtos"
                className="bg-yellow-500 hover:bg-yellow-400 text-[#2d3a1a] font-bold px-6 py-3 rounded-xl transition-colors shadow-lg">
                Ver produtos
              </a>
              <a href="#avaliacoes"
                className="border border-gray-400 hover:border-white text-gray-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Ver avaliações
              </a>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="text-[180px] drop-shadow-2xl select-none">🪖</div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 animate-bounce text-2xl">↓</div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="bg-yellow-500 py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { n: '500+', label: 'Clientes satisfeitos' },
            { n: '100+', label: 'Produtos em estoque' },
            { n: '5★', label: 'Avaliação média' },
            { n: '3 dias', label: 'Entrega expressa' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-extrabold text-[#2d3a1a]">{s.n}</p>
              <p className="text-sm font-medium text-[#3d4d20]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUTOS ── */}
      <section id="produtos" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#2d3a1a] mb-2">Nossos Produtos</h2>
            <p className="text-gray-500">Seleção especial de peças militares e táticas</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow overflow-hidden group">
                {/* Imagem placeholder */}
                <div className="bg-gradient-to-br from-[#3a4d22] to-[#5a6e35] h-48 flex items-center justify-center text-7xl group-hover:scale-105 transition-transform">
                  {p.emoji}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{p.name}</h3>
                    {p.tag && (
                      <span className="shrink-0 text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-extrabold text-[#2d3a1a]">{p.price}</span>
                    <button className="bg-[#2d3a1a] hover:bg-[#3d5022] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-8">
            Entre em contato para ver o catálogo completo e disponibilidade de tamanhos.
          </p>
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section id="sobre" className="py-20 bg-[#2d3a1a] text-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-6xl text-center hidden md:block select-none">🏪</div>
          <div>
            <h2 className="text-3xl font-extrabold mb-4">Sobre a Loja Militar</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Somos especializados em roupas e equipamentos militares de alta qualidade. Nossa missão é oferecer produtos resistentes, funcionais e com estilo para militares, entusiastas e profissionais de segurança.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              Com anos de experiência no mercado, garantimos produtos originais, atendimento personalizado e entrega rápida para todo o Brasil.
            </p>
            <ul className="space-y-2">
              {['✅ Produtos originais e certificados', '✅ Entrega para todo o Brasil', '✅ Atendimento personalizado', '✅ Troca e devolução garantida'].map((item) => (
                <li key={item} className="text-gray-200 text-sm">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── AVALIAÇÕES ── */}
      <section id="avaliacoes" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#2d3a1a] mb-2">Avaliações dos Clientes</h2>
            <p className="text-gray-500">Veja o que nossos clientes estão dizendo</p>
          </div>

          {/* Resumo */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="text-center shrink-0">
                  <p className="text-6xl font-extrabold text-[#2d3a1a]">{avg.toFixed(1)}</p>
                  <Stars value={Math.round(avg)} />
                  <p className="text-sm text-gray-400 mt-1">{reviews.length} avaliações</p>
                </div>
                <div className="flex-1 w-full space-y-2">
                  {[5, 4, 3, 2, 1].map((s) => {
                    const pct = reviews.length > 0 ? (countByStar(s) / reviews.length) * 100 : 0
                    return (
                      <div key={s} className="flex items-center gap-2 text-sm">
                        <span className="w-10 text-right text-gray-500">{s} ★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div className="bg-yellow-400 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-6 text-gray-400 text-xs">{countByStar(s)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formulário */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-bold text-lg text-[#2d3a1a] mb-4">Deixe sua avaliação</h3>
              {submitted ? (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3">✅</p>
                  <p className="font-semibold text-gray-800">Obrigado pela avaliação!</p>
                  <p className="text-sm text-gray-500 mt-1">Será exibida após aprovação.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-4 text-sm text-[#2d3a1a] underline">
                    Enviar outra
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d3a1a]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nota</label>
                    <Stars value={rating} onChange={setRating} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comentário</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                      placeholder="Conte sua experiência..." rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d3a1a] resize-none" />
                  </div>
                  {formError && <p className="text-red-500 text-sm">{formError}</p>}
                  <button type="submit" disabled={submitting}
                    className="w-full bg-[#2d3a1a] hover:bg-[#3d5022] text-white font-semibold py-2 rounded-xl transition-colors disabled:opacity-50">
                    {submitting ? 'Enviando...' : 'Enviar avaliação'}
                  </button>
                </form>
              )}
            </div>

            {/* Lista */}
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-400">
                  <p className="text-4xl mb-2">💬</p>
                  <p>Seja o primeiro a avaliar!</p>
                </div>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="bg-white rounded-2xl shadow p-4">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
                      <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
                    </div>
                    <Stars value={r.rating} />
                    <p className="text-gray-600 text-sm mt-2 leading-relaxed">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTATO ── */}
      <section id="contato" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#2d3a1a] mb-2">Entre em Contato</h2>
            <p className="text-gray-500">Estamos prontos para atender você</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: '📱', title: 'WhatsApp', desc: '(XX) XXXXX-XXXX', sub: 'Seg–Sáb, 8h–18h' },
              { icon: '📍', title: 'Endereço', desc: 'Sua cidade, Estado', sub: 'Visite nossa loja' },
              { icon: '📸', title: 'Instagram', desc: '@lojamilitar', sub: 'Siga para novidades' },
            ].map((c) => (
              <div key={c.title} className="text-center bg-gray-50 rounded-2xl p-6 hover:shadow transition-shadow">
                <p className="text-4xl mb-3">{c.icon}</p>
                <p className="font-bold text-gray-800">{c.title}</p>
                <p className="text-[#2d3a1a] font-semibold text-sm mt-1">{c.desc}</p>
                <p className="text-gray-400 text-xs mt-0.5">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1e2710] text-gray-400 py-8 text-center text-sm">
        <p className="text-white font-semibold mb-1">🛡️ Loja Militar</p>
        <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
        <a href="/admin" className="text-gray-600 hover:text-gray-400 text-xs mt-3 inline-block transition-colors">
          Área administrativa
        </a>
      </footer>
    </div>
  )
}
