export const Todo = function(todoData = {}){
    
    const id = todoData.id ? todoData.id : crypto.randomUUID();
    const title = todoData.title ? todoData.title : "default title";
    const description = todoData.description ? todoData.description : "default description";
    const dueDate = todoData.dueDate ? todoData.dueDate : "defult due data";
    const priority = todoData.priority ? todoData.priority : "low";
    const completed = todoData.completed ? todoData.completed : false;
    
    const todo = {id,title,description,dueDate,priority,completed};

    todo.update = function(data){
        for(let [key,val] of Object.entries(data)){
            if(key in todo && (key !== "update" && key != "id")){
                todo[key] = val;
            }
        }
    }
    
    return todo;
}