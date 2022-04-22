import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAdMPs0_abe6Kf0Ev9PP5dz-6wCOLwCYvg",
    authDomain: "final-com-eng-ess.firebaseapp.com",
    projectId: "final-com-eng-ess",
    storageBucket: "final-com-eng-ess.appspot.com",
    messagingSenderId: "360264333442",
    appId: "1:360264333442:web:1c5b367bcb51aa7483dc9b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const booksRef = collection(db, "Todos");

// =======================================================

let infoIsClicked = false;
let addIsClicked = false;
let editIsClicked = false;
const todayTask = document.getElementById("today-task");
const upcoming = document.getElementById("upcoming-todo");
const passed = document.getElementById("passed-todo");
const passedTodoContainer = document.getElementById("passed-todo-container");
const inputForm = document.getElementById("input-form");
const editButton = document.getElementById("edit-todo");
const editForm = document.getElementById("edit-form");

const borderColor = {
    Deadline: "#0b7e1c",
    Exam: "#DA5C53",
    Meeting: "#4AA3BA",
    Activity: "#8D5AB5"
}

// =======================================================

async function getItems() {
    console.log("getItems");

    const items = await getDocs(booksRef);

    todayTask.innerHTML = "";
    upcoming.innerHTML = "";
    passed.innerHTML = "";
    var today = new Date();

    const sortedTodos = sortTodosByDate(items);

    if (items) {
        sortedTodos.map((item) => {
            // console.log(item);
            var itemDate = toDateTime(item.date);
            var todayDate = toDateTime(today.getTime());

            if (!(itemDate > todayDate) && !(itemDate < todayDate)) {
                todayTask.innerHTML += `
                <div class="today-task-info" id="todo-${item.id}">
                    <div class="today-task-header">
                        <h3 style="font-size:30px;">${item.task}</h3>
                        <p id="today-${item.id}-type" class="task-type">${item.type}</p>
                    </div>
                    <div class="today-task-due-date">
                        <p>Due date : ${toWeekday(itemDate) + ' ' + itemDate.getDate() + ' ' + toMonth(itemDate) + ' ' + itemDate.getFullYear()}</p>
                    </div>
                </div>
            `;
                addColorType(`today-${item.id}-type`, item.type)
            }

            if (!(itemDate < todayDate)) {
                upcoming.innerHTML += `
                <div class="upcoming-todo-info" id="upcoming-${item.id}">
                    <div class="upcoming-header">
                        <div class="upcoming-left-header">
                            <h3>${item.task}</h3>
                            <p id="upcoming-${item.id}-type" class="task-type">${item.type}</p>
                        </div>
                        <div class="upcoming-right-header" >
                            <p style="text-decoration:underline;cursor:pointer" style="margin-right:9px;" onclick="showEdit('${item.id}')">edit</p>
                            <p style="text-decoration:underline;cursor:pointer" onclick="deleteTodo('${item.id}')">delete</p>
                            <img class="copy" src="../image/copy.png" alt="copy button" onclick="copyText('${item.task}','${item.type}','${toWeekday(itemDate) + ' ' + itemDate.getDate() + ' ' + toMonth(itemDate) + ' ' + itemDate.getFullYear()}','${item.detail}')" />
                        </div>
                    </div>
                    <div class="upcoming-due-date">
                        <p class="upcoming-task-due-date">Due date : ${toWeekday(itemDate) + ' ' + itemDate.getDate() + ' ' + toMonth(itemDate) + ' ' + itemDate.getFullYear()}</p>
                    </div>
                    <div class="upcoming-detail">
                        <p class="task-detail-title">Detail</p>
                        <p class="task-detail">${item.detail}</p>
                    </div>      
                </div>
                `;
                addColorType(`upcoming-${item.id}-type`, item.type)
            } else {
                passed.innerHTML += `
                <div class="passed-todo-info" id="passed-${item.id}">
                    <div class="passed-header">
                        <div class="passed-left-header">
                            <h3>${item.task}</h3>
                            <p id="passed-${item.id}-type" class="task-type">${item.type}</p>
                        </div>
                        <div class="passed-right-header" >
                            <p style="text-decoration:underline;cursor:pointer" onclick="showEdit('${item.id}')">edit</p>
                            <p style="text-decoration:underline;cursor:pointer" onclick="deleteTodo('${item.id}')">delete</p>
                            <img class="copy" src="../image/copy.png" alt="copy button" onclick="copyText('${item.task}','${item.type}','${toWeekday(itemDate) + ' ' + itemDate.getDate() + ' ' + toMonth(itemDate) + ' ' + itemDate.getFullYear()}','${item.detail}')"/>
                        </div>
                    </div>
                    <div class="passed-due-date">
                        <p style="color:#CB8181" class="passed-task-due-date">Due date : ${toWeekday(itemDate) + ' ' + itemDate.getDate() + ' ' + toMonth(itemDate) + ' ' + itemDate.getFullYear()}</p>
                    </div>
                    <div class="passed-detail">
                        <p class="task-detail-title">Detail</p>
                        <p class="task-detail">${item.detail}</p>
                    </div>      
                </div>
                `;
                addColorType(`passed-${item.id}-type`, item.type)
            }
        });
    }

    if (todayTask.innerHTML == "") {
        todayTask.innerHTML += `
          <div id="no-today-task-info" class="today-task-info">
              <h3>You don’t have task today</h3>
          </div>
          `;
    }

    if (upcoming.innerHTML == "") {
        upcoming.innerHTML += `
          <div id="no-upcoming-todo-info" class="upcoming-todo-info">
              <h3>No up-coming task</h3>
          </div>
          `;
    }


    if (passed.innerHTML == "") {
        passedTodoContainer.style.display = "none";
    } else {
        passedTodoContainer.style.display = "flex";
    }
}

