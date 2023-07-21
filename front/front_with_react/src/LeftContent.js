import React from 'react';

function LeftContent(props) {
    
    return (
        <div className='LeftContentWrapper'>
            당신의 ip는 "{props.ip}" 입니다.
        </div>
    )
}

export default LeftContent;