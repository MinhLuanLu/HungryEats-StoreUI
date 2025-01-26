import { createContext, useState } from "react";

export const UserContext = createContext({});

export const UserProvider = ({children}) =>{
    const [public_Email, setPublic_Email] = useState('');
    const [public_Store_name, setPublic_Store_name] = useState('');
    const [public_user_id, setPublic_User_id] = useState('');

    return (
        <UserContext.Provider value={{
            public_Email, setPublic_Email,
            public_Store_name,setPublic_Store_name,
            public_user_id, setPublic_User_id
        }}>
            {children}
        </UserContext.Provider>
    )
}