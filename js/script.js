// CONSTANTS
const difficulty_thematic = document.getElementsByClassName("difficulty-thematic-main-container")
const t = document.getElementById("test").style.display;

//Functions
const getFormDate = () => {
    let arr = []
    arr.push(document.getElementById("dificulty").value)
    arr.push(document.getElementById("thematic").value)
    return arr;
} 

console.log(getFormDate())





