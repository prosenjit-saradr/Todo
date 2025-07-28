/*
    This moudle provide some methods to manipulate
    project list and todo list dom element, the actual
    elements are defined in ui.js.
*/

import { Storage } from "./storage.js";

export const addElement = function(parent,child){
    if(parent && child){
        parent.appendChild(child);
    }
}

export const updateElement = function(parent,oldChild,newChild){
    if(parent && oldChild && newChild){
        parent.replaceChild(oldChild,newChild);
    }
}

export const removeElement = function(child){
    if(child){
        child.remove();
    }
}

export const addListenerByID = function(parent=document, id="", method="click", callback){
    if(id === "") return;
    let node = parent.getElementById(id);
    if(!node) return;

    node.addEventListener(method,callback);
}

export const addListenerByQeurySellector = 
function(parent=document, querySelector="", method="click", callback){
    if(querySelector === "") return;
    let nodes = parent.querySelectorAll(querySelector);
    if(!nodes) return;

    for(let node of nodes){
        node.addEventListener(method,callback);
    }
}

let activeProjectId = null;

export const getActiveProjectId = function(){
    const projects = Storage().getProjects();
    if(projects.length === 0){
        return null;
    }else if(activeProjectId === null){
        setActiveProjectId(projects[0].id);
        return projects[0].id;
    }
    return activeProjectId;
}

export const setActiveProjectId = function(projectId){
    if(activeProjectId){
        //get the current active project and inactive it
        const curProjectUI = document.getElementById(activeProjectId);
        if(curProjectUI) curProjectUI.classList.remove("active");
    }
    
    //set the project argument as current active project
    activeProjectId = projectId;
    console.log("setting project id: "+activeProjectId)
    const activeProjectUI = document.getElementById(activeProjectId);
    if(activeProjectUI){
        activeProjectUI.classList.add("active");
        activeProjectUI.getElementsByClassName("project-title")[0].click();
    } 
}

export const getProjectListUI = function(){
    const projectList = document.getElementsByClassName("project-list")[0];
    return projectList;
}

export const getTodoListUI = function(){
    const todoList = document.getElementsByClassName("todo-list")[0];
    return todoList;
}

export const getActiveProject = function(){
    console.log("currng active project id: "+getActiveProjectId())
    const projects = Storage().getProjects();
    let project = null;
    const curProjectID = getActiveProjectId();
    for(let prj of projects){
        if(prj.id === curProjectID){
            return prj;
        }
    }
    console.log("couldn't fine active project");
}