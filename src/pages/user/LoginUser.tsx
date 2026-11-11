import { useNavigate } from 'react-router-dom';
import {useState} from "react";
import {postForgottenPassword, postUserLogin} from "../../comunication/FetchUser";
import { useUser } from '../../context/UserContext';
import { LoginUserModel } from '../../types/models';
import PasswordButton from '../../components/PasswordButton';

/**
 * LoginUser
 * @author Peter Rutschmann
 */
function LoginUser() {
    const navigate = useNavigate();
    const {setToken, setUser, user} = useUser();

    const [errorMessage, setErrorMessage] = useState('');
    const [loginUser, setLoginUser] = useState<LoginUserModel>({
        email: user?.email || "",
        password: user?.password || "",
    })

    async function handleSubmit(e: any) {
        e.preventDefault();
        setErrorMessage("");

        try {
            const data = await postUserLogin(loginUser);
            setToken(`${data.tokenType}${data.accessToken}`);
            setUser({ email: loginUser.email, password: loginUser.password });
            navigate('/');
        } catch (error: any) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
    };

    async function handleForgottenPassword(e: any) {
        e.preventDefault();
        setErrorMessage("");

        try {
            const data = await postForgottenPassword({ email: loginUser.email });
            setErrorMessage(data.message);
        } catch (error: any) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
    }

    return (
        <div>
            <h2>Login user</h2>
            <form onSubmit={handleSubmit}>
                <section>
                    <aside>
                        <div>
                            <label>Email:</label>
                            <input
                                type="text"
                                value={loginUser.email}
                                onChange={(e) =>
                                    setLoginUser(prevValues => ({...prevValues, email: e.target.value}))}
                                required
                                placeholder="Please enter your email *"
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <PasswordButton 
                                value={loginUser.password}
                                setValue={(password) => setLoginUser(prevValues => ({...prevValues, password}))}
                            />
                        </div>

                        {errorMessage && 
                            <div>
                                <span style={{color: "red"}}>{errorMessage}</span>
                            </div>
                        }
                    </aside>
                </section>
                <button type="submit">Login</button>
                <br/>   
                <button onClick={handleForgottenPassword}>Forgotten Password</button>
            </form>
        </div>
    );
}

export default LoginUser;