import Navbar from './Components/Navbar.jsx' 
import { Routes, Route, Navigate} from 'react-router-dom'
import HomePage from './Pages/HomePage.jsx'
import SignUp from './pages/SignUpPage.jsx'
import SignIn from './pages/SignInPage.jsx'
import Settings from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import { useEffect } from 'react'
import { Loader } from "lucide-react"

const App = () => {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log("authUser", authUser)

  if (isCheckingAuth && !authUser) return (
    <div className="flex justify-center items-center h-screen">
      < Loader className="size-10 animate-spin"/>
    </div>
  )
  return (
    <div>
      <Navbar /> 
      <Routes>
        <Route path="/"         element={authUser ? <HomePage /> : <Navigate to="/signin"/>} />
        <Route path="/signup"   element={!authUser ? <SignUp /> : <Navigate to="/"/>} />
        <Route path="/signin"   element={!authUser ? <SignIn /> : <Navigate to="/"/>} />
        <Route path="/settings" element={authUser ? <Settings /> : <Navigate to="/signin"/>} />
        <Route path="/profile"  element={<ProfilePage/>} />
      </Routes>
      
    </div>
  )
}

export default App

