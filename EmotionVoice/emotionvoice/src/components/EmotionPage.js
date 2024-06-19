import React, { useContext,useState,useEffect }from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chart.js/auto';
import axios from 'axios';
import LocationContext from './LocationContext';
import surpriseIcon from '../assets/suprise.jpg';
import angryIcon from '../assets/angry.jpg';
import sadIcon from '../assets/sad.jpg';
import happyIcon from '../assets/happy.jpg';
import defaultImage from '../assets/default.jpg';
import manIcon from '../characters/man.jpg'
import womanIcon from '../characters/woman.jpg'
import boy from '../characters/boy.jpg'
import girl from '../characters/girl.jpg'
import grandma from '../characters/grandma.jpg'
import grandfa from '../characters/grandfa.jpg'
import male_youth from '../characters/male_youth.jpg'
import female_youth from '../characters/female_youth.jpg'


ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

function EmotionPage() {
    const location = useLocation();
    const state = location.state || {}; // location.state가 존재하지 않을 경우 빈 객체로 초기화
    const context = useContext(LocationContext);
    const [lastEmotion, setLastEmotion] = useState([]);
    const [analysisChartB, setAnalysisChartB] = useState([]);
    const [maxB,setMaxB] = useState([]);
    const [maxA,setMaxA] = useState([]);
    const [maxD,setMaxD] = useState([]);
    const [dataA, setDataA] = useState([]);
    const [emotion, setEmotion] = useState([]);
    const [finalIcon, setFinalIcon] = useState([]);
    const [icon,setIcon] = useState([]);
    const [prevContextData, setPrevContextData] = useState([]);
    const [relationshipData, setRelationshipData]=useState([]);
    const [prevContext, setPrevContext] = useState([]);
    const [vocabulary, setVocabulary] = useState([]);
    const [vocabularyData, setVocabularyData] = useState([]);
    const [spkImage, setSpkImage] = useState([]);
    const [rcvImage, setRcvImage] = useState([]);
    const [spk, setSpk] = useState([]);
    const [rcv, setRcv] = useState([]);

    useEffect(() => {
        finalAnalysis();
        utterancesAnalysis();
        getText();
        getPrevContextAnalysisData();
        getRelationshipData();
        getVocabulary();
        getVocabularyData();
    },[])

    useEffect(() => {
        if (analysisChartB.length > 0) {
            const maxEmotion = findMaxEmotion(analysisChartB);
            setMaxB(maxEmotion);
        }
    }, [analysisChartB]);

    useEffect(() => {
        if (vocabularyData.length > 0) {
            const maxEmotion = findMaxEmotion(vocabularyData);
            setMaxD(maxEmotion);
        }
    }, [analysisChartB]);

    useEffect(() => {
        if (relationshipData.length > 0) {
            const maxEmotion = findMaxRelation(relationshipData);
            setMaxA(maxEmotion);
        }
    }, [relationshipData]);

    useEffect(() => {
        switch (spk) {
            case 'man':
                setSpkImage(manIcon);
                break;
            case 'woman':
                setSpkImage(womanIcon);
                break;
            case 'grandma':
                setSpkImage(grandma);
                break;
            case 'grandfa':
                setSpkImage(grandfa);
                break;
            case 'boy':
                setSpkImage(boy);
                break;
            case 'girl':
                setSpkImage(girl);
                break;
            case 'female_youth':
                setSpkImage(female_youth);
                break;    
            case 'male_youth':
                setSpkImage(male_youth);
                break;    
            default:
                setIcon(defaultImage); // No icon for default case
        }
    }, [spk]);

    useEffect(() => {
        switch (rcv) {
            case 'man':
                setRcvImage(manIcon);
                break;
            case 'woman':
                setRcvImage(womanIcon);
                break;
            case 'grandma':
                setRcvImage(grandma);
                break;
            case 'grandfa':
                setRcvImage(grandfa);
                break;
            case 'boy':
                setRcvImage(boy);
                break;
            case 'girl':
                setRcvImage(girl);
                break;
            case 'female_youth':
                setRcvImage(female_youth);
                break;    
            default:
                setRcvImage(defaultImage); // No icon for default case
        }
    }, [rcv]);

    useEffect(() => {
        switch (emotion) {
            case '슬픔':
                setIcon(sadIcon);
                break;
            case '분노':
                setIcon(angryIcon);
                break;
            case '기쁨':
                setIcon(happyIcon);
                break;
            case '놀람':
                setIcon(surpriseIcon);
                break;
            default:
                setIcon(defaultImage); // No icon for default case
        }
    }, [emotion]);

    useEffect(() => {
        switch (lastEmotion.DECSN_EMT_TYPE) {
            case '슬픔':
                setFinalIcon(sadIcon);
                break;
            case '분노':
                setFinalIcon(angryIcon);
                break;
            case '기쁨':
                setFinalIcon(happyIcon);
                break;
            case '놀람':
                setFinalIcon(surpriseIcon);
                break;
            default:
                setFinalIcon(defaultImage); // No icon for default case
        }
    }, [lastEmotion]);

    const getText = ()=>{
        axios.post(`http://localhost:${context.serverIp}/utt_text_rcv`,{ id:state })
            .then((response) => {
                console.log(response.data);
                setDataA(response.data[0]);
                setSpk(response.data[0].spk_image);
                setRcv(response.data[0].rcv_image);
                setEmotion(response.data[0].prev_emotion);
            }).catch(error => {
                console.error('서버에러',error);
            });
    }

    const getVocabularyData = ()=>{
        axios.post(`http://localhost:${context.serverIp}/getVocabularyData`,{ id:state })
            .then((response) => {
                console.log(response.data);
                setVocabularyData(response.data);
            }).catch(error => {
                console.error('서버에러',error);
            });
    }

    const getVocabulary = ()=>{
        axios.post(`http://localhost:${context.serverIp}/getVocabulary`,{ id:state })
            .then((response) => {
                setVocabulary(response.data);
            }).catch(error => {
                console.error('서버에러',error);
            });
    }

    const getRelationshipData = ()=>{
        axios.post(`http://localhost:${context.serverIp}/getRelationshipData`,{ id:state })
            .then((response) => {
                setRelationshipData(response.data);
            }).catch(error => {
                console.error('서버에러',error);
            });
    }

    const getPrevContextAnalysisData = ()=>{
        axios.post(`http://localhost:${context.serverIp}/getPrevContextAnalysisData`,{ id:state })
            .then((response) => {
                setPrevContextData(response.data);
                setPrevContext(response.data[0].prev_context);
            }).catch(error => {
                console.error('서버에러',error);
            });
    }

    const finalAnalysis = () =>{
            axios.post(`http://localhost:${context.serverIp}/getLastEmotionAnalysis`,{ id:state })
            .then((response) => {
                setLastEmotion(response.data[0]);
            }).catch(error => {
                console.error('서버에러',error);
            });
    };

    const utterancesAnalysis=()=>{
            axios.post(`http://localhost:${context.serverIp}/getUtteranceAnalysis`,{ id:state })
            .then((response) => {
                setAnalysisChartB(response.data);
            }).catch(error => {
                console.error('서버에러',error);
            })
    };

    const findMaxEmotion = (data) => {
        const maxValue = Math.max(...data.map(item => item.UTT_EMT_PT));

        return data.find(item => item.UTT_EMT_PT === maxValue);
    };

    const findMaxRelation = (data) => {
        const maxValue = Math.max(...data.map(item => item.RELATE_PT));

        return data.find(item => item.RELATE_PT === maxValue);
    };

    const BData = {
        labels: analysisChartB.length > 0 ? analysisChartB.map(item => item.EMT_TY) : [],
        datasets: [
            {
                label: '감정분석',
                data: analysisChartB.length > 0 ? analysisChartB.map(item => item.UTT_EMT_PT) : [],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#ff9f40', '#4bc0c0'],
            },
        ],
    };

    const DData = {
        labels: vocabularyData.length > 0 ? vocabularyData.map(item => item.EMT_TY) : [],
        datasets: [
            {
                label: '감정어휘 분석',
                data: vocabularyData.length > 0 ? vocabularyData.map(item => item.UTT_EMT_PT) : [],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#ff9f40', '#4bc0c0'],
            },
        ],
    };
    
    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: '#000000',
                },
            },
            tooltip: {
                enabled: true,
            },
            datalabels: {
                color: '#000000',
                anchor: 'center',
                align: 'center',
                formatter: (value) => {
                    return value > 0 ? `${value}%` : '';
                },
            }    
        },
    };
    
    const AData = {
        labels: relationshipData.length > 0 ? relationshipData.map(item => item.RELATE_TY) : [],
        datasets: [
            {
                data: relationshipData.length > 0 ? relationshipData.map(item => item.RELATE_PT) : [],
                backgroundColor: ['#f7e948', '#ADD1C1', '#ff808b'],
            },
        ],
    };
    
    const CData = {
        labels: prevContextData.length > 0 ? prevContextData.map(item => item.prev_context_emotion) : [],
        datasets: [
            {
                label: '감정 분석',
                data: prevContextData.length > 0 ? prevContextData.map(item => item.prev_context_emotion_percent) : [],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#ff9f40', '#4bc0c0'],
            },
        ],
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f7f7f7',
        fontFamily: 'Arial, sans-serif',
    };

    const pageStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        width: '94.5%',
        height: '94.5%',
        maxWidth: '1200px',
        position: 'relative',
        overflow: 'auto',
    };

    const hideScrollbarStyle = {
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* Internet Explorer 10+ */
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '1.5em',
        cursor: 'pointer',
        textDecoration: 'none',
    };

    const titleStyle = {
        fontSize: '2em',
        fontWeight: 'bold',
        marginBottom: '20px',
    };

    const contentStyle = {
        display: 'flex',
        width: '100%',
    };

    const panelStyle = {
        flex: 1,
        padding: '20px',
    };

    const leftPanelStyle = {
        ...panelStyle,
        borderRight: '1px solid #ccc',
    };

    const sectionStyle = {
        marginBottom: '20px',
    };

    const imageStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        marginRight: '10px',
    };

    const textContentStyle = {
        display: 'inline-block',
        verticalAlign: 'top',
    };

    const speechStyle = {
        fontSize: '1em',
        color: '#555',
    };

    const percentageStyle = {
        fontSize: '1em',
        color: '#ff5733',
    };

    const previousSpeechTextStyle = {
        fontSize: '1em',
        fontWeight: 'bold',
    };

    const emotionLabelStyle = {
        fontSize: '1em',
        color: '#007bff',
    };

    const emotionPercentageStyle = {
        fontSize: '1.2em',
        color: '#ff5733',
        fontWeight: 'bold',
    };

    const contextTextStyle = {
        fontSize: '1em',
        color: '#555',
    };

    const finalEmotionTextStyle = {
        fontSize: '3em',
        color: 'red',
        fontWeight: 'bold',
    };

    const emotionWordBoxStyle = {
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '10px',
        backgroundColor: 'white',
        fontSize: '1em',
        lineHeight: '1.5',
    };

    const emotionBoxStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    };

    return (
        <div style={{ ...containerStyle, ...hideScrollbarStyle }}>
            <style>
                {`
                    ::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>
            <div style={pageStyle}>
                <a href="http://localhost:3000/Scenario" style={closeButtonStyle}>&times;</a>
                <h1 style={titleStyle}>{dataA.title}</h1>

                <div style={contentStyle}>
                    <div style={leftPanelStyle}>
                        <div style={sectionStyle}>
                            <img src={spkImage} alt="남편" style={imageStyle} /><br></br>
                            <div style={textContentStyle}>
                                <p>발화자: {dataA.spk_name}</p>
                                <p style={speechStyle}>“{dataA.utt_text}”</p>
                            </div>
                        </div>

                        <div style={sectionStyle}>
                            <img src={rcvImage} alt="아내" style={imageStyle} />
                            <div style={textContentStyle}>
                                <p>수신자: {dataA.rcv_name}</p>
                                {/* <p style={speechStyle}>“{dataA.prev_utt_text}”</p> */}
                            </div>
                            {/* <h3>수신자일 확률: {dataA.rcv_percent}%</h3> */}
                        </div>

                        <div style={sectionStyle}>
                            <h3>수신자와의 관계</h3>
                            <Doughnut data={AData} options={options} />
                            <p style={percentageStyle}>{maxA.RELATE_TY} : {maxA.RELATE_PT}%</p>
                        </div>

                        <div style={sectionStyle}>
                            <h3>발화의 감정 어휘 분석</h3>
                            <Bar data={DData} options={options} />
                            <p style={emotionPercentageStyle}>{maxD.EMT_TY}: {maxD.UTT_EMT_PT}%</p>
                        </div>

                        <div style={sectionStyle}>
                            <div style={emotionWordBoxStyle}>
                                <h4>발화 문장의 감정 어휘</h4>
                                {vocabulary.map((item, index) => (
                                    <p key={index}>{item.EMT_TY}어휘 : {item.EMT_VCBLR}</p>
                                ))}
                            </div>
                        </div>

                    </div>
                    

                    <div style={panelStyle}>
                        <div style={sectionStyle}>
                            <h3>발화 문장의 감정 분석</h3>
                            <Bar data={BData} options={options} />
                            <p style={emotionPercentageStyle}>{maxB.EMT_TY}: {maxB.UTT_EMT_PT}%</p>
                        </div>

                        <div style={sectionStyle}>
                            <h3>전 발화</h3>
                            <p style={previousSpeechTextStyle}>“{dataA.prev_utt_text}”</p>
                            <h3>전 발화의 감정</h3>
                            <div style={emotionBoxStyle}>
                                <img src={icon} alt="놀람" style={{ width: '30px', height: '30px' }} />
                                <span style={emotionLabelStyle}>{dataA.prev_emotion}</span>
                            </div>
                        </div>

                        <div style={sectionStyle}>
                            <h3>직전 상황 맥락 TEXT</h3>
                            <p style={contextTextStyle}>{prevContext}</p>
                            <Doughnut data={CData} options={options} />
                        </div>

                        <div style={sectionStyle}>
                            <h3>최종 감정 분석 결과</h3>
                            <p style={finalEmotionTextStyle}><img src={finalIcon} alt="최종감정" style={{ width: '100px', height: '100px' }}/><br/>{lastEmotion.DECSN_EMT_TYPE}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmotionPage;
