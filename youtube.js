/* Deal with YouTube search */
const dealWithYoutube = (resultArr, strings, speak) => {
  const searchFor = resultArr[1];
  speak(strings.searchYoutube + searchFor + strings.bro);
  window.open("https://www.youtube.com/results?search_query=" + searchFor, '_blank');
}

export default dealWithYoutube;