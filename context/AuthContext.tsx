import React, { createContext, ReactNode, useContext, useState } from 'react';
import * as authService from '../db/auth'; // Assuming your auth functions are here

interface User {
    id: number;
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, pass: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (username: string, pass: string) => {
        try {
            const loggedInUser = await authService.verifyUser(username, pass);
            if (loggedInUser) {
                setUser({ id: loggedInUser.id, username: loggedInUser.username });
            } else {
                throw new Error("Invalid username or password");
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Re-throw error to be caught by the login screen
        }
    };

    const logout = () => {
        setUser(null); 
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};