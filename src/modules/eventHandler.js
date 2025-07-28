import { Todo } from "./todo.js";
import { Project } from "./project.js";
import { Storage } from "./storage.js";
import { ProjectListUI, TodoListUI, TodoUI, ProjectUI } from "./ui.js";
import { addElement, removeElement, addListenerByID, addListenerByQeurySellector,
         getActiveProjectId, setActiveProjectId, getActiveProject,
         getProjectListUI,
         getTodoListUI,
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
    // addListenerByQeurySellector(document,".btn-delete-todo","click",DeleteTodoHandler);
    // addListenerByQeurySellector(document,".btn-delete-project","click",DeleteProjectHandler);
    // addListenerByID(document,"btn-add-project","click",AddProjectHandler);
    // addListenerByQeurySellector(document,".project-element","click", ProjectClickHandler);

    // const addButton = document.getElementById("add-todo");
    // addButton.addEventListener("click",AddTodoHandler);
    
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
        }else{
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

export const AddTodoHandler = function(evt){
    evt.stopPropagation();
    console.log("add todo");
    const newTodo = Todo({title: "new Todo"});
    const projects = Storage().getProjects();
    Storage().addTodo(getActiveProjectId(),newTodo);
    const todoUI = TodoUI(newTodo);
    getTodoListUI().appendChild(todoUI);
    addListenerByQeurySellector(todoUI,".btn-delete-todo","click",DeleteTodoHandler);
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

export const AddProjectHandler = function(evt){
    evt.stopPropagation();
    console.log("add project");
    const newPorject = Project({name: "new project"});
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
