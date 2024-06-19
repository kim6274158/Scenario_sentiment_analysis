import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // useLocation을 사용하여 URL에서 query parameter를 가져옴

const Analysis = () => {
    const [emotion, setEmotion] = useState('');
    const location = useLocation(); // useLocation을 사용하여 location 객체 가져오기

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search); // query parameter 가져오기
        const emotionParam = searchParams.get('emotion'); // 'emotion' 파라미터 값 가져오기
        if (emotionParam) {
            setEmotion(emotionParam);
        }
    }, [location]);

    return (
        <div>
            <h1>Analysis Page</h1>
            <p>Emotion: {emotion}</p>
        </div>
    );
}

export default Analysis;
