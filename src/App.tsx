import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicReviews from './pages/PublicReviews'
import AdminReviews from './pages/AdminReviews'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicReviews />} />
        <Route path="/admin" element={<AdminReviews />} />
      </Routes>
    </BrowserRouter>
  )
}
