/* Deal with Google search */
const dealWithSearch = (resultArr, strings, speak) => {
  const searchFor = resultArr[1];
  speak(strings.searchGoogle + searchFor + strings.bro);

  window.open("https://www.google.com/search?q=" + searchFor, '_blank');
}

export default dealWithSearch;