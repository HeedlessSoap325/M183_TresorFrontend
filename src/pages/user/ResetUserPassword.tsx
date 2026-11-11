import { useNavigate, useSearchParams } from 'react-router-dom';
import {useEffect, useMemo, useState} from "react";
import { postResetPassword } from '../../comunication/FetchUser';
import { evaluatePasswordStrength } from '../../utils/password';
import { useUser } from '../../context/UserContext';
import PasswordButton from '../../components/PasswordButton';
import ProgressBar from '../../components/ProgressBar';

function ResetUserPassword() {
	const navigate = useNavigate();
	const { setUser } = useUser();

	const [searchParams] = useSearchParams();
	const [errorMessage, setErrorMessage] = useState("");
	const initialValues = {
		email: "",
		newPassword: "",
		newPasswordConfirmation: "",
		resetToken: "",
	}
	const [resetValues, setResetValues] = useState(initialValues);

	const passwordsMatch = useMemo(() => resetValues.newPassword === resetValues.newPasswordConfirmation, [resetValues]);
	const passwordStrength = useMemo(() => evaluatePasswordStrength(resetValues.newPassword), [resetValues]);

	const canRegister = useMemo(() => 
		resetValues.email.replaceAll(" ", "") !== "" &&
		resetValues.newPassword.replaceAll(" ", "") !== "" &&
		resetValues.newPasswordConfirmation.replaceAll(" ", "") !== "" &&
		resetValues.resetToken &&
		passwordsMatch &&
		passwordStrength === 100
	, [resetValues, passwordsMatch, passwordStrength]);
	
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

	async function handleSubmit(e: any) {
		e.preventDefault();
		console.log(resetValues);
		setErrorMessage("");

		try {
			const data = await postResetPassword(resetValues);
			setErrorMessage(data.message);
			setUser({ email: resetValues.email, password: resetValues.newPassword });
			navigate('/user/login');
		} catch (error: any) {
			console.error('Failed to fetch to server:', error.message);
			setErrorMessage(error.message);
		}
	};

	useEffect(() => {
		const reset_token = searchParams.get("reset_token") || "";
		setResetValues(prevValues => ({...prevValues, resetToken: reset_token}));
	}, [searchParams]);


	return (
		<div>
			<h2>Reset Password</h2>
			<form onSubmit={handleSubmit}>
				<section>
					<aside>
						<div>
							<label>Email:</label>
							<input
								type="email"
								value={resetValues.email}
								onChange={(e) =>
									setResetValues(prevValues => ({...prevValues, email: e.target.value}))}
								required
								placeholder="Please enter your email *"
							/>
						</div>

						<div>
							<label>New password:</label>
							<PasswordButton 
								value={resetValues.newPassword}
								setValue={(newPassword) => setResetValues(prevValues => ({...prevValues, newPassword}))}
							/>
						</div>

						<ProgressBar 
                            percentage={passwordStrength}
                            color={passwordStrengthColor}
                            label={passwordStrengthLabel}
                        />

						<div>
							<label>Confirm new password:</label>
							<PasswordButton 
								value={resetValues.newPasswordConfirmation}
								setValue={(newPasswordConfirmation) => setResetValues(prevValues => ({...prevValues, newPasswordConfirmation}))}
							/>
						</div>

						{!passwordsMatch && 
                            <div>
                                <span style={{color: "red"}}>Passwords don't match!</span>
                            </div>
                        }

						{errorMessage && 
							<div>
								<span style={{color: "red"}}>{errorMessage}</span>
							</div>
						}
					</aside>
				</section>

				{canRegister && 
					<div>
						<span style={{color: "red"}}>Resetting your password WILL DELETE ALL YOUR EXISTING SECRETS!</span>
					</div>
				}
				
				<button type="submit" disabled={!canRegister}>Reset</button>
			</form>
		</div>
	);
}

export default ResetUserPassword;