async function auth() {
    try {
        const result = await axios.get('/user/me', {
            headers: { "authorization": `${localStorage.getItem("token")}` }
        });
        console.log(result);
        const logoutbtnText = document.querySelector("#logoutText");
        const logoutbtn = document.querySelector("#loginOrlogout");

        if (!result.data.user) {
            logoutbtnText.textContent = 'LogIn'
            logoutbtn.addEventListener('click', loginForm);

        } else {
            logoutbtnText.textContent = 'LogOut'
            logoutbtn.addEventListener('click', logout);
        }

    } catch (error) {
        console.error(error);
    }
}