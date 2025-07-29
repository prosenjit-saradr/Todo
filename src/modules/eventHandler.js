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
    const projectContainer = document.getElementById("project-container");
    const projectList = ProjectListUI(projects);
    projectContainer.appendChild(projectList);

    let todoList = null;
    // if(Storage().isEmpty()){
    //     todoList = TodoListUI();
    // }
    // else{
    //     todoList = TodoListUI(projects[0].todo);
    //     setActiveProjectId(projects[0].id);
    // }

    todoList = TodoListUI(projects[0].todo);
    setActiveProjectId(projects[0].id);

    const todoContainer = document.getElementById("todo-container");
    todoContainer.appendChild(todoList);

    attachListeners();
}

const attachListeners = function(){
    const projectListUI = getProjectListUI();
    projectListUI.addEventListener("click",(evt)=>{
        if(evt.target.className === "btn-delete-project"){
            DeleteProjectHandler(evt);
        }
        else if(evt.target.className === "project-title"){
            ProjectClickHandler(evt);
        }

    });
    
    const todoListUI = getTodoListUI();
    todoListUI.addEventListener("click",(evt)=>{
        if(evt.target.className === "btn-delete-todo"){
            evt.stopPropagation();
            DeleteTodoHandler(evt);
        }else if(evt.target.className==="btn-edit-todo"){
            evt.stopPropagation();
            UpdateTodoHandler(evt);
        }
        else{
            todoClickHandler();
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

const todoClickHandler = function(){
    
}

export const DeleteTodoHandler = function(evt){
    evt.stopPropagation();
    const todoElement = evt.target.closest("li");
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
    const newTodo = Todo(todoData);
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
        const todoData = getTodoData();
        Storage().setTodo(getActiveProjectId(),todoId,todoData);
        updateTodoUI(todoId,todoData);
        editTodoDialog.close();
        editTodoDialog.remove();
    });
}

export const ProjectClickHandler = function(evt){
    evt.stopPropagation();
    const projectElement = evt.target.closest("li");
    setActiveProjectId(projectElement.id);

    const todoListUI = getTodoListUI();
    todoListUI.innerHTML = "";
    todoListUI.appendChild(TodoListUI(getActiveProject().todo))
}

const createProject = function(projectName){
    const newPorject = Project({name: projectName});
    Storage().addProject(newPorject);
    const projectUI = ProjectUI(newPorject);
    addElement(getProjectListUI(),projectUI);

    addListenerByQeurySellector(projectUI,".btn-delete-project","click",DeleteProjectHandler);
    addListenerByID(document,newPorject.id,"click",()=>{
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
        createProject(projectName);
        createProjectDialog.close();
        createProjectDialog.remove();
    });


}

export const DeleteProjectHandler = function(evt){
    evt.stopPropagation();
    const projectElement = evt.target.closest("li");
    Storage().deleteProject(projectElement.id);
    projectElement.remove();
    
    if(projectElement.id === getActiveProjectId()){
        if(!Storage().isEmpty()){
            setActiveProjectId(Storage().getProjects()[0].id);
        }else setActiveProjectId(null);
    }
}