document.addEventListener("DOMContentLoaded", function (event) {
    console.log("showing items from database");
    getItems();
});

async function addTodo() {
    console.log("addItem");

    if (!checkBlank()) {

        const task = document.getElementById("task").value;
        const type = document.querySelector('input[name="type-check"]:checked').value;
        const toDate = new Date(document.getElementById("due-date").value);
        const date = toDate.getTime();
        const detail = document.getElementById("detail").value;

        addDoc(booksRef, {
            task,
            type,
            date,
            detail,
        });
        hideForm();
        redrawDOMadd();
        getItems();
    } else {
        alert('Please fill all information')
    }
}

async function updateTodo(docId) {
    console.log("editItem");

    if (!checkBlank()) {

        const task = document.getElementById("edit-task").value;
        const type = document.querySelector('input[name="edit-type-check"]:checked').value;
        const toDate = new Date(document.getElementById("edit-due-date").value);
        const date = toDate.getTime();
        const detail = document.getElementById("edit-detail").value;

        const docRef = await doc(db, `Todos/${docId}`);
        let docInstance = await getDoc(docRef);
        docInstance = docInstance.data();

        const docData = {
            task,
            type,
            date,
            detail,
        };

        console.log(docData);

        updateDoc(docRef, docData)
            .then(function () {
                console.log("success");
            })
            .catch(function (error) {
                console.log("failed", error);
            });

        getItems();
        hideEdit();
    } else {
        alert('Please fill all information')
    }
}

async function deleteTodo(id) {
    if (confirm('Delete Todo from the Todo List?')) {
        console.log('deleteTodo ' + id);
        const docRef = doc(db, `Todos/${id}`);
        await deleteDoc(docRef);
        getItems();
    }

}

async function clickADD() {
    console.log("clickedADD");

    if (!addIsClicked) {
        hideEdit();
        inputForm.style.display = "flex";
        addIsClicked = true;
    } else {
        inputForm.style.display = "none";
        addIsClicked = false;
    }
}

async function clickINFO() {
    console.log("clickedINFO");
    const groupName = document.getElementById("group-name");
    if (!infoIsClicked) {
        groupName.style.display = "flex";
        infoIsClicked = true;
    } else {
        groupName.style.display = "none";
        infoIsClicked = false;
    }
}

async function showEdit(docId) {
    console.log(docId);
    console.log("clickedEDIT");
    const editingID = document.getElementById("editing-id");

    const docRef = await doc(db, `Todos/${docId}`);
    let docInstance = await getDoc(docRef);
    docInstance = docInstance.data();
    console.log(editingID.innerHTML + " ..  " + docId)
    if (!editIsClicked || (editIsClicked && (editingID.innerHTML != docId))) {
        editingID.innerHTML = docId;
        hideForm();
        editForm.style.display = "flex";
        editIsClicked = true;
        const dateInstance = new Date(docInstance.date);
        const dateString =
            dateInstance.getFullYear() +
            "-" +
            ("0" + (dateInstance.getMonth() + 1)).slice(-2, 3) +
            "-" +
            ("0" + dateInstance.getDate()).slice(-2, 3);
        console.log(dateString);
        document.getElementById("edit-task").value = docInstance.task;
        document.getElementById("edit-due-date").value = dateString;
        document.getElementById("edit-detail").value = docInstance.detail;
        document.getElementById("edit-" + docInstance.type).checked = true;

        editButton.onclick = function () {
            updateTodo(docId);
        };
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        editForm.style.display = "none";
        editIsClicked = false;
    }
}

