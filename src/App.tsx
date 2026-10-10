import { Routes, Route } from 'react-router'
import { Toaster } from 'sonner'
import Landing from './pages/Landing'
import Studio from './pages/Studio'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <>
      <Toaster richColors position="top-center" dir="rtl" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
