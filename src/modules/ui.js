/*
    This module will make the dom element
    for project list and todo list, the 
    functionaliy to add project and todo
    in the list in this dom elment is in 
    the domAPI module.
*/

export const TodoListUI = function(todos){

    const todoList = document.createElement("ul");
    todoList.classList.add("todo-list");
    
    for(const todo of todos){
        const todoElement = TodoUI(todo);
        todoList.appendChild(todoElement);
    }
    
    return todoList;
}

export const TodoUI = function(todo){
    const html = `
        <div class="todo-item">
            <h3>${todo.title}</h3>
            <span>${todo.description}</span>
            <button class="btn-delete-todo">delete</button>
        </div>
    `
    const todoElement = document.createElement("li");
    todoElement.id = todo.id;
    todoElement.innerHTML = html;
    
    return todoElement;
}

export const ProjectListUI = function(projects){

    const projectList = document.createElement("ul");
    projectList.classList.add("project-list");
    
    for(const project of projects){
        const projectElement = ProjectUI(project);
        projectList.appendChild(projectElement);
    }
    
    return projectList;
}

export const ProjectUI = function(project){
    const html = `
        <div class="project-element">
            <span class="project-title">${project.name}</span>
            <button class="btn-delete-project">delete</button>
        </div> 
    `
    
    const projectElement = document.createElement("li");
    projectElement.id = project.id;
    projectElement.innerHTML = html;

    return projectElement;
}