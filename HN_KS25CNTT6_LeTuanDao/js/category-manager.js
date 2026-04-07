/*     
   DỮ LIỆU MẪU (MOCK DATA)
     */

const mockUsers = [
    { id: 1, fullName: "An Nguyễn", email: "nguyenquangan@gmail.com", password: "123456" },
    { id: 2, fullName: "Bình Trần", email: "binhtran@gmail.com", password: "123456" },
    { id: 3, fullName: "Chi Lê", email: "chile@gmail.com", password: "123456" }
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

/*     
   HÀM KHỞI TẠO (CHỈ CHẠY 1 LẦN)
     */
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








let pageSize = 5;

let currentPage = 1;



function popUpEdit(projectId) {
    clearAllErrors();

    modalHeader.innerHTML = `<p class="modal-title">Sửa dự án</p>
                            <p class="x" onclick="closePopup()">✕</p>`;
    let editProject = projects.find(project => project.id === projectId);
    editProjectId = projectId;

    projectDescription.value = editProject.description;
    projectName.value = editProject.projectName;
    projectSave.innerText = "Cập nhật";
    modalContainer.classList.add("show");



}
function deleteProject(projectId) {
    projects = projects.filter(todo => todo.id !== projectId);
    localStorage.setItem("projects", JSON.stringify(projects));
    closePopup();
    renderTable(projects);
}
function findProjectByName() {
    const findInputElement = document.getElementById("findInput");
    const findInput = findInputElement.value.toLowerCase();
    let findProject = projects.filter(project => project.projectName.toLowerCase().includes(findInput));
    currentPage = 1;
    renderTable(findProject);
}
/*     
   1. LẤY DỮ LIỆU TỪ LOCALSTORAGE
     */
let users = JSON.parse(localStorage.getItem("users")) || [];
let projects = JSON.parse(localStorage.getItem("projects")) || [];

/*     
   2. KIỂM TRA ĐĂNG NHẬP
     */
if (!localStorage.getItem("currentUser")) {
    window.location.href = "../pages/login.html";
}

let currentUser = JSON.parse(localStorage.getItem("currentUser"));
// let currentUserId = currentUser.id;

/*     
   3. LẤY CÁC ELEMENT TỪ DOM
     */
// Bảng
let projectTable = document.getElementById("project-tbody");

// Form thêm dự án
let projectAdd = document.getElementById("add-project");
let projectName = document.getElementById("project-name");
let projectDescription = document.getElementById("project-description");

// Modal
let modalContainer = document.getElementById("modal-container");
let modalDeleteContainer = document.getElementById("modal-delete-container");

// Nút đăng xuất
let pagination = document.getElementById("pagination");


let modalHeader = document.getElementById("modal-header");
let projectSave = document.getElementById("btn-save");
let logOut = document.getElementById("log-out");
function changePage(page) {
    currentPage = page;
    renderTable(projects);
}

let editProjectId = 0;
/*     
   4. RENDER BẢNG
     */

function renderTable(projected) {
    projectTable.innerHTML = "";
    let ownerProject = projected.filter(function (project) {
        return project.members.some(function (m) {
            return m.userId === currentUser && m.role === "Project owner";
        });
    })
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = currentPage * pageSize;
    let currentProjection = ownerProject.slice(startIndex, endIndex);

    let totalPages = Math.ceil(ownerProject.length / pageSize);
    if (currentProjection.length === 0) {
        projectTable.innerHTML += `<tr><td class="zero-project">Hiện nay không có dự án </td></tr>`
    } else {
        currentProjection.forEach(function (project) {
            projectTable.innerHTML += `
            <tr>
                <td>${project.id}</td>
                <td>${project.projectName}</td>
                <td>
                    <button class="btn-edit" onclick="popUpEdit(${project.id})">Sửa</button>
                    <button class="btn-delete" onclick="popUpDelete(${project.id})">Xóa</button>
                    <button class="btn-detail" onclick="detail(${project.id})">Chi tiết</button>
                </td>
            </tr>
        `;
        });
    }
    renderPagination(totalPages);
}
function renderPagination(totalPages) {
    pagination.innerHTML = "";
    const buttonPrev = document.createElement("button");
    const buttonNext = document.createElement("button");
    buttonPrev.textContent = `<`;
    buttonPrev.classList.add("prev-btn");
    if (currentPage === 1) {
        buttonPrev.classList.add("disable");
    }
    buttonPrev.onclick = function () {
        if (currentPage > 1) changePage(currentPage - 1);
    };

    buttonNext.textContent = `>`;
    buttonNext.classList.add("next-btn");
    if (currentPage === totalPages || totalPages === 0) {
        buttonNext.classList.add("disable");
    }
    buttonNext.onclick = function () {
        if (currentPage < totalPages) changePage(currentPage + 1);
    };

    pagination.appendChild(buttonPrev);
    for (let i = 1; i <= totalPages; i++) {
        let btn = document.createElement("button");
        btn.textContent = i;
        if (i === currentPage) {
            btn.classList.add("active");
        }
        btn.onclick = function () { changePage(i) }
        pagination.appendChild(btn);
    }
    pagination.appendChild(buttonNext);
}

/*     
   5. VALIDATE & XỬ LÝ LỖI
     */
function checkError(element, message) {
    let formGroup = element.parentElement;
    let errorDisplay = formGroup.querySelector(".error");

    if (!errorDisplay) return;
    errorDisplay.innerText = message;
    formGroup.classList.add("invalid");
}

function clearAllErrors() {
    document.querySelectorAll(".add-project-group").forEach(function (group) {
        group.classList.remove("invalid");
        group.querySelector(".error").innerText = "";
    });
}

function validate(name, description) {
    let isValid = true;

    // Validate tên dự án
    if (name === "") {
        checkError(projectName, "Không được để trống");
        isValid = false;
    } else if (name.length < 10 || name.length > 75) {
        checkError(projectName, "Tên dự án phải trong tầm 10 đến 75 chữ");
        isValid = false;
    } else {
        let isDuplicate = projects.find(function (p) {
            if (p.projectName === name && p.id !== editProjectId) {
                return true;
            }
        });
        if (isDuplicate) {
            checkError(projectName, "Tên dự án đã có trong danh sách");
            isValid = false;
        }
    }

    // Validate mô tả
    if (description === "") {
        checkError(projectDescription, "Không được để trống");
        isValid = false;
    } else if (description.length < 25 || description.length > 200) {
        checkError(projectDescription, "Mô tả phải trong tầm 25 đến 200 chữ");
        isValid = false;
    }

    return isValid;
}

/*     
   6. THÊM DỰ ÁN
     */
function addProject() {
    let addName = projectName.value.trim();
    let addDescription = projectDescription.value.trim();

    clearAllErrors();

    if (!validate(addName, addDescription)) return;
    if (editProjectId === 0) {
        let newProject = {
            id: projects.length !== 0 ? projects[projects.length - 1].id + 1 : 1,
            projectName: addName,
            description: addDescription,
            members: [
                { userId: currentUser, role: "Project owner" },
            ]
        };
        projects.push(newProject);

    } else {
        let editId = projects.findIndex(project => project.id === editProjectId);
        projects[editId].projectName = projectName.value.trim();
        projects[editId].description = projectDescription.value.trim();
        editProjectId = 0;
    }




    localStorage.setItem("projects", JSON.stringify(projects));

    closePopup();
    renderTable(projects);
    projectAdd.reset();
}

/*     
   7. ĐIỀU HƯỚNG
     */
function detail(projectId) {
    localStorage.setItem("currentProjectId", JSON.stringify(projectId));

    


    window.location.href = "product-manager.html";
}

/*     
   8. MODAL
     */
function openPopUP() {

    modalHeader.innerHTML = `<p class="modal-title">Thêm dự án</p>
                            <p class="x" onclick="closePopup()">✕</p>`;
    clearAllErrors();
    projectSave.innerText = "Lưu";
    editProjectId = 0;
    projectName.value = "";
    projectDescription.value = "";
    modalContainer.classList.add("show");

}

function popUpDelete(projectId) {
    modalDeleteContainer.innerHTML = `
    <div class="modal-delete">
            <section class="modal-header">
                <p class="modal-title">Xác nhận xóa</p>
                <p class="x" onclick="closePopup()">✕</p>
            </section>

            <section class="modal-delete-main">
                <p>Bạn chắc chắn muốn xóa dự án này?</p>
            </section>

            <section class="modal-delete-footer">
                <button type="button" class="btn-cancel" onclick="closePopup()">Hủy</button>
                <button type="button" class="btn-delete" onclick="deleteProject(${projectId})">Xóa</button>
            </section>

        </div>`;
    modalDeleteContainer.classList.add("show");
}

function closePopup() {
    projectSave.innerText = "Lưu";
    editProjectId = 0;
    modalContainer.classList.remove("show");
    modalDeleteContainer.classList.remove("show");
}

/*     
   9. ĐĂNG XUẤT
     */
logOut.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
});

/*     
   10. KHỞI CHẠY
     */
initMockData();
renderTable(projects);