import '../../App.css';
import React, {useEffect, useState} from "react";
import {getUsers} from "../../comunication/FetchUser";
import { UserModel } from '../../types/models';

/**
 * Users
 * @author Peter Rutschmann
 */
const Users = () => {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getUsers();
                console.log(users);
                setUsers(users);
            } catch (error: any) {
                console.error("Failed to fetch to server:", error.message);
                setErrorMessage(error.message);
            }
        };
        fetchUsers();
    }, []);

    return (
        <>
            <h1>Client list</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.id} {user.firstName} {user.lastName} - {user.email} - {user.password}</li>
                ))}
            </ul>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </>
    );
};

export default Users;