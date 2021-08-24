/* Deal with Google search */
const dealWithSearch = (resultArr) => {
  const searchFor = resultArr[1];
  const utterance = new SpeechSynthesisUtterance(searchGoogle + searchFor + bro);
  utterance.rate = 1;
  speechSynthesis.speak(utterance);

  window.open("https://www.google.com/search?q=" + searchFor, '_blank');
}