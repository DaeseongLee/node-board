
if (document.querySelector('#img')) {
    document.querySelector('#img').addEventListener('change', async (e) => {
        try {
            const formData = new FormData();
            formData.append('img', e.target.files[0]);
            const result = await axios.post('/board/create/img', formData);
            document.querySelector('#img-url').value = result.data.url;
            document.querySelector('#img-preview').src = result.data.url;
        } catch (error) {
            console.error(error);
        }
    });
}