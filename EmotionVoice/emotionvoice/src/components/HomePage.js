import React from 'react';

function HomePage() {
    const containerStyle = {
        textAlign: 'center',
        color: 'white',
        backgroundSize: 'cover',
        height: '80%',
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const buttonStyle = {
        backgroundColor: 'black',
        color: 'white',
        padding: '10px 40px', // 버튼 세로 가로
        textDecoration: 'none',
        borderRadius: '5px',
    };

    const textStyle = {
        fontSize: '3.5em',
        marginBottom: '50px', // 텍스트와 버튼 사이 여백
    };

    return (
        <div style={containerStyle}>
            <h1 style={textStyle}>Emotion Voice</h1>
            <a href="http://localhost:3000/login" style={buttonStyle}>시작하기</a>
        </div>
    );
}

export default HomePage;
