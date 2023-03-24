import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import './App.css';
import Profile from './pages/profile';
import StudentsPage from './pages/students';
import { AppContextProvider } from './store';

const router = createBrowserRouter([
  { path: "/", element: <StudentsPage />},
  { path: "/user/:id", element: <Profile />},
])

function App() {
  return (
    <div className="App">
      <AppContextProvider>
        <RouterProvider router={router} />
      </AppContextProvider>
    </div>
  );
}

export default App;
