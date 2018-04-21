function MessageBox()
{
    // private:
    function getNode(text = ""){
        let mainDiv = document.createElement("div");
        let messageDiv = document.createElement("div");

        mainDiv.appendChild(messageDiv);
        mainDiv.classList += "MessageBox";
        messageDiv.innerHTML = text;
        
        mainDiv.onclick = function(event) {
            mainDiv.remove();
        }

        return mainDiv;
    }
    // public:
    this.getNode = getNode;
}