import React, { useState } from 'react';

function LeftContent(props) {
    
    const [timer, setTimer] = useState("");

    const currentTimer = () => {
        const date = new Date();
        setTimer(date.toString());
    }

    const startTimer = () => {
        setInterval(currentTimer, 1000);
    }
    
    startTimer();

    let protected_ip_lst = props.ip.split('.');
    protected_ip_lst[1] = "***";
    protected_ip_lst[2] = "***";
    let protected_ip = protected_ip_lst.join('.');

    return (
        <div className='LeftContentWrapper'>
            <div className='ipContent'>
                당신의 ip는 "{protected_ip}" 입니다.
            </div>
            <div className='timerContent'>
                현재시간 : {timer}
            </div>
        </div>
    )
}

export default LeftContent;