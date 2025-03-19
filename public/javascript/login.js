document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (email.trim() === "" || password.trim() === "") {
            alert("Please fill in all fields.");
            event.preventDefault();
        }
    });
});