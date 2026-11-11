/**
 * Fetch methodes for secret api calls
 * @author Peter Rutschmann
 */

import { EncryptCredentialsModal, MessageResponseModel, NewSecretModel, SecretModel } from "../types/models";
import { handleAxiosRequestErrors } from "../utils/errors";
import { api } from "./axios";

// Post secret to server
export async function postSecret(content: NewSecretModel): Promise<MessageResponseModel> {
    try {
        const { data } = await api.post<MessageResponseModel>("/secrets/", content);
        return data;
    } catch (error) {
       handleAxiosRequestErrors(error);
    }
};

//get all secrets for a user identified by its email
export async function getSecretsforUser(credentials: EncryptCredentialsModal): Promise<SecretModel[]> {
    try {
        const { data } = await api.post<SecretModel[]>("/secrets/byemail", credentials);
        return data;
    } catch (error) {
        handleAxiosRequestErrors(error);
    }
};

export async function deleteSecret(secretId: number): Promise<MessageResponseModel> {
    try {
        const { data } = await api.delete<MessageResponseModel>(`/secrets/${secretId}`);
        return data;
    } catch (error) {
       handleAxiosRequestErrors(error);
    }
};

export async function updateSecret(secretId: number, newContent: NewSecretModel): Promise<MessageResponseModel> {
    try {
        const { data } = await api.put<MessageResponseModel>(`/secrets/${secretId}`, newContent);
        return data;
    } catch (error) {
       handleAxiosRequestErrors(error);
    }
};   const protocol = import.meta.env.VITE_API_PROTOCOL; // "http"
