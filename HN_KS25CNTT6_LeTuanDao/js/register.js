

const sampleUsers = [
    { id: 1, fullName: "An Nguyễn", email: "nguyenquangan@gmail.com", password: "123456" },
    { id: 2, fullName: "Bình Trần", email: "binhtran@gmail.com", password: "123456" }
];

const sampleProjects = [
    {
        id: 1,
        projectName: "Xây dựng website thương mại điện tử chuyên nghiệp", // > 10 ký tự
        description: "Hệ thống bán hàng trực tuyến tích hợp thanh toán thẻ và quản lý kho hàng tự động.", // > 25 ký tự
        members: [
            { userId: 1, role: "Project owner" },
            { userId: 2, role: "Frontend developer" }
        ]
    },
    {
        id: 2,
        projectName: "Ứng dụng quản lý công việc nội bộ doanh nghiệp",
        description: "Giải pháp tối ưu hóa quy trình làm việc và giao tiếp giữa các phòng ban trong công ty.",
        members: [
            { userId: 1, role: "Project owner" }
        ]
    },
    {
        id: 3,
        projectName: "Phát triển hệ thống chatbot AI chăm sóc khách hàng",
        description: "Tự động trả lời tin nhắn khách hàng dựa trên công nghệ học máy và xử lý ngôn ngữ tự nhiên.",
        members: [
            { userId: 1, role: "Project owner" }
        ]
    },
    {
        id: 4,
        projectName: "Thiết kế giao diện Mobile App đặt đồ ăn nhanh",
        description: "Tập trung vào trải nghiệm người dùng (UX) và giao diện bắt mắt cho người dùng trẻ tuổi.",
        members: [
            { userId: 1, role: "Project owner" }
        ]
    },
    {
        id: 5,
        projectName: "Hệ thống phân tích dữ liệu marketing tập trung",
        description: "Thu thập và báo cáo dữ liệu từ nhiều nguồn quảng cáo khác nhau để tối ưu ngân sách.",
        members: [
            { userId: 1, role: "Project owner" }
        ]
    },
    {
        id: 6,
        projectName: "Nâng cấp bảo mật hệ thống thanh toán trực tuyến",
        description: "Triển khai các giao thức bảo mật mới nhất để bảo vệ thông tin giao dịch của người dùng.",
        members: [
            { userId: 1, role: "Project owner" }
        ]
    }
];

const sampleTasks = [
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


function setupDatabase() {
    localStorage.setItem("users", JSON.stringify(sampleUsers));
    localStorage.setItem("projects", JSON.stringify(sampleProjects));
    localStorage.setItem("tasks", JSON.stringify(sampleTasks));

    
    localStorage.setItem("currentUser", JSON.stringify(1)); 

    console.log("Đã làm sạch và nạp dữ liệu mẫu mới!");
    location.reload();
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