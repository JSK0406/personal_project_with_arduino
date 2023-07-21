import React, { useEffect, useState } from 'react';
import LeftContent from './LeftContent.js';
import RightContent from './RightContent.js';
import GraphContent from './GraphContent.js';

function MiddleContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDataFromServer = () => {
    fetch('http://localhost:8000/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false); // 데이터 받아오기 완료, 로딩 상태 해제
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // 데이터 받아오기 실패, 로딩 상태 해제
      });
  };

  useEffect(() => {
    getDataFromServer(); // 컴포넌트가 처음 렌더링될 때 한 번 호출

    // 5초마다 getDataFromServer 함수를 호출
    const intervalId = setInterval(() => {
      getDataFromServer();
    }, 5000);

    // 컴포넌트가 언마운트될 때 타이머 제거
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <div>
      {data ? (
        <div className='ContentBox'>
          <div className='ContentWrapper'>
            <LeftContent className='LeftContent' ip={data.ip} />
          </div>
          <div className='ContentWrapper'>
            <GraphContent className='GraphContent' temp={data.temp} count={data.count} pr={data.pr} />
          </div>
          <div className='ContentWrapper'>
            <RightContent className='RightContent' temp={data.temp} count={data.count} pr={data.pr} />
          </div>
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}

export default MiddleContent;
