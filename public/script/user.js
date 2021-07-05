async function createAccount(event) {
    event.preventDefault();
    const nickname = document.querySelector('#nickname').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#passwordConfirm').value;
    const vaildMessage = isValid(nickname, password, passwordConfirm);
    if (vaildMessage !== 'ok') {
        alert(vaildMessage);
        return;
    }
    try {
        const result = await axios.post('/user/join', { nickname, password });
        if (result.data === 'ok') {
            alert('회원가입을 하였습니다.');

            location.replace("/login");
        } else {
            alert('이미 존재하는 아이디 입니다.');
        }
    } catch (error) {
        console.error(error);
    }

}

function isValid(nickname, password, passwordConfirm) {
    let msg = "ok";
    if (!nickname) {
        msg = 'nickname을 입력하세요.';
    } else if (!password) {
        msg = "password를 입력하세요.";
    } else if (password !== passwordConfirm) {
        msg = "password가 일치 해야 합니다.";
    };
    return msg;
}

async function login(event) {
    event.preventDefault();

    const id = document.querySelector('#id').value;
    const password = document.querySelector('#password').value;
    const vaildMessage = isValid(id, password, password);
    if (vaildMessage !== 'ok') {
        alert(vaildMessage);
        return;
    };

    try {
        const result = await axios.post('/user/login', { id, password });
        console.log(result);
        if (result.data.message) {
            alert(result.data.message);
            return;
        }
        localStorage.setItem('token', result.data.token);

        location.replace("/");
    } catch (error) {
        console.error(error);
    }
}

async function logout() {
    localStorage.clear();
    await axios.get('/user/logout');
    location.href = '/login';
}

function loginForm() {
    location.href = "/login";
}