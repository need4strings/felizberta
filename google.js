/* Deal with Google search */
const dealWithSearch = (resultArr, strings) => {
  const searchFor = resultArr[1];
  const utterance = new SpeechSynthesisUtterance(strings.searchGoogle + searchFor + strings.bro);
  utterance.rate = 1;
  speechSynthesis.speak(utterance);

  window.open("https://www.google.com/search?q=" + searchFor, '_blank');
}

export default dealWithSearch;