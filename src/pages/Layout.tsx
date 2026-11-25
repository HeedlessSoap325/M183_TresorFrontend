import { Outlet, Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { postDisable2FA } from "../comunication/FetchUser";

/**
 * Layout
 * @author Peter Rutschmann
 */
const Layout = () => {
    const { user, setUser, logout } = useUser();
    const navigate = useNavigate();

    async function logoutAndRedirect() {
        await logout();
        navigate("/user/login");
    }

    async function disable2FA() {
        if (!user) return;
        await postDisable2FA();
        setUser(prevValues => ({...prevValues!, twoFAEnabled: false}))
    }

    return (
        <>
            <nav>
                <h1>The secret tresor application</h1>
                <p>{!user ? "No user logged in" : "user: " + user.email}</p>
                <ul>
                    <li><span>Secrets</span>
                    <ul>
                        <li><Link to="/secret/secrets">my secrets</Link></li>
                        <li><Link to="/secret/newcredential">new credential</Link></li>
                        <li><Link to="/secret/newcreditcard">new credit-card</Link></li>
                        <li><Link to="/secret/newnote">new note</Link></li>
                    </ul>
                    </li>
                    <li><span>User</span>
                        <ul>
                            <li><Link to="/user/register">register</Link></li>
                            <li><Link to="/user/login">login</Link></li>
                            <li><a onClick={logoutAndRedirect}>logout</a></li>
                            {
                            user && !user.twoFAEnabled &&
                                <li><Link to="/user/enable2fa">Enable 2FA</Link></li>
                            }
                            {
                            user && user.twoFAEnabled &&
                                <li><a onClick={disable2FA}>Disable 2FA</a></li>
                            }
                        </ul>
                    </li>
                    <li><span>Admin</span>
                        <ul>
                            <li><Link to="/user/users">All users</Link></li>
                            <li>Add user</li>
                            <li><Link to="/user/users/:id">Edit user</Link></li>
                            <li>All secrets</li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/">About</Link>
                    </li>
                </ul>
            </nav>
            <hr/>
            <Outlet/>
        </>
    )
};

export default Layout;