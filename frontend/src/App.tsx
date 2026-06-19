import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { MyWishlistsPage } from '@/pages/MyWishlistsPage'
import { WishlistPage } from '@/pages/WishlistPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/me" element={<MyWishlistsPage />} />
          <Route path="/w/:slug" element={<WishlistPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
