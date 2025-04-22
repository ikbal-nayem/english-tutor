"use client";

const allVoicesObtained = new Promise(function (resolve, reject) {
  if (typeof window === "undefined") return;
  let voices = window.speechSynthesis.getVoices();
  if (voices.length !== 0) {
    resolve(voices);
  } else {
    window.speechSynthesis.addEventListener("voiceschanged", function () {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    });
  }
});

export function speakText(text: string) {
  if ("speechSynthesis" in window) {
    allVoicesObtained.then((voices: any) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voices[1];
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
      console.log(utterance);
    });
  } else {
    console.log("Sorry, your browser doesn't support text to speech!");
  }
}
