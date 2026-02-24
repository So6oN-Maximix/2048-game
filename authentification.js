const registerForm = document.querySelector(".form-container");

registerForm.addEventListener("submit", (event) => {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("password-confirm").value;

    if (password.checkValidity()) {
        if (password != confirmPassword) {
            event.preventDefault();
            alert(`Passwords are differents -> ${password} / ${confirmPassword}`);
        }
    }
})