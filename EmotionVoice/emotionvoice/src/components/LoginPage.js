import React, {useContext, useState} from 'react';
import axios from 'axios';
import LocationContext from './LocationContext';

function LoginPage() {
    const [uid, setUid] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const context = useContext(LocationContext);

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:${context.serverIp}/login`, { email, password });
            if (response.data.success) {
                const userId = response.data.user.USER_ID;
                console.log(response.data.user.USER_ID);
                setUid(userId);
                sessionStorage.setItem('uid', userId);
                // 로그인 성공 시 메인 페이지로 이동
                window.location.href = `http://localhost:3000/Main`;
            } else {
                // 로그인 실패 시 에러 메시지 표시
                setErrorMessage('이메일, 비밀번호를 확인하세요');
            }
        } catch (error) {
            setErrorMessage('이메일, 비밀번호 모두 입력하세요');
        }
    };

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
        padding: '20px',
    };

    const headerStyle = {
        fontSize: '3em',
        fontWeight: 'bold',
        marginBottom: '40px',
    };

    const formStyle = {
        padding: '10px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '350px',
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: 'none',
        fontSize: '0.9em',
    };

    const buttonStyle = {
        backgroundColor: 'black',
        color: 'white',
        padding: '10px 40px',
        textDecoration: 'none',
        borderRadius: '5px',
        fontSize: '0.8em',
        border: 'none',
        cursor: 'pointer',
        margin: '10px 0',
    };

    const textButtonStyle = {
        background: 'none',
        color: 'lightgray',
        cursor: 'pointer',
        fontSize: '0.8em',
        border: 'none',
        marginTop: '20px',
        textDecoration: 'none',
    };

    return (
        <div style={containerStyle}>
            <h1 style={headerStyle}>Emotion Voice</h1>
            <form style={formStyle} onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="이메일 주소를 입력해 주세요."
                    style={inputStyle}
                    className="input-style"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호를 입력해 주세요."
                    style={inputStyle}
                    className="input-style"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" style={buttonStyle} className="button-style">로그인</button>
                {errorMessage && <p style={{ color: 'red', fontSize:'20px' }}>{errorMessage}</p>}
            </form>
            <a href="http://localhost:3000/Register" style={textButtonStyle} className="text-button-style">Emotion Voice가 처음이시라면, 회원가입이 필요해요.</a>
            <style>
                {`
                    @media (max-width: 600px) {
                        h1 {
                            font-size: 1.5em !important;
                            margin-bottom: 20px !important;
                        }
                        .input-style {
                            font-size: 0.7em !important;
                            padding: 8px !important;
                        }
                        .button-style {
                            font-size: 0.7em !important;
                            padding: 8px 20px !important;
                        }
                        .text-button-style {
                            font-size: 0.7em !important;
                        }
                    }
                `}
            </style>
        </div>
    );
}

export default LoginPage;
