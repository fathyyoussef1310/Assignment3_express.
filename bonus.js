/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(str) {
 let commonWords =[];
 let splitWords =[];
 str.forEach((word , i) => {
     splitWords[i] = word.split('');
 })
    if (splitWords.length > 0 ) {
     for (let i = 0; i < splitWords.length; i++) {
         if (splitWords[0][i] === splitWords[1][i] && splitWords[0][i] === splitWords[2][i]) {
             commonWords.push(splitWords[0][i]);
         }else {
             break;
         }
     }
    }
    return (commonWords.length === 0 ? commonWords = "" : commonWords.join(''));
};
console.log(longestCommonPrefix(["dog","racecar","car"]));