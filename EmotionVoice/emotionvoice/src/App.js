import './App.css';
import React ,{ useState }from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './components/HomePage.js';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import RegisterPage from './components/RegisterPage';
import ScenarioInputPage from './components/ScenarioInputPage';
import ScenarioPage from './components/ScenarioPage';
import EmotionPage from './components/EmotionPage';
import LocationContext from './components/LocationContext';
// import SPage from './components/SPage';

function App() {
    const [serverIp, setServerIp] = useState('17331');
    return (
        <LocationContext.Provider value={{ serverIp, setServerIp }}>
        <Router>
            <div className="App">
                <Routes>
                    <Route exact path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/Main" element={<MainPage />} />
                    <Route path="/Register" element={<RegisterPage />} />
                    <Route path="/ScenarioInput" element={<ScenarioInputPage />} />
                    <Route path="/Scenario" element={<ScenarioPage />} />
                    <Route path="/Emotion" element={<EmotionPage />} />
                    {/* <Route path="/S" element={<SPage />} /> */}
                </Routes>
            </div>
        </Router>
        </LocationContext.Provider>
    );
}

export default App;
// 박지영
