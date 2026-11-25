import { useRef, useState } from "react";
import "./OTPInput.css";

export default function OTPInput({ length = 6, onComplete }: {length?: number, onComplete: (code: string) => void}) {
	const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
	const inputs = useRef<(HTMLInputElement | null)[]>([]);

	function handleChange(value: string, index: number) {
		const digit = value.replace(/\D/g, "").slice(-1);
		const updated = [...otp];
		updated[index] = digit;

		setOtp(updated);

		if (digit && index < length - 1) {
			inputs.current[index + 1]?.focus();
		}

		if (updated.every((value) => value !== "")) {
			onComplete?.(updated.join(""));
		}
	}

	function handleKeyDown(e: any, index: number) {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
		inputs.current[index - 1]?.focus();
		}

		if (e.key === "ArrowLeft" && index > 0) {
		inputs.current[index - 1]?.focus();
		}

		if (e.key === "ArrowRight" && index < length - 1) {
		inputs.current[index + 1]?.focus();
		}
	}

	function handlePaste(e: any) {
		e.preventDefault();

		const pasted = e.clipboardData
			.getData("text")
			.replace(/\D/g, "")
			.slice(0, length);

		const updated = Array(length).fill("");

		pasted.split("").forEach((digit: string, i: number) => {
			updated[i] = digit;
		});

		setOtp(updated);

		inputs.current[Math.min(pasted.length, length - 1)]?.focus();

		if (updated.every(Boolean)) {
			onComplete?.(updated.join(""));
		}
	};

	return (
		<div className="otp-container">
			<div className="otp-inputs">
				{otp.map((digit, index) => (
					<input
						key={index}
						ref={(el) => {inputs.current[index] = el}}
						type="text"
						inputMode="numeric"
						autoComplete={index === 0 ? "one-time-code" : "off"}
						maxLength={1}
						value={digit}
						onChange={(e) => handleChange(e.target.value, index)}
						onKeyDown={(e) => handleKeyDown(e, index)}
						onPaste={handlePaste}
						aria-label={`OTP digit ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
}
