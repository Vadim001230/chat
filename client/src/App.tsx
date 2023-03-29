import { Provider } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import RegistrationPage from './pages/registrationPage';
import LoginPage from './pages/loginPage';
import ChatPage from './pages/chatPage';
import RequireAuth from './hoc/requireAuth';
import NotFoundPage from './pages/notFoundPage';
import { AuthProvider } from './hoc/authProvider';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Routes>
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <ChatPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Provider>
  );
}

export default App;
