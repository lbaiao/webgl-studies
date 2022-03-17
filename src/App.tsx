import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Tuto1 from './experiments/tuto1';
import Tuto2 from './experiments/tuto2';

function App() {
  return (
    <div className="App">
      {/*<header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        </header>*/}
      <Router>
        <Routes>
          <Route path="/tuto1" element={<Tuto1></Tuto1>} />
          <Route path="/tuto2" element={<Tuto2></Tuto2>} />
          <Route path="/users" element={<Users></Users>} />
          <Route path="/" element={<Home></Home>} />
        </Routes>
      </Router>
    </div>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

export default App;
