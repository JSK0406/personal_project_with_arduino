import React from 'react';

function RightContent(props) {
    return (
        <div className='RightContentWrapper'>
            <div>현재 온도 : {props.temp}°C</div>
            <div>현재 카운트 :{props.count}</div>
            <div>현재 밝기 정도 : {props.pr}</div>
        </div>  
    )
}

export default RightContent;