let users = JSON.parse(localStorage.getItem("users")) || [];

if (localStorage.getItem("currentUser")) {
    window.location.href = "category-manager.html";
}

let userForm = document.getElementById("user-form");
let userEmail = document.getElementById("user-email");
let userPassword = document.getElementById("user-password");

function clearAllErrors() {
    document.querySelectorAll(".form-group").forEach(function (group) {
        group.classList.remove("invalid");
        group.querySelector(".error").innerText = "";
    });
}

function validate(email, password) {
    let isValid = true;


    if (email === "") {
        checkError(userEmail, "Không được để trống");
        isValid = false;
    }

    let foundUser = users.find(function (u) {
        return u.email === email && u.password === password;
    });
    if (!foundUser) {
        checkError(userEmail, "Email hoặc mật khẩu không đúng");
        isValid = false;
    }
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        checkError(userEmail, "Email không đúng định dạng");
        isValid = false;
    }


    if (password === "") {
        checkError(userPassword, 'Không được để trống');
        isValid = false;
    }
    if (password.length < 8) {
        checkError(userPassword, "Mật khẩu phải có ít nhất 8 ký tự!");
        isValid = false;
    }

    return isValid;
}

function checkError(element, message) {
    let formGroup = element.parentElement;
    let errorDisplay = formGroup.querySelector('.error');

    errorDisplay.innerText = message;
    formGroup.classList.add('invalid');
}

userForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let addEmail = userEmail.value.trim();
    let addPassword = userPassword.value.trim();

    clearAllErrors();
    if (validate(addEmail, addPassword)) {
        let foundUser = users.find(u => u.email === addEmail && u.password === addPassword);
        let currentUserId = foundUser.id;
        localStorage.setItem("currentUser", JSON.stringify(currentUserId));
        window.location.href = "category-manager.html";
    }
});