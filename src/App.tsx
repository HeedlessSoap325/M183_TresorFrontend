import React, {useEffect, useMemo, useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./App.css";
import './css/mvp.css';
import Home from './pages/Home';
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import Users from './pages/user/Users';
import LoginUser from "./pages/user/LoginUser";
import RegisterUser from "./pages/user/RegisterUser";
import ResetUserPassword from "./pages/user/ResetUserPassword";
import Secrets from "./pages/secret/Secrets";
import NewCredential from "./pages/secret/NewCredential";
import NewCreditCard from "./pages/secret/NewCreditCard";
import NewNote from "./pages/secret/NewNote";
import { useUser } from './context/UserContext';

/**
 * App
 * @author Peter Rutschmann
 */
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home/>}/>
                    <Route path="/user/users" element={<Users />}/>
                    <Route path="/user/login" element={<LoginUser />}/>
                    <Route path="/user/register" element={<RegisterUser />}/>
                    <Route path="/user/reset_password" element={<ResetUserPassword />} />
                    <Route path="/secret/secrets" element={<Secrets />}/>
                    <Route path="/secret/newcredential" element={<NewCredential />}/>
                    <Route path="/secret/newcreditcard" element={<NewCreditCard />}/>
                    <Route path="/secret/newnote" element={<NewNote />}/>
                    <Route path="*" element={<NoPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;