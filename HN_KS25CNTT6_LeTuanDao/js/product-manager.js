let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let currentProjectId = JSON.parse(localStorage.getItem("currentProjectId"));
let modalDeleteContainer = document.getElementById("modal-delete-container");
let modalContainer = document.getElementById("modal-task-container");
let addMemberModal = document.getElementById("add-member");
let taskForm = document.getElementById("task-form");

let memberEmail;
let memberRole;
let memberForm;

let taskName = document.getElementById("task-name-input");
let taskAssignee = document.getElementById("task-assignee");
let taskStatus = document.getElementById("task-status");
let taskStart = document.getElementById("task-start");
let taskDeadline = document.getElementById("task-deadline");
let taskPriority = document.getElementById("task-priority");
let taskProgress = document.getElementById("task-progress");

let taskTitle = document.getElementById("task-title");
let taskTbody = document.getElementById("task-tbody");
let editTaskId = 0;
let modalHeader = document.getElementById("modal-header");
let taskSave = document.getElementById("btn-save");


if (!localStorage.getItem("currentUser")) {
    window.location.href = "../pages/login.html";
}
let logOut = document.getElementById("log-out");

logOut.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
});


function checkError(element, message) {
    let formGroup = element.parentElement;
    let errorDisplay = formGroup.querySelector('.error');

    errorDisplay.innerText = message;
    formGroup.classList.add('invalid');
}

function validate(name, startDate, deadline) {
    let isValid = true;
    let today = new Date();
    let start = new Date(startDate);
    let due = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    if (name === "") {
        checkError(taskName, 'Không được để trống');
        isValid = false;
    } else if (name.length < 10 || name.length > 30) {
        checkError(taskName, "Tên nhiệm vụ phải trong tầm 10 đến 30 chữ");
        isValid = false;
    } else {
        let foundName = tasks.find(function (t) {
            return t.taskName === name && t.id !== editTaskId && t.projectId === currentProjectId;
        });
        if (foundName) {
            checkError(taskName, "Tên nhiệm vụ đã tồn tại");
            isValid = false;
        }
    }
    if (startDate === "") {
        checkError(taskStart, "Vui lòng chọn ngày bắt đầu");
        isValid = false;
    }
    if (deadline === "") {
        checkError(taskDeadline, "Vui lòng chọn hạn chót");
        isValid = false;
    }
    if (startDate !== "" && deadline !== "") {
    if (start < today) {
        checkError(taskStart, "Ngày bắt đầu phải >= ngày hiện tại");
        isValid = false;
    }
    if (due <= start) {
        checkError(taskDeadline, "Hạn chót phải lớn hơn ngày bắt đầu");
        isValid = false;
    }
}

    return isValid;
}
function validateMember(email, role) {
    let isValid = true;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        checkError(memberEmail, "Không được để trống");
        isValid = false;
    } else if (!emailRegex.test(email)) {
        checkError(memberEmail, "Email không đúng định dạng");
        isValid = false;
    } else {
        let foundUser = users.find(function (u) {
            return u.email === email;
        });
        if (!foundUser) {
            checkError(memberEmail, "Email không tìm thấy");
            isValid = false;
        } else {
            let currentProject = projects.find(function (p) {
                return p.id === currentProjectId;
            });
            let alreadyMember = currentProject.members.some(function (m) {
                return m.userId === foundUser.id;
            });
            if (alreadyMember) {
                checkError(memberEmail, "Người dùng đã là thành viên");
                isValid = false;
            }
        }
    }
    if (role === "") {
        checkError(memberRole, 'Không được để trống');
        isValid = false;
    }
    if (role.length < 8) {
        checkError(memberRole, "Vai trò phải ít nhất có 8 ký tự!");
        isValid = false;
    }

    return isValid;
}
function addMember() {
    let addEmail = memberEmail.value.trim();
    let addRole = memberRole.value.trim();
    clearAllMemberErrors();
    if (!validateMember(addEmail, addRole)) return;

    let memberUser = users.find(function (u) {
        return u.email === addEmail;
    });
    let newMemeber = {
        userId: memberUser.id, role: addRole
    }
    let currentProject = projects.find(function (p) {
        return p.id === currentProjectId;
    });
    currentProject.member.push(newMemeber);
    localStorage.setItem("projects", JSON.stringify(projects));
    closePopup();

}

