// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvPzj3qFJXn5_C0JMk8hQwAsm09MrNLrY",
  authDomain: "com-eng-ess-final-projec-51f18.firebaseapp.com",
  projectId: "com-eng-ess-final-projec-51f18",
  storageBucket: "com-eng-ess-final-projec-51f18.appspot.com",
  messagingSenderId: "955698469638",
  appId: "1:955698469638:web:4c8a66c90899b8cf00dc87",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// =======================================================
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const db = getFirestore();
const booksRef = collection(db, "tasks");
var infoIsClicked = false;
var addIsClicked = false;
var editIsClicked = false;

async function getItems() {
  console.log("getItems");

  const items = await getDocs(booksRef);
  const todayTask = document.getElementById("today-task");
  const upcoming = document.getElementById("upcoming-todo");
  const passed = document.getElementById("passed-todo");
  todayTask.innerHTML = "";
  upcoming.innerHTML = "";
  passed.innerHTML = "";
  var today = new Date();

  if (items) {

    items.docs.map((item) => {

      var itemDate = toDateTime(item.data().date);
      var todayDate = toDateTime(today.getTime());

      if (!(itemDate > todayDate) && !(itemDate < todayDate)) {
        todayTask.innerHTML += `
            <div id="${item.id}" class="today-task-info">
                <div class="today-task-header">
                    <h3>${item.data().task}</h3>
                    <label class = "task-type">${item.data().type}</label>
                </div>
                <div class="today-task-due-date">
                    <label for="due-date">Due date:</label>
                    <label class = "today-task-due-date">${toWeekday(itemDate)+' '+itemDate.getDate()+' '+toMonth(itemDate)+' '+itemDate.getFullYear()}</label>
                </div>
            </div>
            `;
        `
                <div id="${item.id}" class="today-task-info">
                    <h3>${item.data().task}</h3>
                    <label class = "task-type" >${item.data().type}</label>
                    <label class = "today-task-due-date">${new Date(
                      item.data().date
                    ).toLocaleDateString()}</label>
                    <label>${item.data().detail}</label>
                </div>
                `;
      }

      if (!(itemDate < todayDate)) {
        upcoming.innerHTML += `
            <div id="${item.id}" class="upcoming-todo-info">
                <div class="upcoming-header">
                    <div class="upcoming-left-header">
                        <h3>${item.data().task}</h3>
                        <label class = "task-type">${item.data().type}</label>
                    </div>
                    <div class="upcoming-right-header">
                        <p id="edit-button" onclick="clickEDIT('${item.id}');">edit</p>
                        <p id="delete-button" onclick="deleteTodo('${item.id}');">Delete</p>
                        <div class="copy">
                            <img class="copy" src="../image/copy.png" onclick="copyTodo('${item.id}')" />
                        </div>
                    </div>
                </div>
                <div class="upcoming-task-due-date">
                    <label for="due-date">Due date:</label>
                    <label class = "upcoming-task-due-date">${toWeekday(itemDate)+' '+itemDate.getDate()+' '+toMonth(itemDate)+' '+itemDate.getFullYear()}</label>
                </div>
                <div class="upcoming-detail">
                    <label class="task-detail-title">Detail</label>
                    <label class="task-detail">${item.data().detail}</label>
                </div>
            </div>
                `;
      } else {
        passed.innerHTML += `
            <div id="${item.id}" class="passed-todo-info">
                <div class="passed-header">
                    <div class="passed-left-header">
                        <h3>${item.data().task}</h3>
                        <label class = "task-type">${item.data().type}</label>
                    </div>
                    <div class="passed-right-header">
                        <p id="edit-button" onclick="clickEDIT('${item.id}');">edit</p>
                        <p id="delete-button" onclick="deleteTodo('${item.id}');">Delete</p>
                        <div class="copy">
                            <img class="copy" src="../image/copy.png" onclick="copyTodo('${item.id}')" />
                        </div>
                    </div>
                </div>
                <div class="passed-task-due-date">
                    <label for="due-date">Due date:</label>
                    <label class = "passed-task-due-date">${toWeekday(itemDate)+' '+itemDate.getDate()+' '+toMonth(itemDate)+' '+itemDate.getFullYear()}</label>
                </div>
                <div class="passed-detail">
                    <label class="task-detail-title">Detail</label>
                    <label class="task-detail">${item.data().detail}</label>
                </div>
            </div>
            `;
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

  const passedTodoContainer = document.getElementById("passed-todo-container");
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

  if(!checkBlank()){

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
    
      redrawDOMadd();
      getItems();
  } else{
    alert('Please fill all information')
  }
}

async function editTodo(docId) {
  console.log("editItem");

  if(!checkBlank()){
    
    const task = document.getElementById("edit-task").value;
    const type = document.querySelector('input[name="edit-type-check"]:checked').value;
    const toDate = new Date(document.getElementById("edit-due-date").value);
    const date = toDate.getTime();
    const detail = document.getElementById("edit-detail").value;

    const docRef = await doc(db, `tasks/${docId}`);
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
  }else{
      alert('Please fill all information')
  }
}

function copyTodo(id){
    console.log('copy!')
    navigator.clipboard.writeText(document.getElementById(id).innerText)
    .then(function(){
        console.log('text has been copied!')
    })
}

async function clickADD() {
  console.log("clickedADD");
  const inputForm = document.getElementById("input-form");
  if (!addIsClicked) {
    hideEdit();
    inputForm.style.display = "flex";
    addIsClicked = true;
  } else {
    inputForm.style.display = "none";
    addIsClicked = false;
  }
}

async function clickEDIT(docId) {
  const editButton = document.getElementById("edit-todo");
  console.log("clickedEDIT");

  const editForm = document.getElementById("edit-form");
  const docRef = await doc(db, `tasks/${docId}`);
  let docInstance = await getDoc(docRef);
  docInstance = docInstance.data();

  if (!editIsClicked) {
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
      editTodo(docId);
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    editForm.style.display = "none";
    editIsClicked = false;
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

async function okTodayTask() {
  console.log("clickedOK");
  const todayTask = document.getElementById("today-task-container");
  todayTask.style.display = "none";
}

async function deleteTodo(docId) {
  console.log("clickedDelete");
  console.log(docId);
  alert("Are you sure to delete this task !");
  const docRef = doc(db, `tasks/${docId}`);
  await deleteDoc(docRef);
  getItems();
}

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

function toWeekday(date){
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
}

function toMonth(date){
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[date.getMonth()];
}

function checkBlank(){
    if(addIsClicked){
        if(
            document.getElementById("task").value == "" ||
            document.getElementById("due-date").value == "" ||
            document.getElementById("detail").value == "" ||
            (document.getElementById("activity-radio").checked == false &&
            document.getElementById("Meeting-radio").checked == false &&
            document.getElementById("Exam-radio").checked == false &&
            document.getElementById("Deadline-radio").checked == false)
        )
        return true
        else
        return false
    }else if(editIsClicked){
        if(
            document.getElementById("edit-task").value == "" ||
            document.getElementById("edit-due-date").value == "" ||
            document.getElementById("edit-detail").value == "" ||
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

window.clickADD = clickADD;
window.clickEDIT = clickEDIT;
window.clickINFO = clickINFO;
window.hideForm = hideForm;
window.hideEdit = hideEdit;
window.addTodo = addTodo;
window.editTodo = editTodo;
window.deleteTodo = deleteTodo;
window.copyTodo = copyTodo;
window.okTodayTask = okTodayTask;

