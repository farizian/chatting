/* eslint-disable react/react-in-jsx-scope */
import { BrowserRouter } from 'react-router-dom';
import Route from './router/index';
import store from './redux/store';
import { Provider } from 'react-redux'

function App() {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Provider store={store}>
      <BrowserRouter>
        <Route/>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
