const mockUsers = [
    { id: 1, fullName: "An Nguyễn", email: "nguyenquangan@gmail.com", password: "12345678" },
    { id: 2, fullName: "Bình Trần", email: "binhtran@gmail.com", password: "12345678" },
    { id: 3, fullName: "Chi Lê", email: "chile@gmail.com", password: "12345678" }
];

const mockProjects = [
    {
        id: 1,
        projectName: "Xây dựng website thương mại điện tử",
        description: "Dự án phát triển nền tảng bán hàng trực tuyến cho doanh nghiệp vừa và nhỏ.",
        members: [
            { userId: 1, role: "Project owner" },
            { userId: 2, role: "Frontend developer" }
        ]
    },
    {
        id: 2,
        projectName: "Ứng dụng quản lý nhân sự HRM",
        description: "Hệ thống quản lý chấm công, tính lương và hồ sơ nhân viên nội bộ.",
        members: [
            { userId: 1, role: "Project owner" },
            { userId: 3, role: "Backend developer" }
        ]
    },
    {
        id: 3,
        projectName: "Thiết kế UI/UX App Mobile Giao hàng",
        description: "Thiết kế giao diện người dùng cho ứng dụng giao hàng nhanh trên iOS và Android.",
        members: [
            { userId: 1, role: "Project owner" }
        ]
    },
    {
        id: 4,
        projectName: "Hệ thống CRM khách hàng",
        description: "Xây dựng công cụ quản lý mối quan hệ khách hàng và tối ưu hóa quy trình sale.",
        members: [
            { userId: 1, role: "Project owner" },
            { userId: 2, role: "Tester" }
        ]
    },
    {
        id: 5,
        projectName: "Chiến dịch Marketing Mùa Hè 2026",
        description: "Lên kế hoạch và thực thi quảng bá sản phẩm mới trên các nền tảng mạng xã hội.",
        members: [
            { userId: 1, role: "Project owner" }
        ]
    },
    {
        id: 6,
        projectName: "Tối ưu hóa cơ sở dữ liệu hệ thống",
        description: "Phân tích và cải thiện tốc độ truy vấn cho hệ thống dữ liệu lớn của công ty.",
        members: [
            { userId: 1, role: "Project owner" },
            { userId: 3, role: "Database Engineer" }
        ]
    }
];

const mockTasks = [
    {
        id: 1,
        taskName: "Soạn thảo đề cương dự án",
        assigneeId: 1,
        projectId: 1,
        asignDate: "2025-03-24",
        dueDate: "2025-03-26",
        priority: "Thấp",
        progress: "Đúng tiến độ",
        status: "To do"
    }
];


function initMockData() {
    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify(mockUsers));
    }
    if (!localStorage.getItem("projects")) {
        localStorage.setItem("projects", JSON.stringify(mockProjects));
    }
    if (!localStorage.getItem("tasks")) {
        localStorage.setItem("tasks", JSON.stringify(mockTasks));
    }
    console.log("Dữ liệu mẫu đã được khởi tạo thành công!");
}


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
initMockData();