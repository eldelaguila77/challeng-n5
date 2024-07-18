import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Person from './components/Person/Person';
import Vehicle from './components/Vehicle/Vehicle';
import Official from './components/Official/Official';
import Sidebar from './components/Sidebar/Sidebar';
import 'react-toastify/dist/ReactToastify.css';


export default function RouterApp() {
  return (
    /*<Brow>
      <Router>
        <Route path="/" element={<Login />} />
        <Route path="/person" element={<Person />} />
        <Route path="/vehicle/:personId" element={<Vehicle />} />
        <Route path="official" element={<Official />} />
      </Router>
    </Brow>*/
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{flex: 1, padding: '5%'}}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/person" element={<Person />} />
            <Route path="/vehicle/:personId" Component={Vehicle} />
            <Route path="official" element={<Official />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterApp />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
