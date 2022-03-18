// import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Tuto1 from './experiments/tuto1';
import Tuto2 from './experiments/tuto2';
import Tuto3 from './experiments/tuto3';
import Tuto4 from './experiments/tuto4';

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
          {/* draw simple triangles using webgl1.0 */}
          <Route path="/tuto1" element={<Tuto1></Tuto1>} />

          {/* draw random triangles using webgl2.0 */}
          <Route path="/tuto2" element={<Tuto2></Tuto2>} />

          {/* draw random rectangles using webgl2.0 */}
          <Route path="/tuto3" element={<Tuto3></Tuto3>} />

          {/* apply translation to a rectangle */}
          <Route path="/tuto4" element={<Tuto4></Tuto4>} />

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
