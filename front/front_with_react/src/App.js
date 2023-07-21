import './App.css';
import { useState, useEffect } from 'react';
import MiddleContent from './MiddleContent.js';
import { Link, Route, Routes } from 'react-router-dom';
import LeftContent from './LeftContent.js';
import RightContent from './RightContent.js';
import GraphContent from './GraphContent.js';

function App() {

  return (
    <div className='body'>
      <div className='header'>
        <div className='titleWrapper'>
          <a href='http://localhost:3000/home' className='title'>아두이노를 통한 데이터 센싱</a>
        </div>
        <div className='nav'>
          <ul className='navContents'>
            <li className='navContent'><Link to="/home">Home</Link></li>
            <li className='navContent'><Link to="/ip">Ip</Link></li>
            <li className='navContent'><Link to="/chart">Chart</Link></li>
            <li className='navContent'><Link to="/status">Status</Link></li>
          </ul>
        </div>
      </div>

      <div className='article'>
        <div className='mainContent'>
          <Routes>
            <Route path="/home" element={<MiddleContent/>}></Route>
            <Route path="/ip" element={<LeftContent />}></Route>
            <Route path="/chart" element={<GraphContent />}></Route>
            <Route path="/status" element={<RightContent />}></Route>
          </Routes>
        </div>
      </div>

      <div className='footer'>
        <div>하단</div>
      </div>

    </div>
  )
}

export default App;
