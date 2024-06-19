
// server.js (백엔드 서버)
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
const port = 17331;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: '0.tcp.jp.ngrok.io',
    user: 'root',
    password: 'root',
    database: 'emotion_analysis',
    port: 17331,
    insecureAuth: true
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ success: false, message: '이메일, 비밀번호 모두 입력하세요.' });
    }

    const query = 'SELECT * FROM users WHERE EMAIL = ? AND PSWD = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ success: false, message: '서버 오류' });
        }

        if (results.length > 0) {
            // 로그인 성공
            res.send({ success: true, user: results[0] });
            console.log(results[0]);
        } else {
            // 로그인 실패
            res.send({ success: false, message: '이메일, 비밀번호를 확인하세요' });
        }
    });
});

app.post('/getScenarioMain', (req,res) => {
    const uid = req.body.id;
    const sql = `SELECT
    s.SCENARIO_ID, 
    s.TITLE AS TITLE,
    ct.CN_TEXT
FROM 
    scenarios s
LEFT JOIN scenes sc ON s.SCENARIO_ID = sc.SCENARIO_ID AND sc.SCENES_NO=1
LEFT JOIN contexts ct ON sc.SCENES_ID = ct.SCENES_ID 
WHERE 
    s.USER_ID = ?
    AND ct.BFE_CN_ID IS NULL;`;
    db.query(sql, [uid], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
})

app.post('/uttEmotion', (req,res) => {
    const id = req.body.id;
    const sql = `SELECT et.EMT_TY,u.SCENES_ID FROM utterances u
    LEFT JOIN emotion_types et ON u.DECSN_EMT_ID = et.EMT_TY_ID
     WHERE u.UTT_ID= ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
})

app.post('/getAudio', (req,res) => {
    const sql = `SELECT AUDIO, AUDIO_TYPE FROM tts WHERE UTT_ID= 1`;
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            const audioBlob = results[0].AUDIO;
            const audioType = results[0].AUDIO_TYPE;
      
            res.writeHead(200, {
              'Content-Type': `audio/${audioType}`,
              'Content-Length': audioBlob.length
            });
      
            res.end(audioBlob);
          }
    });
})

app.post('/getUttAudio', (req,res) => {
    const id = req.body.id;
    const sql = `SELECT AUDIO, AUDIO_TYPE FROM tts WHERE UTT_ID= ?`;
    db.query(sql,[id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            console.log('uttAudion 함수 작동');
            const audioBlob = results[0].AUDIO;
            const audioType = results[0].AUDIO_TYPE;
            console.log(results[0].AUDIO_TYPE);
      
            res.writeHead(200, {
              'Content-Type': `audio/${audioType}`,
              'Content-Length': audioBlob.length
            });
      
            res.end(audioBlob);
          }
    });
})

app.post('/getUtteranceAnalysis', (req,res) => {
    const id = req.body.id;
    const sql = `SELECT 
    e.EMT_TY,
    ue.UTT_EMT_PT
FROM 
    utterances_emotions_analyses ue
JOIN 
    emotion_types e ON ue.EMT_TY_ID = e.EMT_TY_ID
WHERE 
    ue.UTT_ID = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
})

app.post('/getVocabularyData', (req,res) => {
    const id = req.body.id;
    const sql = `SELECT 
    e.EMT_TY,
    ue.VCBLR_EMT_PT AS UTT_EMT_PT
FROM 
    vocabulary_emotion_scores ue
JOIN 
    emotion_types e ON ue.EMT_TY_ID = e.EMT_TY_ID
WHERE 
    ue.UTT_ID = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
})

app.post('/getLastEmotionAnalysis', (req,res) => {
    const id = req.body.id;
    const sql = `SELECT
    e.EMT_TY AS DECSN_EMT_TYPE,
    u.DECSN_EMT_PT
FROM 
    utterances u
JOIN 
    emotion_types e ON u.DECSN_EMT_ID = e.EMT_TY_ID
WHERE 
    u.UTT_ID = ?; `
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
})

app.post('/getPrevContextAnalysisData', (req,res) => {
    const id = req.body.id;
    const sql = `SELECT 
    c.CN_TEXT AS prev_context, 
    emt.EMT_TY AS prev_context_emotion,
    cea.CN_EMT_PT AS prev_context_emotion_percent
FROM 
    utterances u
    LEFT JOIN utterances prev_u ON u.BFE_UTT_ID = prev_u.UTT_ID
    LEFT JOIN contexts c ON u.CN_ID = c.CN_ID
    LEFT JOIN contexts_emotions_analyses cea ON c.CN_ID = cea.CN_ID
    LEFT JOIN emotion_types emt ON cea.EMT_TY_ID = emt.EMT_TY_ID
WHERE 
    u.UTT_ID = ?;`
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
})

app.post('/getRelationshipData', (req,res) => {
    const id = req.body.id;
    const sql = `SELECT 
	rst.RELATE_TY,
    rs.RELATE_PT
FROM
	utterances u
    LEFT JOIN receivers_analyses ra ON u.UTT_ID = ra.UTT_ID
    LEFT JOIN relationships rs ON u.SCENES_ID = rs.SCENES_ID AND (
        (u.SPKR_ID = rs.charcr_one_id AND ra.RCVER_ID = rs.charcr_two_id) OR 
        (u.SPKR_ID = rs.charcr_two_id AND ra.RCVER_ID = rs.charcr_one_id)
    )
    LEFT JOIN relationship_types rst ON rs.RELATE_TY_ID = rst.RELATE_TY_ID
WHERE
	u.UTT_ID =?;`
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
})

app.post('/getVocabulary', (req,res) => {
    const id = req.body.id;
    const sql = `SELECT
	et.EMT_TY,
	ve.EMT_VCBLR
FROM
	utterances u
    LEFT JOIN vocabulary_emotions_analyses ve ON u.UTT_ID = ve.UTT_ID
    LEFT JOIN emotion_types et ON ve.EMT_TY_ID = et.EMT_TY_ID
WHERE
	u.UTT_ID = ?;`
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
})

app.post('/utt_text_rcv', (req,res) => {
    const id = req.body.id;
    const sql = `SELECT 
    u.UTT_ID, 
    spkr.CHAR_NM AS spk_name, 
    spkr.CHAR_IMAGE AS spk_image, 
    rcvr.CHAR_NM AS rcv_name, 
    rcvr.CHAR_IMAGE AS rcv_image, 
    u.UTT_TEXT AS utt_text, 
    prev_u.UTT_TEXT AS prev_utt_text,
    emt.EMT_TY AS prev_emotion,
    s.TITLE AS title
FROM 
    utterances u
    LEFT JOIN characters spkr ON u.SPKR_ID = spkr.CHAR_ID
    LEFT JOIN receivers_analyses ra ON u.UTT_ID = ra.UTT_ID
    LEFT JOIN characters rcvr ON ra.RCVER_ID = rcvr.CHAR_ID
    LEFT JOIN utterances prev_u ON u.BFE_UTT_ID = prev_u.UTT_ID
    LEFT JOIN emotion_types emt ON prev_u.DECSN_EMT_ID = emt.EMT_TY_ID
    LEFT JOIN scenes sc ON u.SCENES_ID = sc.SCENES_ID
    LEFT JOIN scenarios s ON sc.SCENARIO_ID=s.SCENARIO_ID
WHERE 
    u.UTT_ID = ?;
 `
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
})

app.post('/getRelations', (req, res) => {
    const sceneId = req.body.sceneId;
    const sql = `
        SELECT
            r.RELATION_ID,
            r.SCENES_ID,
            r.CHARCR_ONE_ID,
            r.CHARCR_TWO_ID,
            rt.RELATE_TY,
            r.RELATE_PT,
            c1.CHAR_NM AS CHARCR_ONE_NAME,
            c1.AGE AS CHARCR_ONE_AGE,
            c1.SEXDSTN AS CHARCR_ONE_SEX,
            c2.CHAR_NM AS CHARCR_TWO_NAME,
            c2.AGE AS CHARCR_TWO_AGE,
            c2.SEXDSTN AS CHARCR_TWO_SEX
        FROM
            relationships r
        JOIN
            relationship_types rt ON r.RELATE_TY_ID = rt.RELATE_TY_ID
        JOIN
            characters c1 ON r.CHARCR_ONE_ID = c1.CHAR_ID
        JOIN
            characters c2 ON r.CHARCR_TWO_ID = c2.CHAR_ID
        WHERE
            r.SCENES_ID = ?
    `;

    db.query(sql, [sceneId], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        console.log(results);
        res.json(results);
    });
});

app.post('/getCharacters', (req,res) => {
    const id = req.body.id;
    const sql = `SELECT * FROM characters WHERE SCENARIO_ID = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        console.log('등장인물 : ',results);
        res.json(results);
    });
})

