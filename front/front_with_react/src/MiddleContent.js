import React, { useEffect, useState } from 'react';
import LeftContent from './LeftContent.js';
import RightContent from './RightContent.js';
import GraphContent from './GraphContent.js';

function MiddleContent() {
  const [temp_q, setTempQ] = useState([]);
  const [count_q, setCountQ] = useState([]);
  const [pr_q, setPrQ] = useState([]);
  const [ip, setIp] = useState(null);
  const [time_q, setTimeQ] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshtime, setRefreshTime] = useState(5000);

  useEffect(() => {
    getDataFromServer(); // 컴포넌트가 처음 렌더링될 때 한 번 호출
    const interval = setInterval(getDataFromServer, refreshtime);

    // 컴포넌트가 언마운트될 때 인터벌 해제
    return () => clearInterval(interval);
  }, [refreshtime]);

  const handleRefreshTimechange = (e) => {
    setRefreshTime(e.target.value);
    setTempQ([]);
    setCountQ([]);
    setPrQ([]);
    setTimeQ([]);
  }

  const getDataFromServer = () => {
    fetch('http://localhost:8000/data')
      .then(response => response.json())
      .then(data => {
        setTempQ(prevQ => [...prevQ, data.temp]);
        setCountQ(prevQ => [...prevQ, data.count]);
        setPrQ(prevQ => [...prevQ, data.pr]);
        setTimeQ(prevQ => [...prevQ, data.time]);
        setIp(data.ip)

        setTempQ(prevQ => prevQ.slice(-5));
        setCountQ(prevQ => prevQ.slice(-5));
        setPrQ(prevQ => prevQ.slice(-5));
        setTimeQ(prevQ => prevQ.slice(-5));

        setLoading(false); // 데이터 받아오기 완료, 로딩 상태 해제

      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // 데이터 받아오기 실패, 로딩 상태 해제
      });
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <div className='ContentBox'>
      <div className='ContentWrapper'>
        <LeftContent className='LeftContent' ip={ip} />
      </div>
      <div className='MiddleContentWrapper'>
        <GraphContent className='GraphContent' temp_q={temp_q} count_q={count_q} pr_q={pr_q} time_q={time_q}/>
        <div className='refreshTime'>갱신시간: {refreshtime/1000 +" 초"}</div>
        <input type='range' min={1000} max={30000} step={1000} value={refreshtime} onChange={handleRefreshTimechange}/>
      </div>
      <div className='ContentWrapper'>
        <RightContent className='RightContent' temp={temp_q[4]} count={count_q[4]} pr={pr_q[4]} />
      </div>
    </div>
  );
}

export default MiddleContent;
