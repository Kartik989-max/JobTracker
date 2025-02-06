import './App.css'
// import Navbar from './components/Navbar/Navbar'
// import Footer from './components/Footer/Footer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import HomePage from './pages/Home'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './lib/ProtectedRoute'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
      
      <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>

      <Route path='/dashboard' element={<DashboardPage/>}/>
      <Route path='/' element={<HomePage/>}/>
       {/* Fallback */}
       <Route path="*" element={<LoginPage/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
