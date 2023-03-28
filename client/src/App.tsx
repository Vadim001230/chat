import { Provider } from 'react-redux';
import { Routes, Route, Link } from 'react-router-dom';
import RegistrationPage from './pages/registrationPage';
import LoginPage from './pages/loginPage';
import ChatPage from './pages/chatPage';
import NotFoundPage from './pages/notFoundPage';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ChatPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Provider>
  );
}

export default App;
