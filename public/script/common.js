async function auth() {

    const token = localStorage.getItem("token");
    try {
        const result = await axios.get('/user/me', {
            headers: { "authorization": token }
        });
        const logoutbtnText = document.querySelector("#logoutText");
        const logoutbtn = document.querySelector("#loginOrlogout");

        if (!result.data.user) {
            logoutbtnText.textContent = 'LogIn'
            logoutbtn.addEventListener('click', loginForm);

        } else {
            logoutbtnText.textContent = 'LogOut'
            logoutbtn.addEventListener('click', logout);

            return result.data.user
        }
    } catch (error) {
        console.error(error);
    }
}