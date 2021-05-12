var myButton = document.querySelector("button")
var text = document.querySelector(".two")
myButton.onclick = function() {
    var comment = document.querySelector(".one")
    text.innerHTML += '<div>' + comment.value + '</div>'

}