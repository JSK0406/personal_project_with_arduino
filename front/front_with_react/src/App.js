import './App.css';
import { useState, useEffect } from 'react';
import MiddleContent from './MiddleContent.js';
import { Link, Route, Routes } from 'react-router-dom';
import Example from './GraphContent.js';


function App() {

  return (
    <div className='body'>
      <div className='header'>
        <div className='titleWrapper'>
          아두이노를 통한 데이터 센싱
        </div>
        <div className='nav'>
          <ul className='navContents'>
            <li className='navContent'><Link to="/home">Home</Link></li>
            <li className='navContent'><Link to="/Temp">Temperature</Link></li>
            <li className='navContent'><Link to="/pr">Brightness</Link></li>
            <li className='navContent'><Link to="/count">Count</Link></li>
          </ul>
        </div>
      </div>

      <div className='article'>
        <div className='mainContent'>
          <Routes>
            <Route path="/home" element={<MiddleContent/>}></Route>
            <Route path="/MiddleContent element={<temp />}"></Route>
            <Route path="/MiddleContent element={<pr />}"></Route>
            <Route path="/MiddleContent element={<count />}"></Route>
          </Routes>
        </div>
        <div className='graphContent'>
          <Example></Example>
        </div>
      </div>

      <div className='Footer'>

      </div>

    </div>
  )
}

export default App;
