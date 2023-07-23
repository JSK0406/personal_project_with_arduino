import './App.css';
import { useState, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import MiddleContent from './MiddleContent.js';
import LeftContent from './LeftContent.js';
import ButtonReset from './ButtonReset';

function App() {
  return (
    <div className='body'>
      <div className='header'>
        <div className='titleWrapper'>
          <a href='http://192.168.15.249:3000' className='title'>아두이노를 통한 데이터 센싱</a>
        </div>
        <div className='nav'>
          <ul className='navContents'>
            <li className='navContent'><Link to="/">Home</Link></li>
            <li className='navContent'><Link to="/ip">Weather</Link></li>
          </ul>
        </div>
      </div>

      <div className='article'>
        <div className='mainContent'>
          <Routes>
            <Route path="/" element={<MiddleContent/>}></Route>
            <Route path="/ip" element={<LeftContent />}></Route>
          </Routes>
        </div>
      </div>

      <div className='footer'>
        <div>
          <ButtonReset/>
        </div>
      </div>
    </div>
  )
}

export default App;
