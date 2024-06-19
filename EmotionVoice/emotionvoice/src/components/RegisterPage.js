import React from 'react';

function RegisterPage() {
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

    return (
        <div style={containerStyle}>
            <h1 style={headerStyle}>Emotion Voice</h1>
            <div style={formStyle}>
                <input type="text" placeholder="이름" style={inputStyle} className="input-style" />
                <input type="email" placeholder="이메일" style={inputStyle} className="input-style" />
                <input type="password" placeholder="비밀번호" style={inputStyle} className="input-style" />
                <a href="http://localhost:3000/login" style={buttonStyle} className="button-style">회원가입</a>
            </div>
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
                    }
                `}
            </style>
        </div>
    );
}

export default RegisterPage;
