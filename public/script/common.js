async function auth() {
    try {
        const result = await axios.get('/user/me', {
            headers: { "authorization": `${localStorage.getItem("token")}` }
        });

        const logoutbtn = document.querySelector("#logoutText");
        if (!result.data.user) {
            logoutbtn.textContent = 'LogIn'
        } else {
            logoutbtn.textContent = 'LogOut'
        }

    } catch (error) {
        console.error(error);
    }
}