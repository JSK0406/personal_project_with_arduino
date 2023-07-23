import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import Weather from './Weather.js';

function LeftContent(props) {
    
    // 현재 시간의 변화가 일어날 때마다 반영하기 위해 훅을 사용
    const [timer, setTimer] = useState("");

    const currentTimer = () => {
        const date = new Date();
        setTimer(date.toString());
    }

    const startTimer = () => {
        setInterval(currentTimer, 1000);
    }
    
    startTimer();

    return (
        <div className='LeftContentWrapper'>
            <div className='leftUpperBox'>
                <div className='timerContent'>
                    현재시간 : {timer}
                </div>
            </div>
            <div className='weatherContent'>
                <Weather></Weather>
            </div>
        </div>
    )
}

export default LeftContent;