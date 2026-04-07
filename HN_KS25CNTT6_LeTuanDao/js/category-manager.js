







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

renderTable(projects);