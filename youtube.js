/* Deal with YouTube search */
const dealWithYoutube = (resultArr) => {
  const searchFor = resultArr[1];
  const utterance = new SpeechSynthesisUtterance(searchYoutube + searchFor + bro);
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
  window.open("https://www.youtube.com/results?search_query=" + searchFor, '_blank');
}