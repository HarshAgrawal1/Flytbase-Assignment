document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", function (event) {
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const phone = document.getElementById("phone").value;
        const phonePattern = /^[0-9]{10}$/;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            event.preventDefault();
        }

        if (!phonePattern.test(phone)) {
            alert("Enter a valid 10-digit phone number.");
            event.preventDefault();
        }
    });
});