function addTask() {
    let addName = taskName.value.trim();
    let addAssignee = taskAssignee.value.trim();
    let addStatus = taskStatus.value.trim();
    let addAsignDate = taskStart.value.trim();
    let addDueDate = taskDeadline.value.trim();
    let addProgress = taskProgress.value.trim();
    let addPriority = taskPriority.value.trim();
    clearAllErrors();
    if (!validate(addName, addAsignDate, addDueDate)) return;
    if (editTaskId === 0) {

        let newTask = {
            id: tasks.length !== 0 ? tasks[tasks.length - 1].id + 1 : 1,
            taskName: addName,
            assigneeId: addAssignee,
            projectId: currentProjectId,
            asignDate: addAsignDate,
            dueDate: addDueDate,
            priority: addPriority,
            progress: addProgress,
            status: addStatus,
        };
        tasks.push(newTask);
    } else {
        let editId = tasks.findIndex(task => task.id === editTaskId);
        tasks[editId].taskName = taskName.value.trim();
        tasks[editId].assigneeId = taskAssignee.value;
        tasks[editId].status = taskStatus.value;
        tasks[editId].asignDate = taskStart.value;
        tasks[editId].dueDate = taskDeadline.value;
        tasks[editId].priority = taskPriority.value;
        tasks[editId].progress = taskProgress.value;
        editTaskId = 0;
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    closePopup();
    renderTable(tasks);
    taskForm.reset();
}


function clearAllErrors() {
    document.querySelectorAll(".add-task-group").forEach(function (group) {
        group.classList.remove("invalid");
        group.querySelector(".error").innerText = "";
    });
}

function clearAllMemberErrors() {
    document.querySelectorAll(".add-member-group").forEach(function (group) {
        group.classList.remove("invalid");
        group.querySelector(".error").innerText = "";
    });
}
function popUpTask() {
    modalHeader.innerHTML = `<p class="modal-title">Thêm nhiệm vụ</p>
                            <p class="x" onclick="closePopup()">✕</p>`;
    clearAllErrors();
    taskSave.innerText = "Lưu";
    editTaskId = 0;
    taskForm.reset();
    modalContainer.classList.add('show');
}
function popUpMember() {

    clearAllMemberErrors();

    addMemberModal.innerHTML = `
<div class="model-add-member">
            <section class="modal-header">
                <p class="modal-title">Thêm thành viên</p>
                <p class="x" onclick="closePopup()">✕</p>
            </section>
            <section class="modal-member-main">
                <form id="member-form" class="member-form">

                    <div class="add-member-group">
                        <label for="member-email-input">Email</label><br>
                        <input type="text" id="member-email-input" name="member-email-input" class="member-email-input" />
                        <div class="error"></div> 
                    </div>

                    <div class="add-member-group">
                        <label for="role-assignee">Vai trò</label><br>
                        <input type="text" id="role-assignee" class="role-assignee" name="role-assignee">
                        <div class="error"></div>
                    </div>
                </form>
            </section>
            <section class="modal-member-footer">
                <button type="button" class="btn-cancel" onclick="closePopup()">Hủy</button>
                <button type="button" class="btn-save" id="btn-save-member" onclick="addMember()">Lưu</button>
            </section>
        </div>
    `
    memberForm = document.getElementById("member-form");
    addMemberModal.classList.add("show");
    memberEmail = document.getElementById("member-email-input");
    memberRole = document.getElementById("role-assignee");
    memberForm.reset();
}

function popUpDelete() {
    modalDeleteContainer.classList.add('show');
}
function changeDate(dated) {
    let date = new Date(dated);
    let day = date.getDate();
    let month = date.getMonth() + 1;

    let dayStr = day < 10 ? "0" + day : day;
    let monthStr = month < 10 ? "0" + month : month;

    return monthStr + " - " + dayStr;
}
let priorityClass = { low: "priority-low", medium: "priority-medium", high: "priority-high" };
let priorityText = { low: "Thấp", medium: "Trung bình", high: "Cao" };
let progressClass = { ontrack: "progress-ontrack", risk: "progress-risk", late: "progress-late" };
let progressText = { ontrack: "Đúng tiến độ", risk: "Có rủi ro", late: "Trễ hạn" };

function renderTable(tasked) {
    taskTbody.innerHTML = "";
    let ownerTask = tasked.filter(function (t) {
        return t.projectId === currentProjectId;
    });

    let statusGroups = ["todo", "inprogress", "pending", "done"];
    let statusLabel = { todo: "To do", inprogress: "In Progress", pending: "Pending", done: "Done" };
    statusGroups.forEach(function (status) {
        let groupTasks = ownerTask.filter(function (t) {
            return t.status === status;
        });

        taskTbody.innerHTML += `
        <tr class="group-row" onclick="toggleGroup('${status}')">
            <td colspan="7"><span class="arrow">▼</span> ${statusLabel[status]}</td>
        </tr>
    `;

        groupTasks.forEach(function (task) {
            taskTbody.innerHTML += `<tr class="task-row">
            <td class="task-name">${task.taskName}</td>
            <td>${task.assigneeId}</td>
             <td><span class="${priorityClass[task.priority]}">${priorityText[task.priority]}</span></td>
            <td class="date-start">${changeDate(task.asignDate)}</td>
           <td class="deadline">${changeDate(task.dueDate)}</td>
             <td><span class="${progressClass[task.progress]}">${progressText[task.progress]}</span></td>
            <td>
             <div class="action-buttons">
                 <button class="btn-edit" onclick="popUpEdit(${task.id})">Sửa</button>
                 <button class="btn-delete" onclick="popUpDelete(${task.id})">Xóa</button>
            </div>
             </td>
        </tr>`;
        });
    });
}
function closePopup() {
    editTaskId = 0;
    clearAllErrors();
    modalContainer.classList.remove('show');
    modalDeleteContainer.classList.remove('show');
    addMemberModal.classList.remove("show");
}
function renderProjectHeader() {
    let currentProject = projects.find(function (p) {
        return p.id === currentProjectId;
    });
    taskTitle.innerHTML = `
    <h1>${currentProject.projectName}</h1>
    <p>${currentProject.description}</p>
    `


}
function popUpEdit(taskId) {
    clearAllErrors();
    modalHeader.innerHTML = `<p class="modal-title">Sửa dự án</p>
                            <p class="x" onclick="closePopup()">✕</p>`;
    let editTask = tasks.find(function (task) {
        return task.id === taskId
    });
    editTaskId = taskId;
    taskName.value = editTask.taskName;
    taskAssignee.value = editTask.assigneeId;
    taskStatus.value = editTask.status;
    taskStart.value = editTask.asignDate;
    taskDeadline.value = editTask.dueDate;
    taskPriority.value = editTask.priority;
    taskProgress.value = editTask.progress;

    taskSave.innerText = "Cập nhật";
    modalContainer.classList.add("show");
}
function popUpDelete(taskId) {
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
                <button type="button" class="btn-delete" onclick="deleteTask(${taskId})">Xóa</button>
            </section>

        </div>`;
    modalDeleteContainer.classList.add("show");
}
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    closePopup();
    renderTable(tasks);
}
renderProjectHeader();
renderTable(tasks);