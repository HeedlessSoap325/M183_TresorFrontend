import { createContext,useContext,useState,type ReactNode,type Dispatch,type SetStateAction, useRef, useEffect } from "react";
import { api, API_URL } from "../comunication/axios";
import axios from "axios";
import { AuthResponseModel } from "../types/models";

interface User {
	email: string;
	password: string;
}

interface UserContextType {
	user: User | null;
	token: string;
	setUser: Dispatch<SetStateAction<User | null>>;
	setToken: Dispatch<SetStateAction<string>>;
	isLoggedIn: () => boolean;
	logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  	children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
	const [user, setUser] = useState<User |  null>(null);
	const [token, setToken] = useState<string>("");

	const tokenRef = useRef(token);

	useEffect(() => {
		tokenRef.current = token;
	}, [token]);

	function logout() {
		setUser(null);
		setToken("");
	}

	useEffect(() => {
		let refreshPromise: Promise<string> | null = null;
	
		// Attach access token to every request.
		const requestInterceptor = api.interceptors.request.use(
			(config) => {
				const token = tokenRef.current;
		
				if (token) {
					config.headers.Authorization = token;
				}
		
				return config;
			}
		);
	
		// Handle expired access tokens.
		const responseInterceptor = api.interceptors.response.use(
		  	(response) => response,
			async (error) => {
				const originalRequest = error.config;
		
				if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
					return Promise.reject(error);
				}
		
				originalRequest._retry = true;
		
				try {
					// Only one refresh request at a time.
					if (!refreshPromise) {
						refreshPromise = axios
						.post(
							`${API_URL}/auth/refresh`,
							{},
							{ withCredentials: true }
						)
						.then((response) => {
							const data: AuthResponseModel = response.data;
							const newToken = `${data.tokenType}${data.accessToken}`;
			
							tokenRef.current = newToken;
							setToken(newToken);
			
							return newToken;
						})
						.finally(() => {
							refreshPromise = null;
						});
					}
			
					const newToken = await refreshPromise;
			
					originalRequest.headers.Authorization = newToken;
			
					// Retry original request.
					return api(originalRequest);
				} catch (refreshError) {
					logout();
					return Promise.reject(refreshError);
				}
			}
		);
	
		// Clean up interceptors.
		return () => {
			api.interceptors.request.eject(requestInterceptor);
			api.interceptors.response.eject(responseInterceptor);
		};
	}, []);

	const value: UserContextType = {
		user,
		token,
		setUser,
		setToken,
		isLoggedIn: () => user !== null && token.trim() !== "",
		logout,
	};

	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser(): UserContextType {
	const context = useContext(UserContext);

	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}

	return context;
}
