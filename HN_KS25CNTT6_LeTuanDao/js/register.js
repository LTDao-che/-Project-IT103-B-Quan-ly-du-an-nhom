let users = JSON.parse(localStorage.getItem("users")) || [];

if (localStorage.getItem("currentUser")) {
    window.location.href = "category-manager.html";
}

let userForm = document.getElementById("user-form");
let userEmail = document.getElementById("user-email");
let userName = document.getElementById("user-name");
let userPassword = document.getElementById("user-password");
let confirmPassword = document.getElementById("confirm-password");

function clearAllErrors() {
    document.querySelectorAll(".form-group").forEach(function (group) {
        group.classList.remove("invalid");
        group.querySelector(".error").innerText = "";
    });
}

function validate(email, name, password, confirm) {
    let isValid = true;
    if (name === "") {
        checkError(userName, 'Không được để trống');
        isValid = false;
    }
    
    if (email === "") {
        checkError(userEmail, "Không được để trống");
        isValid = false;
    }

    let isDuplicate = users.some(function (p) {
        return p.email === email;
    });
    if (isDuplicate) {
        checkError(userEmail, "Không được để trùng");
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

    if (confirm === "") {
        checkError(confirmPassword, 'Không được để trống');
        isValid = false;
    }
    if (password !== confirm) {
        checkError(confirmPassword, 'Phải trùng mật khẩu');
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
    let addConfirm = confirmPassword.value.trim();
    let addEmail = userEmail.value.trim();
    let addName = userName.value.trim();
    let addPassword = userPassword.value.trim();

    clearAllErrors();
    if (validate(addEmail, addName, addPassword, addConfirm)) {
        let newUser = {
            id: users.length !== 0 ? users[users.length - 1].id + 1 : 1,
            name: addName,
            email: addEmail,
            password: addPassword,
        };
        let currentUserId = newUser.id;
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.removeItem("currentUser");
        localStorage.setItem("currentUser", JSON.stringify(currentUserId));
        window.location.href = "category-manager.html";
    }
});