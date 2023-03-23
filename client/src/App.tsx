import { Provider } from 'react-redux';
import Chat from './components/chat/chat';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <Chat />
    </Provider>
  );
}

export default App;
