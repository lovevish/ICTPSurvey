const express = require ("express");
const cors = require ("cors");
const mysql = require("mysql");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '/build')));
const SELECT_ALL_USERS_QUERY = 'SELECT * FROM SURVEY';

const DB = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Monday02',
    database: 'survey',
    timezone: '+1000',
    connectionLimit: 10, // connection number at a same time
    connectTimeout: 10000,
    waitForConnections: true, // enqueue query when no connection available
    queueLimit: 0 // unlimit queue size
};

var pool = mysql.createPool(DB);

pool.query(`SET sql_mode = (select replace(@@sql_mode, 'ONLY_FULL_GROUP_BY',''))`);
pool.query(`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Monday02';`);
pool.query(`use survey`);

console.log("-- connection ", pool);

app.get('/submitSurvey', (req, res) => {
   const {survey_date, survey_time,
       answer1, answer1comments,
       answer2, answer2comments,
       answer3, answer3comments,
       answer4, answer4comments,
       answer5, answer5comments,
       answer6, answer6comments,
       answer7, answer7comments,
       answer8, answer8comments,
       answer9, answer9comments,
       secondaryAnswer9, secondaryAnswer9Comments,
       secondaryAnswer8, secondaryAnswer8Comments,
       secondaryAnswer7, secondaryAnswer7Comments,
       secondaryAnswer6, secondaryAnswer6Comments,
       secondaryAnswer5, secondaryAnswer5Comments,
       secondaryAnswer4, secondaryAnswer4Comments,
       secondaryAnswer3, secondaryAnswer3Comments,
       secondaryAnswer2, secondaryAnswer2Comments,
       secondaryAnswer1, secondaryAnswer1Comments
   } = req.query;
   const INSERT_SURVEY = `INSERT INTO SURVEY (
       survey_date, survey_time,
       answer1, comment1,
       answer2, comment2,
       answer3, comment3,
       answer4, comment4,
       answer5, comment5,
       answer6, comment6,
       answer7, comment7,
       answer8, comment8,
       answer9, comment9,
       secondaryanswer9, secondarycomment9,
       secondaryanswer8, secondarycomment8,
       secondaryanswer7, secondarycomment7,
       secondaryanswer6, secondarycomment6,
       secondaryanswer5, secondarycomment5,
       secondaryanswer4, secondarycomment4,
       secondaryanswer3, secondarycomment3,
       secondaryanswer2, secondarycomment2,
       secondaryanswer1, secondarycomment1
       )
       VALUES ( 
       '${survey_date}',  '${survey_time}',
       '${answer1}', '${answer1comments}', 
       '${answer2}', '${answer2comments}', 
       '${answer3}', '${answer3comments}', 
       '${answer4}', '${answer4comments}', 
       '${answer5}', '${answer5comments}', 
       '${answer6}', '${answer6comments}', 
       '${answer7}', '${answer7comments}', 
       '${answer8}', '${answer8comments}', 
       '${answer9}', '${answer9comments}',
       '${secondaryAnswer9}', '${secondaryAnswer9Comments}',
       '${secondaryAnswer8}', '${secondaryAnswer8Comments}',
       '${secondaryAnswer7}', '${secondaryAnswer7Comments}',
       '${secondaryAnswer6}', '${secondaryAnswer6Comments}',
       '${secondaryAnswer5}', '${secondaryAnswer5Comments}',
       '${secondaryAnswer4}', '${secondaryAnswer4Comments}',
       '${secondaryAnswer3}', '${secondaryAnswer3Comments}',
       '${secondaryAnswer2}', '${secondaryAnswer2Comments}',
       '${secondaryAnswer1}', '${secondaryAnswer1Comments}'
       )`;
   pool.query(INSERT_SURVEY, (err, results) => {
       if(err) return res.send(err);
       return res.json({
           data: results
       })
   });
});

app.get('/', (req, res) => {
    pool.query(SELECT_ALL_USERS_QUERY, (err, results) => {
        if(err) {
            return res.send(err);
        } else {
            return res.json({
                data: results
            })
        }
    })
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/build/index.html'));
})
app.listen(process.env.PORT || 4000, () => {
    console.log("-- Survey server listening @ port 4000..")
})