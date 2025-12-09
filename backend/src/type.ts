export type UserDetail = {
    id?: string;
    username : string;
    email : string;
    password : string;
}

export interface prompt {
    role : "user" | "assistant";
    prompt : string;
    
}