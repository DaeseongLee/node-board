
async function auth() {
    try {

        const result = await axios.get('/user/me', {
            headers: { "authorization": `Bearer ${localStorage.getItem("token")}` }
        });

    } catch (error) {
        console.error(error);
    }
}

auth();