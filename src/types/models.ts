export interface RegisterUserModel {
	firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    captchaToken: string;
}

export interface AuthResponseModel {
	tokenType: string;
	accessToken: string;
}

export interface UserModel {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	salt: string;
	authorities: string[];
}

export interface LoginUserModel {
	email: string;
	password: string;
}

export interface EmailAddressModel {
	email: string;
}

export interface ResetPasswordModel {
	email: string;
	newPassword: string;
	newPasswordConfirmation: string;
	resetToken: string;
}

export interface MessageResponseModel {
	message: string;
}

export interface NewSecretModel {
	email: string;
	content: Object;
	encryptPassword: string;
}

export interface SecretModel {
	id: number;
	userId: number;
	content: string;
}

export interface EncryptCredentialsModal {
	userId?: number
	email?: string;
	encryptPassword: string;
}

export interface ErrorResponseModel {
	message: string;
	status: number;
	timestamp: string;
}