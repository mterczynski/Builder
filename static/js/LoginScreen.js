function LoginScreen()
{
    this.addEventListeners = function(){
        document.querySelector(".buttonRegister").addEventListener("click", (event)=>{
            const login = document.querySelector(".inputLogin").value;
            const password = document.querySelector(".inputPassword").value;
            game.client.emit("register",{login, password});
            game.playerLogin = login;
        });
        document.querySelector(".buttonLogin").onclick = function (event){
            const login = document.querySelector(".inputLogin").value;
            const password = document.querySelector(".inputPassword").value;
            game.client.emit("login", {login, password});
            game.playerLogin = login;
        }
    }
    this.getNode = function(){
        let div = document.createElement("div");
        div.classList += "loginScreen";
        div.innerHTML = `<label class="labelLogin">User name:</label>
            <input class="inputLogin" type="text">
            <label class="labelPassword">Password:</label>
            <input class="inputPassword" type="password">
            <button class="buttonLogin">Log in</button>
            <button class="buttonRegister">Register</button>`;
        return div;
    }
}