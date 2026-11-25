import { useEffect, useState } from "react";
import { postEnable2FA, postVerify2FA } from "../../comunication/FetchUser";
import { TwoFactorAuthenticationEnableResponseModel } from "../../types/models";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import OTPInput from "../../components/OTPInput";

function Enable2FA() {
	const {user, setUser} = useUser();
	const navigate = useNavigate();

	const [secret, setSecret] = useState<string>("");
	const [qrCode, setQrCode] = useState<string>("");
	const [verifyOTP, setVerifyOTP] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");

	async function verifyOTPCode(code: string) {
		try {
			if (await postVerify2FA({ email: user?.email || "", otp: code })) {
				setErrorMessage("Wrong OTP Code!");
			} else {
				setUser(prevValues => ({ ...prevValues!, twoFAEnabled: true }));
				navigate("/");
			}
		} catch (error: any) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
	}

	useEffect(() => {
		async function run() {
			const data: TwoFactorAuthenticationEnableResponseModel = await postEnable2FA();

			setSecret(data.secret);
			setQrCode(data.qrCodeUrl);
		}

		run();
	}, []);

	return (
		<>
			<h1>Setup 2-factor-authentication</h1>
			<br/>
			<span>Use an Authenticator App to scan the QR-Code:</span>
			<br/>
			<img src={`data:image/png;base64, ${qrCode}`} alt="QR-Code"></img>
			<br/>
			<span>Or enter the key: <code>{secret}</code></span>
			<br/>

			<button onClick={() => setVerifyOTP(true)}>Next</button>
			<br/>

			{verifyOTP && 
				<div style={{width: "20%"}}>
					<h3>Please enter your OTP:</h3>
					<OTPInput onComplete={verifyOTPCode}/>
				</div>
			}

			{errorMessage && 
				<span style={{color: "red"}}>{errorMessage}</span>
			}
		</>
	);
}

export default Enable2FA;