import { Todo } from "./todo.js";
import { Project } from "./project.js";
import { Storage } from "./storage.js";
import { ProjectListUI, TodoListUI, TodoUI, ProjectUI, TodoCreateDialog, TodoEditDialog, CreateProjectDialog } from "./ui.js";
import { addElement, removeElement, addListenerByID, addListenerByQeurySellector,
         getActiveProjectId, setActiveProjectId, getActiveProject,
         getProjectListUI,getTodoListUI,
         updateTodoUI
} from "./domAPI.js";




const container = document.getElementById("container");

export const initUI = function(){
    const projects = Storage().getProjects();
    const container = document.getElementById("container");
    const projectList = ProjectListUI(projects);
    container.appendChild(projectList);

    let todoList = null;
    if(Storage().isEmpty()){
        todoList = TodoListUI([]);
    }
    else{
        todoList = TodoListUI(projects[0].todo);
        setActiveProjectId(projects[0].id);
    }
    container.appendChild(todoList);

    attachListeners();
}

const attachListeners = function(){
    const projectListUI = getProjectListUI();
    projectListUI.addEventListener("click",(evt)=>{
        if(evt.target.className === "btn-delete-project"){
            console.log(evt.target);
            DeleteProjectHandler(evt);
        }
        else if(evt.target.className === "project-title"){
            console.log(evt.target);
            ProjectClickHandler(evt);
        }

    });
    
    const todoListUI = getTodoListUI();
    todoListUI.addEventListener("click",(evt)=>{
        if(evt.target.className === "btn-delete-todo"){
            console.log(evt.target);
            evt.stopPropagation();
            DeleteTodoHandler(evt);
        }else if(evt.target.className==="btn-edit-todo"){
            console.log("update todo");
            evt.stopPropagation();
            UpdateTodoHandler(evt);
        }
        else{
            console.log("todo item clicked");
            console.log(evt.target);
        }
    });

    const addTodoButton = document.getElementById("btn-add-todo");
    addTodoButton.addEventListener("click",(evt)=>{
        AddTodoHandler(evt);
    });
    
    const addProjectButton = document.getElementById("btn-add-project");
    addProjectButton.addEventListener("click",(evt)=>{
        AddProjectHandler(evt);
    });
}

export const DeleteTodoHandler = function(evt){
    evt.stopPropagation();
    const todoElement = evt.target.closest("li");
    console.log("delete todo: "+todoElement.id);
    const projects = Storage().getProjects();
    Storage().deleteTodo(getActiveProjectId(),todoElement.id);
    todoElement.remove();
}

const getTodoData = function(){
    const title = document.getElementById("titile").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("due-date").value.toString();
    const priorities = document.querySelectorAll("input[name='priority']");
    
    let priority = undefined;
    for(const rb of priorities){
        if(rb.checked){
            priority = rb.value;
        }
    }
    const completed = document.getElementById("todo-completed").checked;
    
    return {
        title,description,dueDate,priority,completed,
    };
}

const makeTodo = function(todoData){
    console.log("add todo");
    const newTodo = Todo(todoData);
    // const projects = Storage().getProjects();
    Storage().addTodo(getActiveProjectId(),newTodo);
    const todoUI = TodoUI(newTodo);
    getTodoListUI().prepend(todoUI);
    addListenerByQeurySellector(todoUI,".btn-delete-todo","click",DeleteTodoHandler);
}

export const AddTodoHandler = function(evt){
    evt.stopPropagation();
    
    //for testting purposes

    const todoDialog = TodoCreateDialog();
    document.body.appendChild(todoDialog);
    
    const closebutton = document.getElementById("close");
    const createButton = document.getElementById("create-todo");
    closebutton.addEventListener("click",(e)=>{
        e.stopPropagation();
        e.preventDefault();
        todoDialog.close();
        todoDialog.remove();
    });
    
    todoDialog.showModal();

    createButton.addEventListener("click",(evt)=>{
        const todoData = getTodoData();
        console.log(todoData);
        makeTodo(todoData);
        todoDialog.close();
        todoDialog.remove();
    });
    
    return;
}

export const UpdateTodoHandler = function(evt){
    const todoId = evt.target.closest("li").id;
    const todoData = Storage().getTodo(getActiveProjectId(),todoId);
    const editTodoDialog = TodoEditDialog(todoData);
    document.body.appendChild(editTodoDialog);
    editTodoDialog.showModal();

    const discardTodoButton = document.getElementById("btn-discard-update");
    const updateTodoButton = document.getElementById("btn-update-todo");
    discardTodoButton.addEventListener("click",(e)=>{
        e.stopPropagation();
        editTodoDialog.close();
        editTodoDialog.remove();
    });

    updateTodoButton.addEventListener("click",(e)=>{
        console.log("save update");
        const todoData = getTodoData();
        console.log(todoData);
        Storage().setTodo(getActiveProjectId(),todoId,todoData);
        updateTodoUI(todoId,todoData);
        editTodoDialog.close();
        editTodoDialog.remove();
    });
}

export const ProjectClickHandler = function(evt){
    evt.stopPropagation();
    console.log("clicked");
    const projectElement = evt.target.closest("li");
    console.log("set project id : "+projectElement.id);
    setActiveProjectId(projectElement.id);

    const todoListUI = getTodoListUI();
    todoListUI.innerHTML = "";
    todoListUI.appendChild(TodoListUI(getActiveProject().todo))
}

const createProject = function(projectName){
    console.log("add project");
    const newPorject = Project({name: projectName});
    Storage().addProject(newPorject);
    const projectUI = ProjectUI(newPorject);
    addElement(getProjectListUI(),projectUI);
    addListenerByQeurySellector(projectUI,".btn-delete-project","click",DeleteProjectHandler);
    addListenerByID(document,newPorject.id,"click",()=>{
        console.log("clicked delte prject button");
        setActiveProjectId(newPorject.id);
        const todoListUI = getTodoListUI();
        todoListUI.innerHTML = "";
        todoListUI.appendChild(TodoListUI(getActiveProject().todo))
    });
}

export const AddProjectHandler = function(evt){
    evt.stopPropagation();

    const createProjectDialog = CreateProjectDialog();
    
    document.body.appendChild(createProjectDialog);
    createProjectDialog.showModal();
    
    const createProjectButton = document.getElementById("btn-create-project");
    const discardProjectButton = document.getElementById("btn-discard-project");
    
    discardProjectButton.addEventListener("click",(e)=>{
        createProjectDialog.close();
        createProjectDialog.remove();
    });
    
    createProjectButton.addEventListener("click",(e)=>{
        const projectName = document.getElementById("project-name").value;
        console.log("project name: "+projectName);
        createProject(projectName);
        createProjectDialog.close();
        createProjectDialog.remove();
    });


}

export const DeleteProjectHandler = function(evt){
    console.log(evt.target);
    evt.stopPropagation();
    const projectElement = evt.target.closest("li");
    console.log("delete project: "+projectElement.id);
    Storage().deleteProject(projectElement.id);
    projectElement.remove();
    
    // console.log("currnt project Id : "+)
    if(projectElement.id === getActiveProjectId()){
        if(!Storage().isEmpty()){
            setActiveProjectId(Storage().getProjects()[0].id);
        }
    }
}