app.post('/getScenario', (req, res) => {
    const name = req.body.name;
    const sql = `
    SELECT 
        scn.SCENARIO_ID,
        scn.TITLE AS SCENARIO_TITLE,
        s.SCENES_ID,
        s.SCENES_NO,
        s.SCENES_NM,
        c.CN_ID,
        c.CN_TEXT,
        u.UTT_ID,
        u.SPKR_ID,
        u.UTT_TEXT
    FROM 
        scenarios AS scn
    JOIN 
        scenes AS s ON scn.SCENARIO_ID = s.SCENARIO_ID
    LEFT JOIN 
        contexts AS c ON s.SCENES_ID = c.SCENES_ID
    LEFT JOIN 
        utterances AS u ON s.SCENES_ID = u.SCENES_ID AND c.CN_ID = u.CN_ID
    WHERE 
        scn.TITLE = ?
    ORDER BY 
        s.SCENES_NO, 
        c.CN_ID, 
        u.UTT_ID;
  `;

    db.query(sql, [name], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        console.log('db 데이터 :',results);
        const formattedData = formatData(results);
        res.json(formattedData);
    });
});

const formatData = (data) => {
    const scenesMap = {};
    data.forEach(row => {
        if(!scenesMap[row.SCENES_ID]){
            scenesMap[row.SCENES_ID]={
                sceneId:row.SCENES_ID,
                sceneName:row.SCENES_NM,
                sceneNUMBER:row.SCENES_NO,
                contexts:[]
            }
        }
        const contextIndex = scenesMap[row.SCENES_ID].contexts.findIndex(context => context.contextId === row.CN_ID);
    if (contextIndex === -1) {
      scenesMap[row.SCENES_ID].contexts.push({
        contextId: row.CN_ID,
        contextText: row.CN_TEXT,
        utterances: row.UTT_ID ? [{
          utteranceId: row.UTT_ID,
          speakerId: row.SPKR_ID,
          utteranceText: row.UTT_TEXT
        }] : []
      });
    } else if (row.UTT_ID) {
      scenesMap[row.SCENES_ID].contexts[contextIndex].utterances.push({
        utteranceId: row.UTT_ID,
        speakerId: row.SPKR_ID,
        utteranceText: row.UTT_TEXT
      });
    }
    })
    return Object.values(scenesMap);
}

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});