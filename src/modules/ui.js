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
            <h3 class="todo-title">${todo.title} (${todo.completed ? "complete" : "incomplete"})</h3>
            <p class="todo-description">${todo.description}</p>
            <div style="display: flex; flex-direction:row; gap: 10px;">
                <p class="due-date">Due on: ${todo.dueDate}</p>
                <p class="priority">Priority: ${todo.priority}</p>
            </div>
            <div>
            <button class="btn-edit-todo">edit</button>
            <button class="btn-delete-todo">delete</button>
            </div>
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

export const TodoCreateDialog = function(){
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start from 0
    const dd = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${yyyy}-${mm}-${dd}`; // Format: YYYY-MM-DD


    const html = `
        <div>
            <fieldset>
            <legend>Todo details</legend>

                <Label for="title">Title<span class="required">*</span></Label>
                <input id="titile" type="text" required placeholder="todo title">

                <Label for="desription">Description</Label>
                <textarea id="description" rows=3 cols=30 placeholder="description"></textarea>

                <Label for="due-date">Due date<span class="required">*</span></Label>
                <input id="due-date" type="date" required value=${formattedDate}>
                
                <label for="priority">Priority<span class="required">*<span></label>
                <div id="priority">
                <input id="low" type="radio" name="priority" value="low" checked>
                <label for="low">Low</label>
                <input id="medium" type="radio" name="priority" value="medium">
                <label for="medium">Medium</label>
                <input id="high" type="radio" name="priority" value="high">
                <label for="high">High</label>
                </div>
                
                <div>
                <label for="completed">Completed</label>
                <input type="checkbox" id="todo-completed">
                </div>

            </fieldset>
            <div>
            <button id="create-todo">Create</button>
            <button id="close">discaard</button>
            </div>
        </div>
    `;

    const todoDialog = document.createElement("dialog");
    todoDialog.innerHTML = html;
    todoDialog.id = "todo-dialog";
    
    return todoDialog;
}

export const TodoEditDialog = function(todoData){
    console.log(todoData.description);
    const html = `
        <div>
            <fieldset>
            <legend>Todo details</legend>

                <Label for="title">Title<span class="required">*</span></Label>
                <input id="titile" type="text" required placeholder="todo title" value=${todoData.title}>

                <Label for="desription">Description</Label>
                <textarea id="description" rows=3 cols=30 placeholder="description">${todoData.description}</textarea>

                <Label for="due-date">Due date<span class="required">*</span></Label>
                <input id="due-date" type="date" required value=${todoData.dueDate}>
                
                <label for="priority">Priority<span class="required">*<span></label>
                <div id="priority">
                <input id="low" type="radio" name="priority" value="low">
                <label for="low">Low</label>
                <input id="medium" type="radio" name="priority" value="medium">
                <label for="medium">Medium</label>
                <input id="high" type="radio" name="priority" value="high">
                <label for="high">High</label>
                </div>
                
                <div>
                <label for="completed">Completed</label>
                <input type="checkbox" id="todo-completed">
                </div>

            </fieldset>
            <div>
            <button id="btn-update-todo">Update</button>
            <button id="btn-discard-update">Discaard</button>
            </div>
        </div>
    `;

    const todoCreateDialog = document.createElement("dialog");
    todoCreateDialog.innerHTML = html;
    todoCreateDialog.id = "todo-dialog";
    
    return todoCreateDialog;
}