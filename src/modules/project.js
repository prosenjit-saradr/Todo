
export const Project = function(data){

    const project = {
        id: data.id ? data.id : crypto.randomUUID(),
        name: data.name ? data.name : "defalut project",
        todo: [],

        addTodo: function(todo){
            this.todo.unshift(todo);
        },

        removeTodo: function(todo){
            let isPresent = false;
            this.todo = this.todo.filter(td=>{
                if(td.id === todo.id){
                    isPresent = true;
                    return false;
                }
                return true;
            });
            
            //If the todo is present in the database
            //then delte it.
            //
            if(isPresent){

            }
        },
        
        updateTodo: function(todo,data){
            for(let td of this.todo){
                if(td.id === todo.id){
                    td.update(data);
                    break;
                }
            }
        }
    }

    return project;
}