import React, { useEffect, useState } from 'react';
import LeftContent from './LeftContent.js';
import RightContent from './RightContent.js';
import GraphContent from './GraphContent.js';

function MiddleContent() {

  // 온도, 카운트, 조도, 측정 당시 시각을 받아 큐에 넣기 위한 선언부분, IP는 나타내지 않지만 받아오고 있음
  const [temp_q, setTempQ] = useState([]);
  const [count_q, setCountQ] = useState([]);
  const [pr_q, setPrQ] = useState([]);
  const [ip, setIp] = useState(null);
  const [time_q, setTimeQ] = useState([]);

  // 로딩 과정에서 로딩중이라는 문구를 보여주기 위함
  const [loading, setLoading] = useState(true);

  // 갱신시간을 바꾸기 위해 state구문 사용
  const [refreshtime, setRefreshTime] = useState(5000);

  // 갱신시간을 웹에서 조작할 때마다 useEffect 안에 선언한 부분이 실행됨
  useEffect(() => {
    getDataFromServer();
    const interval = setInterval(getDataFromServer, refreshtime);

    // 컴포넌트가 언마운트될 때 인터벌 해제
    return () => clearInterval(interval);
  }, [refreshtime]);


  const handleRefreshTimechange = (e) => {
    setTimeout(p => p , 3000);
    setRefreshTime(e.target.value);
    setTempQ([]);
    setCountQ([]);
    setPrQ([]);
    setTimeQ([]);
    clearInterval();  // time이 바뀌면 그동안 쌓였던 interval을 전부 해지해줘야함 => range를 바꾸면서 추가되는 interval도 해지해줌
  }

  const getDataFromServer = () => {
    fetch('http://192.168.15.249:8000/data')
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

  // 조도의 변화에 따라 배경의 밝기를 변화
  const changeBrightness = (percent) => {
    const bodyElement = document.querySelector('.body');
    bodyElement.style.filter = `brightness(${percent}%)`;
  };

  // 조도를 최소가 50%, 최대에서 100%의 밝기가 되는 수치로 변환하였음.
  useEffect(() => {
    changeBrightness((pr_q[4] - 100) / (2500 - 100) * 50 + 50);
  }, [pr_q])

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
        <input className='timeController' type='range' min={1000} max={30000} step={1000} value={refreshtime} onChange={handleRefreshTimechange}/>
      </div>
      <div className='ContentWrapper'>
        <RightContent className='RightContent' temp={temp_q[4]} count={count_q[4]} pr={pr_q[4]} />
      </div>
    </div>
  );
}

export default MiddleContent;
