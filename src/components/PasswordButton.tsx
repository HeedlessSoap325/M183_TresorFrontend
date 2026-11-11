import showPassword from "../assets/showPassword.svg";
import hidePassword from "../assets/hidePassword.svg";
import { useMemo, useState } from "react";
import "./PasswordButton.css";

function PasswordButton({value, setValue}: {value: string, setValue: (value: string) => void}) {
	const [show, setShow] = useState<boolean>(false);
	const icon = useMemo(() => show ? hidePassword : showPassword, [show]);

	return (
		<div className="password-wrapper">
            <input
                className="password-input"
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                placeholder="Enter a password"
            />

            <img
                className="password-icon"
                src={icon}
                alt="Toggle password visibility"
                onClick={() => setShow(!show)}
            />
        </div>
	);
}

export default PasswordButton;