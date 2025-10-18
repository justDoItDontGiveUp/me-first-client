
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import { Products } from "./components/products/Products";
import { HomePage } from "./components/homePage/HomePage";
import { Projects } from "./components/projects/Projects";
import { Contacts } from "./components/contacts/Contacts";
import { Agents } from "./components/agents/Agents";
import { Todos } from "./components/todos/Todos";
import { Login } from "./components/loginAddUser/Login";
import { ProjectDisplay } from "./components/projects/ProjectDisplay";
import { StageDisplay } from "./components/stages/StageDisplay";
import { NavigationBar } from './components/homePage/NavigationBar';
import { Header } from './components/homePage/Header';
import './App.js';

function App() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();


  const hideHeaderRoutes = ['/login'];

 
  const showHeader = isLoggedIn && !hideHeaderRoutes.includes(location.pathname);

 
  if (!isLoggedIn && location.pathname !== '/login') {
    
    return <Login />;
  }

  return (
    <div className='app-layout'>
      {showHeader && <Header />}
      <div className="main-layout">
        <main className="main-content">
          <Routes>
            <Route path='login' element={<Login />} />
            <Route path="/" />
            <Route path="/:username" element={<NavigationBar />}>
              <Route path="home" element={<HomePage />} />
              <Route path="products" element={<Products />} />
              <Route path="projects">
                <Route path=":projectStatus" element={<Projects />} />
                <Route path="projectDisplay/:projectId" element={<ProjectDisplay />} />
                <Route path="stageDisplay/:projectId/:stageId" element={<StageDisplay />} />
              </Route>
              <Route path="contacts">
                <Route path="customers" element={<Contacts type="customer" />} />
                <Route path="suppliers" element={<Contacts type="supplier" />} />
              </Route>
              <Route path="todos" element={<Todos />} />
              <Route path="users">
                <Route path="agents" element={<Agents />} />
                <Route path=":agentName/projects" element={<Projects />} />
              </Route>
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
