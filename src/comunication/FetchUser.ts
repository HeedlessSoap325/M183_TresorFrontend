/**
 * Fetch methodes for user api calls
 * @author Peter Rutschmann
 */

import { RegisterUserModel, AuthResponseModel, UserModel, LoginUserModel, EmailAddressModel, ResetPasswordModel, MessageResponseModel } from "../types/models";
import { api } from "./axios";
import { handleAxiosRequestErrors } from "../utils/errors";

export async function getUsers(): Promise<UserModel[]> {
    try {
        const { data } = await api.get<UserModel[]>('/users');
        return data;
    } catch (error) {
        handleAxiosRequestErrors(error);
    }
}

export async function postUser(registerUser: RegisterUserModel): Promise<AuthResponseModel> {
    try {
        const { data }= await api.post<AuthResponseModel>("/auth/register", registerUser);
        return data;
    } catch (error) {
        handleAxiosRequestErrors(error);
    }
};

export async function postUserLogin(loginUser: LoginUserModel): Promise<AuthResponseModel> {
    try {
        const { data } = await api.post<AuthResponseModel>("/auth/login", loginUser);
        return data;
    } catch (error) {
        handleAxiosRequestErrors(error);
    }
};

export async function postForgottenPassword(emailAddress: EmailAddressModel): Promise<MessageResponseModel> {
    try {
        const { data } = await api.post<MessageResponseModel>("/auth/forgottenpassword", emailAddress);
        return data;
    } catch (error) {
        handleAxiosRequestErrors(error);
    }
}

export async function postResetPassword(resetPassword: ResetPasswordModel): Promise<MessageResponseModel> {
    try {
        const { data } = await api.post<MessageResponseModel>("/auth/resetpassword", resetPassword);
        return data;
    } catch (error) {
       handleAxiosRequestErrors(error);
    }
}

export async function checkAccessToken(): Promise<boolean> {
    try {
        const response = await api.post<any>("/auth/check");
        return response.status === 200;
    } catch (error) { // error means response code wasn't ok
        return false;
    }
}