import { React,useState,useEffect,Navigate,useRef,useContext } from 'react'
import { useNavigate,useLocation } from 'react-router-dom';
import './ScenarioPage.css'
import playImage from "../assets/play_tts.jpg"
import surpriseIcon from "../assets/suprise.jpg"
import sadIcon from "../assets/sad.jpg"
// import neutralIcon from "../assets/neutral.jpg"
import happyIcon from "../assets/happy.jpg"
import angryIcon from "../assets/angry.jpg"
import defaultImage from "../assets/default.jpg"
import pauseImage from "../assets/stop_tts.jpg"
import axios from 'axios';
import LocationContext from './LocationContext'
import RelationshipGraph from './RelationshipGraph'
import man from '../characters/man.jpg'
import woman from '../characters/woman.jpg'
import boy from '../characters/boy.jpg'
import girl from '../characters/girl.jpg'
import grandma from '../characters/grandma.jpg'
import grandfa from '../characters/grandfa.jpg'
import male from '../characters/male_youth.jpg'
import female_youth from '../characters/female_youth.jpg'

const Home = () => {
    const [dialogues, setDialogues] = useState([]);
    const [emotion, setEmotion] = useState('');
    const [icon, setIcon] = useState('');
    const [isPlaying, setIsPlaying] = useState(false); // 버튼 클릭 상태 저장
    const [ttsIcon, setTtsIcon] = useState(playImage);
    const [characters,setCharacters] = useState([]);
    const [uttId, setUttId] = useState([]);
    const [sceneId, setSceneId]=useState(1); //수정 필요
    const context = useContext(LocationContext);
    const location = useLocation();
    const state = location.state || {};
    const scenarioName = state; //수정 필요
    const navigate = useNavigate();
    const [audioUrl,setAudioUrl] = useState(null);
    const [audioElement, setAudioElement] = useState(null);

    useEffect(() => {
        getScenario();
        getCharacters();
        fetchAudio();
    }, []);

    const getScenario = () => {
        axios.post(`http://localhost:${context.serverIp}/getScenario`,{ name: scenarioName })
        .then((response) => {
            console.log(response.data);
            setDialogues(response.data);
        }).catch(error => {
            console.error('서버에러',error);
        })
    }

    // const getCharacters = () => {
    //     axios.post(`http://localhost:${context.serverIp}/getCharacters`,{ id : 1 })
    //     .then((response) => {
    //         console.log(response.data);
    //         setCharacters(response.data);
    //     }).catch(error => {
    //         console.error('서버에러',error);
    //     })
    // }

    const getCharacters = () => {
        axios.post(`http://localhost:${context.serverIp}/getCharacters`, { id: 1 })
            .then((response) => {
                console.log(response.data);
                const characterData = response.data.map(character => ({
                    ...character,
                    CHAR_IMAGE: getImagePath(character.CHAR_IMAGE) // 캐릭터 이름으로 이미지 경로 설정
                }));
                setCharacters(characterData);
            }).catch(error => {
                console.error('서버에러', error);
            });
    };

    const getImagePath = (characterImage) => {
        switch (characterImage) {
            case 'man':
                return man;
            case 'woman':
                return woman;
            case 'boy':
                return boy;
            case 'girl':
                return girl;
            case 'grandma':
                return grandma;
            case 'grandfa':
                return grandfa;
            case 'male_youth':
                return male;
            case 'female_youth':
                return female_youth;
            default:
                return defaultImage;
        }
    };

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

    const handleDialogueClick = (id) => {
        console.log(`Dialogue clicked: ${id}`);
        setUttId(id);
        axios.post(`http://localhost:${context.serverIp}/uttEmotion`,{ id: id })
        .then((response) => {
            uttFetchAudio(id);
            setEmotion(response.data[0].EMT_TY);
            setSceneId(response.data[0].SCENES_ID);
        }).catch(error => {
            console.error('서버에러',error);
        })
    };

    const uttFetchAudio = async (uttId) => {
        const response = await fetch(`http://localhost:${context.serverIp}/getUttAudio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id:uttId }),
        });
        console.log(response);
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setAudioUrl(url); // 오디오 URL 설정
            if (audioElement) {
                audioElement.src = url;
                audioElement.play(); // 오디오 자동 재생
                setIsPlaying(true);
            }
        } else {
            console.error('Failed to fetch audio');
        }
    };

    const fetchAudio = async () => {
        const response = await fetch(`http://localhost:${context.serverIp}/getAudio`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
    
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          if (audioElement) {
            audioElement.src = url;
            // audioElement.play();
          }
        } else {
          console.error('Failed to fetch audio');
        }
      };

    const EmotionButtonClick = () => {
        navigate('/emotion',{ state:uttId });
    };

    const handleButtonClick = () => {
        if (isPlaying) {
            audioElement.pause();
            setIsPlaying(false); // 일시정지 상태로 변경
        } else {
            audioElement.play();
            setIsPlaying(true); // 재생 상태로 변경
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false); // 재생 종료 시 재생 상태를 false로 설정하여 버튼 이미지를 재생 버튼으로 변경
    };

    useEffect(() => {
        setTtsIcon(isPlaying ? pauseImage : playImage);
    }, [isPlaying]);
    

	return (
        <div className="relative left-0 top-0 w-[1440px] h-[1024px] bg-[#fff] overflow-hidden">
                <div className="background">
                <div style={{ position: 'absolute', left: '10px', top: '84px', width: '359px', height: '83px', fontSize: '48px', fontFamily: 'Inter', fontWeight: 'bold', color: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>라푼첼</div>
                    <div style={{ position: 'absolute', left: '87px', top: '160px', width: '205px', height: '37px', fontSize: '30px', fontFamily: 'Inter', fontWeight: 'medium', color: '#000' }}>등장인물</div>
                    <div style={{ position: 'absolute', left: '87px', top: '378px', width: '300px', height: '37px', fontSize: '30px', fontFamily: 'Inter', fontWeight: 'medium', color: '#000' }}>등장인물 관계도</div>
                    <div style={{ position: 'absolute', left: '87px', top: '734px', width: '531px', height: '37px', fontSize: '30px', fontFamily: 'Inter', fontWeight: 'medium', color: '#000' }}>발화의 감정</div>
                </div>
                <div className="absolute left-[87px] top-[426px] w-[531px] h-[283px] bg-[#fff] rounded-[24px] overflow-hidden">
                    {/**등장인물 관계도 위치 */}
                </div>            
                <div style={{ position: 'absolute', left: '773px', top: '72px', width: '627px', height: '870px', backgroundColor: '#ffffffc7', borderRadius: '24px', overflow: 'hidden', zIndex:'1' }}>
                {/* 스토리 텍스트 칸 */}
                <div style={{ position: 'absolute', left: '63px', top: '35px', width: '500px', height: '705px', fontFamily: 'Inter', overflow: 'auto', zIndex: '2' }}>
                    {dialogues.map(scene => (
                        <div key={scene.sceneId}>
                            <h2 style={{ fontSize: '24px', color: 'black' }}>{scene.sceneName}</h2>
                            {scene.contexts.map(context => (
                                <div key={context.contextId}>
                                    <p style={{ fontSize: '18px', color: 'gray', marginBottom: '5px' }}>{context.contextText}</p>
                                    {/* 상황 및 맥락 텍스트 출력 */}
                                    {context.utterances.map((utterance, index) => (
                                        <div key={utterance.utteranceId}>
                                            {/* 발화 텍스트 출력 */}
                                            <span 
                                                style={{ fontSize: '20px', color: 'blue', display: 'block', marginBottom: '10px', cursor: 'pointer', zIndex: '3' }}
                                                onClick={() => handleDialogueClick(utterance.utteranceId)}
                                                role="button" 
                                                tabIndex={0} 
                                            >
                                                "{utterance.utteranceText}."<br></br>
                                            </span>
                                            {audioUrl && (
                                                <audio
                                                    ref={(element) => setAudioElement(element)}
                                                    onEnded={handleAudioEnded}
                                                />
                                            )}
                                            {/* 마지막 발화 텍스트 이후에는 씬과 상황 및 맥락 텍스트를 출력 */}
                                            {/* {index === context.utterances.length - 1 && (
                                                <div>
                                                    <p style={{ fontSize: '18px', color: 'gray', marginBottom: '5px' }}>{scene.sceneName}</p>
                                                </div>  
                                            )} */}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            <div>
            <button 
                onClick={handleButtonClick}
                style={{ position: 'absolute', left: '176px', top: '780px', width: '275px', height: '49px', backgroundImage: `url(${ttsIcon})`, backgroundSize: 'cover', backgroundPosition: 'center',border: 'none', padding: 0, cursor: 'pointer' }}></button>
                {audioUrl && (
                    <audio
                        ref={(element) => setAudioElement(element)}
                        onEnded={handleAudioEnded}
                    />
                )}
            </div>
            <div style={{ position: 'absolute', transform: 'translateX(-50%)', left: '50%', top: '27px', width: '580px', height: '713px', border: '1px solid #66666659', borderRadius: '12px' }}></div>
            </div>
            {/* 발화의 감정 칸 */}
            <div style={{ position: 'absolute', left: '87px', top: '796px', width: '531px', height: '146px', backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden',zIndex:'1' }}>
                <div style={{ position: 'absolute', left: '121px', top: '83px', width: '275px', height: '39px', display: 'flex', zIndex:'2' }}>
                    <button 
                        style={{ position: 'absolute', left: 0, top: 0, width: '275px', height: '39px', fontSize: '16px', backgroundColor: '#dce73a', border: '3px solid #dce73a', fontFamily: 'Poppins',
                            fontWeight: 'bold', color: '#000', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center', zIndex:'3' }}
                        onClick={() => {EmotionButtonClick();
                        }}
                    >상세 분석 결과</button>
                </div>
                <div style={{ position: 'absolute', left: '108px', top: '13px', width: '50px', height: '50px', overflow: 'hidden' }}>
                    <img style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} width="50" height="50" src={icon} alt='icon'/>
                </div>
                <div style={{ position: 'absolute', left: '125px', top: '18px', width: '275px', height: '39px', fontSize: '32px', fontFamily: 'Poppins', fontWeight: 'bold', color: '#fb1616', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{emotion}</div>
            </div>
            {/* 등장인물 관계도 칸 */}
            <div style={{ position: 'absolute', left: '87px', top: '426px', width: '531px', height: '283px', backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden' }}>
            {/*</div> */}
            {/* <div style="position: absolute; left: 87px; top: 426px; width: 531px; height: 283px; background-color: #fff; border-radius: 24px; overflow: hidden;"> */}
                <RelationshipGraph sceneId={sceneId} />
            </div>
            {/* 등장인물 칸 */}
            {/* <div style={{ position: 'absolute', left: '87px', top: '210px', width: '531px', height: '160px', backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <img style={{ marginBottom: '10px' }} width="80" height="80" src={man} alt="man" />
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '20px', fontFamily: 'Inter', fontWeight: '600' }}>남편<br /></span>
                    <span style={{ fontSize: '16px', fontFamily: 'Inter' }}>40대, 남자</span>
                </div>
            </div> */}
            <div style={{ position: 'absolute', left: '87px', top: '200px', width: '531px', height: '180px', overflowX: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
    {/* 캐릭터 데이터를 반복하여 화면에 표시 */}
    {characters.map((character, index) => (
        <div
            key={index} 
            style={{
                width: '160px', 
                marginRight: '5px',
                flexShrink: 0,
                backgroundColor: '#fff',
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <img
                style={{ marginBottom: '10px' }}
                width="100"
                height="100"
                src={character.CHAR_IMAGE}
                alt={character.CHAR_NM}
            />
            <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '20px', fontFamily: 'Inter', fontWeight: '600' }}>{character.CHAR_NM}<br /></span>
                <span style={{ fontSize: '16px', fontFamily: 'Inter' }}>{character.AGE}살, {character.SEXDSTN}</span>
            </div>
        </div>
    ))}
</div>

        </div>   
    )
}

export default Home