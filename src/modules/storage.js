import { Todo } from "./todo.js";
import { Project } from "./project.js";

let storageInstance = null;

const defaultTodo = Todo({
    title: "default todo",
    description: "default description",
});

const defaultProject = Project({name:"deafult project"});
defaultProject.addTodo(Todo());
defaultProject.addTodo(Todo());
defaultProject.addTodo(Todo());

const defaultProjectList = [defaultProject];

const cachedProjects = {
    projects: [],
    modified: true,
    setProjects: function(projects){
        this.projects = projects;
        this.modified = true;
    },
}

export const Storage = function(){
    if(storageInstance){
        return storageInstance;
    }

    storageInstance = {

        saveProjects: function(projects=[]){
            const data = serialize(projects);
            localStorage.projects = data;
            cachedProjects.setProjects(projects);
        },

        getProjects: function(){

            /* 
                We need reconstruct the project list because,
                when we get back data from local stroage we only
                get back the properties not the methods, so we 
                need to create the project list again to get all
                the methods attached to each project also on each
                todo object.
            */

            const data = JSON.parse(localStorage.getItem("projects"));
            if(data==null){
                this.saveProjects(defaultProjectList);
                cachedProjects.setProjects(defaultProject);
                return defaultProjectList;
            }

            // if(!cachedProjects.modified) return cachedProjects.projects;

            const projects = reconstructProjects(data);
            return projects;
        },

        deleteTodo: function(projectID,todoID){
            let project = null;
            const projects = Storage().getProjects();
            projects.forEach(prj=>{
                if(projectID === prj.id){
                    project = prj;
                }
            });

            if(project==null) return;
            
            project.todo = project.todo.filter(td=>{
                return td.id !== todoID;
            });

            this.saveProjects(projects);
        },
        
        addTodo: function(projectID, todo){
            let project = null;
            const projects = Storage().getProjects();
            projects.forEach(prj=>{
                if(projectID === prj.id){
                    project = prj;
                }
            });

            if(project==null) return;
            
            project.addTodo(todo);
            this.saveProjects(projects);
        },
        
        addProject: function(project){
            if(!project) return;

            const projects = Storage().getProjects();
            projects.push(project);
            Storage().saveProjects(projects);
        },

        deleteProject: function(projectID){
            let projects = Storage().getProjects();

            projects = projects.filter(pjt=> pjt.id !== projectID);
            Storage().saveProjects(projects);
        },

        isEmpty: function(){
            return Storage().getProjects().length === 0;
        },
    }
    
    return storageInstance;
};

const serialize = function(data){
    return JSON.stringify(data);
}

const reconstructProjects = function(data){
    let projects = [];

    console.log(data);
    for(let projectData of data){
        let project = Project({id: projectData.id, name: projectData.name});

        for(let todoData of projectData.todo){
            const todo = Todo(todoData);
            project.addTodo(todo);
        }

        projects.push(project);
    }
    
    cachedProjects.modified = false;
    return projects;
}
