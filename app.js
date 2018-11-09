const express = require('express')
const app = express()
const path = require("path")
const PORT = process.env.PORT || 5000
// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');

// Creates a client
const client = new speech.SpeechClient();

// The name of the audio file to transcribe
const fileName = './test.raw';

// Reads a local audio file and converts it to base64
const file = fs.readFileSync(fileName);
const audioBytes = file.toString('base64');

// The audio file's encoding, sample rate in hertz, and BCP-47 language code
const audio = {
    content: audioBytes,
};
const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
};
const request = {
    audio: audio,
    config: config,
};

// Detects speech in the audio file
client
    .recognize(request)
    .then(data => {
    const response = data[0];
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
    })
    .catch(err => {
    console.error('ERROR:', err);
    });

app.get('/',
(req, res) => {
  res.sendFile(path.join(__dirname + '/homepage.html'));
});

app.get("/detection",
(req,res) => {
  res.sendFile(path.join(__dirname + '/detection.html'));
});


app.get("/feeling",
(req,res) => {
  res.sendFile(path.join(__dirname + '/feeling.html'));
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

/*
1. fix heroku
2. change detection.html file to fit the needs
3. send the recorded file to server
4. capture the recorded file in the server
5. use it to run the google's semantic api on it
6. print the results
7. we're done!!!
*/