async function okTodayTask() {
    console.log("clickedOK");
    const todayTask = document.getElementById("today-task-container");
    todayTask.style.display = "none";
    document.getElementById("line-break-today").style.display = "none";
}

async function hideForm() {
    console.log("clickedHIDE");
    const inputForm = document.getElementById("input-form");
    inputForm.style.display = "none";
    addIsClicked = false;
    redrawDOMadd();
}

async function hideEdit() {
    console.log("clickedHIDE");
    const editForm = document.getElementById("edit-form");
    editForm.style.display = "none";
    editIsClicked = false;
    redrawDOMedit();
}

// ###################################

function redrawDOMadd() {
    window.document.dispatchEvent(
        new Event("DOMContentLoaded", {
            bubbles: true,
            cancelable: true,
        })
    );
    document.getElementById("task").value = "";
    document.getElementById("due-date").value = "";
    document.getElementById("detail").value = "";
    document.getElementById("activity-radio").checked = false;
    document.getElementById("Meeting-radio").checked = false;
    document.getElementById("Exam-radio").checked = false;
    document.getElementById("Deadline-radio").checked = false;
}

function redrawDOMedit() {
    window.document.dispatchEvent(
        new Event("DOMContentLoaded", {
            bubbles: true,
            cancelable: true,
        })
    );
    document.getElementById("edit-task").value = "";
    document.getElementById("edit-due-date").value = "";
    document.getElementById("edit-detail").value = "";
    document.getElementById("edit-Activity").checked = false;
    document.getElementById("edit-Meeting").checked = false;
    document.getElementById("edit-Exam").checked = false;
    document.getElementById("edit-Deadline").checked = false;
}

function toDateTime(secs) {
    var t = new Date(1970, 0, 1);
    t.setTime(secs);
    t.setHours(0, 0, 0, 0);
    return t;
}

function toWeekday(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
}

function toMonth(date) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[date.getMonth()];
}

function checkBlank() {
    if (addIsClicked) {
        if (
            document.getElementById("task").value == "" ||
            document.getElementById("due-date").value == "" ||
            (document.getElementById("activity-radio").checked == false &&
                document.getElementById("Meeting-radio").checked == false &&
                document.getElementById("Exam-radio").checked == false &&
                document.getElementById("Deadline-radio").checked == false)
        )
            return true
        else
            return false
    } else if (editIsClicked) {
        if (
            document.getElementById("edit-task").value == "" ||
            document.getElementById("edit-due-date").value == "" ||
            (document.getElementById("edit-Activity").checked == false &&
                document.getElementById("edit-Meeting").checked == false &&
                document.getElementById("edit-Exam").checked == false &&
                document.getElementById("edit-Deadline").checked == false)
        )
            return true
        else
            return false
    }
}

function addColorType(id, type) {
    document.getElementById(id).style.borderColor = borderColor[type];
}

function copyText(task, type, date, detail) {
    console.log("copyText");
    let value = `
    ================== Todo List ==================
    Task : ${task} , ${type}
    Date : ${date}
    Detail : ${detail}

    Have a happy Day :D!! 
    `
    console.log(value)
    // console.log(copy);
    navigator.clipboard.writeText(value)
}

function sortTodosByDate(items) {
    const sortedTodos = [];
    items.docs.map((item) => {
        const objItem = {
            id: item.id,
            task: item.data().task,
            date: item.data().date,
            type: item.data().type,
            detail: item.data().detail
        }
        sortedTodos.push(objItem);
    })
    sortedTodos.sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
    return sortedTodos
}



// =======================================================

window.clickADD = clickADD;
window.showEdit = showEdit;
window.clickINFO = clickINFO;
window.hideForm = hideForm;
window.hideEdit = hideEdit;
window.addTodo = addTodo;
window.updateTodo = updateTodo;
window.deleteTodo = deleteTodo;
window.copyText = copyText;
window.okTodayTask = okTodayTask;