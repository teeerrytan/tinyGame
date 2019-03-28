(function () {
    let userName = "";
    var socket = io.connect('http://localhost:5000');
    // var socket = io({'timeout': 5000, 'connect timeout': 5000});

    if (socket !== undefined) {
        console.log("connect to socket...");
    }

    socket.on("err", name => {
        if (name === userName) {
            alert("用户已重名! \n若您已经登录, 则说明有用户在尝试用同样的名字登陆, 可不用理会.");
        }
    });

    const loginForm = document.getElementById("login-form");
    const loginCol = document.getElementById("login-col");
    const fightingArea = document.getElementById("fighting-area");
    const userList = document.getElementById("user-list");
    const nowUser = document.getElementById("now-user");
    const main = document.getElementById("main");
    const rank = document.getElementById("rank");

    //switch page
    document.getElementById("mainButton").onclick = function () {
        main.style = "display: block";
        rank.style = "display: none";
    }
    document.getElementById("rankButton").onclick = function () {
        main.style = "display: none";
        rank.style = "display: block";
    }
    //submit login form
    document.getElementById("login").onclick = function () {

        console.log("emit success!");
        userName = document.getElementById("name").value;
        //emit login user
        socket.emit('login', userName, () => {
            console.log("emit success!");
            loginCol.style = "display: none";
            fightingArea.style = "display: block";
            nowUser.textContent = `当前用户: ${userName}`;
            nowUser.style = "display: block";
            //add
        });
    };

    //update user list
    socket.on("loadUser", data => {
        console.log("initial ", data);
        const userList = document.getElementById("user-list");
        let users = data.users;
        let userCardsArray = data.userCards;
        console.log("userCardsArray", userCardsArray);
        let userCards = new Map(JSON.parse(userCardsArray));
        userList.innerHTML = "";

        users.forEach(user => {
            var userLi = document.createElement("li");

            let cards = userCards.get(user);
            console.log("selected array is ", cards);

            if (cards.length == 0) {
                console.log("no cards!");
            } else {
                userLi.setAttribute('class', "collection-item center");
                userLi.setAttribute('style', "height: 170px;");
                userLi.innerHTML =
                    `<div class="row" style="text-align:center">
                                <button id="${user}Button" class="btn waves-effect waves-light btn-medium cyan lighten-1 left z-depth-2">${user}</button>
                            </div>
                            <div class="center">
                                <span class="new badge cyan darken-2 z-depth-1 left" data-badge-caption="" style="margin-bottom: 1em">${cards[0]}</span>
                                <span class="new badge cyan darken-2 z-depth-1 left" data-badge-caption="" style="margin-bottom: 1em">${cards[1]}</span>
                                <span class="new badge cyan darken-2 z-depth-1 left" data-badge-caption="" style="margin-bottom: 1em">${cards[2]}</span>
                            </div>`;
                userList.insertBefore(userLi, userList.lastChild);
            }

        });
    });
})();