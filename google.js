import Strings from './strings.js';

/* Deal with Google search */
const dealWithSearch = (resultArr) => {
  const searchFor = resultArr[1];
  const utterance = new SpeechSynthesisUtterance(Strings.searchGoogle + searchFor + Strings.bro);
  utterance.rate = 1;
  speechSynthesis.speak(utterance);

  window.open("https://www.google.com/search?q=" + searchFor, '_blank');
}

export default dealWithSearch;