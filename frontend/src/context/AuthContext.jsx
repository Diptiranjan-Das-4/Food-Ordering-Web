
import {
    createContext,
    useContext,
    useState
} from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "foodie-token";
const USER_KEY = "foodie-user";

function loadUser() {
    try {
        const savedUser =
            localStorage.getItem(USER_KEY);

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    } catch (error) {
        console.error(
            "User loading error:",
            error
        );

        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(loadUser);

    function login(token, userData) {
        localStorage.setItem(
            TOKEN_KEY,
            token
        );

        localStorage.setItem(
            USER_KEY,
            JSON.stringify(userData)
        );

        setUser(userData);
    }

    function logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        setUser(null);
    }

    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    const isLoggedIn = Boolean(user);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                getToken,
                isLoggedIn
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}

