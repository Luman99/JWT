import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import GroupsPage from './pages/GroupsPage/GroupsPage'
import LoginPage from './pages/LoginPage'
import RegistrationPage from './pages/RegistrationPage'
import VerifyRegistrationPage from './pages/VerifyRegistrationPage'
import CategoryQuestions from './pages/QuestionsPage'
import CreateExamPage from './pages/CreateExamPage'
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
          <Route path="profile" element={<ProfilePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="registration" element={<RegistrationPage />} />
          <Route path="verify_registration/:token" element={<VerifyRegistrationPage />} />
          <Route path="grupy" element={<GroupsPage />} />
          <Route path="questions/:category_id" element={<CategoryQuestions />} />
          <Route path="createexam" element={<CreateExamPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
