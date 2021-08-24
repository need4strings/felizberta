/* Deal with YouTube search */
const dealWithYoutube = (resultArr, strings) => {
  const searchFor = resultArr[1];
  const utterance = new SpeechSynthesisUtterance(strings.searchYoutube + searchFor + strings.bro);
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
  window.open("https://www.youtube.com/results?search_query=" + searchFor, '_blank');
}

export default dealWithYoutube;