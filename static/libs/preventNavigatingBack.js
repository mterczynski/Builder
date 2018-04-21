window.onkeydown = function(event) {
    if (event.keyCode == 8) {
    //alert(event.target.tagName); //if you want to see how chrome handles keypresses not on an editable element
        if (event.target.tagName == 'BODY') {
            //alert("Prevented Navigation");
            event.preventDefault();
        }
    }
}
