import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegistrationPage from './pages/RegistrationPage'
import VerifyRegistrationPage from './pages/VerifyRegistrationPage'
import Header from './components/Header'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header/>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="registration" element={<RegistrationPage />} />
          <Route path="verify_registration/:token" element={<VerifyRegistrationPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
