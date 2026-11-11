import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {postUser} from "../../comunication/FetchUser";
import { evaluatePasswordStrength } from '../../utils/password';
import ReCAPTCHA from 'react-google-recaptcha';
import { RegisterUserModel } from '../../types/models';
import { useUser } from '../../context/UserContext';
import PasswordButton from '../../components/PasswordButton';

/**
 * RegisterUser
 * @author Peter Rutschmann
 */
function RegisterUser() {
    const navigate = useNavigate();
    const {setToken, setUser} = useUser();
    
    const initialState: RegisterUserModel = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        captchaToken: "",
    };
    const [credentials, setCredentials] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');

    const passwordsMatch = useMemo(() => credentials.password === credentials.passwordConfirmation, [credentials]);
    const canRegister = useMemo(() => 
        credentials.firstName.replaceAll(" ", "") !== "" &&
        credentials.lastName.replaceAll(" ", "") !== "" &&
        credentials.email.replaceAll(" ", "") !== "" &&
        credentials.password.replaceAll(" ", "") !== "" &&
        credentials.passwordConfirmation.replaceAll(" ", "") !== "" &&
        credentials.captchaToken &&
        passwordsMatch
    , [credentials, passwordsMatch]);
    const passwordStrength = useMemo(() => evaluatePasswordStrength(credentials.password), [credentials]);

    const passwordStrengthLabel = useMemo(() => 
        passwordStrength < 30 ? "schwach" :
        passwordStrength < 60 ? "mittel" :
        passwordStrength < 80 ? "stark" : 
        "sehr stark"
    , [passwordStrength]);
    const passwordStrengthColor = useMemo(() => 
        passwordStrength < 30 ? "#ef4444" :
        passwordStrength < 60 ? "#f59e0b" :
        passwordStrength < 80 ? "#84cc16" : 
        "#22c55e"
    , [passwordStrength]);

    const recaptchaRef = useRef<ReCAPTCHA>(null);

    async function handleSubmit(e: any) {
        e.preventDefault();
        setErrorMessage('');

        //validate
        if(credentials.password !== credentials.passwordConfirmation) {
            console.log("password != passwordConfirmation");
            setErrorMessage('Password and password-confirmation are not equal.');
            return;
        }

        if (passwordStrength < 100) {
            console.log("passwordStrength < 100");
            setErrorMessage("Password is to weak, please use a stronger password!");
            return;
        }

        try {
            const data = await postUser(credentials);
            setToken(`${data.tokenType}${data.accessToken}`);
            setUser({ email: credentials.email, password: credentials.password });
            setCredentials(initialState);
            navigate('/');
        } catch (error: any) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
    };

    function handleRecaptcha(token: string | null) {
        setCredentials(prevValues => ({...prevValues, captchaToken: token || ""}));
    }

    useEffect(() => {
        function refreshCaptcha() {
            if (recaptchaRef.current && credentials.captchaToken) {
                recaptchaRef.current.reset();
                setCredentials(prevValues => ({...prevValues, captchaToken: ""}));
            }
        };
    
        let tokenRefreshTimeout = null;
    
        if (credentials.captchaToken) {
            tokenRefreshTimeout = setTimeout(refreshCaptcha, 20 * 1000); // 20 seconds
        }
    
        return () => {
            if (tokenRefreshTimeout) {
                clearTimeout(tokenRefreshTimeout);
            }
        };
    }, [credentials.captchaToken]);

    return (
        <div>
            <h2>Register user</h2>
            <form onSubmit={handleSubmit}>
                <section>
                <aside>
                    <div>
                        <label>Firstname:</label>
                        <input
                            type="text"
                            value={credentials.firstName}
                            onChange={(e) =>
                                setCredentials(prevValues => ({...prevValues, firstName: e.target.value}))}
                            required
                            placeholder="Please enter your firstname *"
                        />
                    </div>
                    <div>
                        <label>Lastname:</label>
                        <input
                            type="text"
                            value={credentials.lastName}
                            onChange={(e) =>
                                setCredentials(prevValues => ({...prevValues, lastName: e.target.value}))}
                            required
                            placeholder="Please enter your lastname *"
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={credentials.email}
                            onChange={(e) =>
                                setCredentials(prevValues => ({...prevValues, email: e.target.value}))}
                            required
                            placeholder="Please enter your email"
                        />
                    </div>
                </aside>
                    <aside>
                        <div>
                            <label>Password:</label>
                            <PasswordButton 
                                value={credentials.password}
                                setValue={(password) => setCredentials(prevValues => ({...prevValues, password}))}
                            />
                        </div>
                        
                        <div>
                            <div
                                style={{
                                    height: 8,
                                    width: "80%",
                                    background: "#e5e7eb",
                                    borderRadius: 4,
                                    marginTop: 8,
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${passwordStrength}%`,
                                        height: "100%",
                                        background: passwordStrengthColor,
                                        transition: "width 200ms ease",
                                        borderRadius: 4,
                                    }}
                                />
                            </div>

                            <p>
                                {passwordStrengthLabel} - {passwordStrength}/100
                            </p>
                        </div>

                        <div>
                            <label>Password confirmation:</label>
                            <PasswordButton 
                                value={credentials.passwordConfirmation}
                                setValue={(passwordConfirmation) => setCredentials(prevValues => ({...prevValues, passwordConfirmation}))}
                            />
                        </div>

                        {!passwordsMatch && 
                            <div>
                                <span style={{color: "red"}}>Passwords don't match!</span>
                            </div>
                        }

                        <div>
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey='6LcrKQUuAAAAAMv8PjcO9KKDAJ6pt6o9g1WW3bo-'
                                onChange={handleRecaptcha}
                            />
                        </div>
                    </aside>
                </section>
                <button type="submit" disabled={!canRegister}>Register</button>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </form>
        </div>
    );
}

export default RegisterUser;
