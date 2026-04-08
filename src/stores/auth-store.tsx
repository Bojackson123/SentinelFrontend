import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserProfile } from "@/types/auth";
import type { UserRole } from "@/types/enums";
import * as authApi from "@/api/auth";

const TOKEN_KEY = "sentinel_token";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInternal: boolean;
  isCompanyUser: boolean;
  isHomeowner: boolean;
  roles: UserRole[];
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole,
    companyId?: number,
    customerId?: number
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

function parseJwt(token: string): Record<string, unknown> {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

function extractUserFromToken(token: string): UserProfile {
  const claims = parseJwt(token);

  // ASP.NET Core Identity uses these claim types
  const nameId =
    (claims[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ] as string) ?? (claims["sub"] as string);
  const email =
    (claims[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
    ] as string) ?? (claims["email"] as string);

  // Roles can be a string or array
  const roleClaim =
    claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
    claims["role"];
  const roles: UserRole[] = Array.isArray(roleClaim)
    ? roleClaim
    : roleClaim
      ? [roleClaim as UserRole]
      : [];

  const firstName =
    (claims[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"
    ] as string) ??
    (claims["given_name"] as string) ??
    "";
  const lastName =
    (claims[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"
    ] as string) ??
    (claims["family_name"] as string) ??
    "";

  const companyId = claims["companyId"]
    ? Number(claims["companyId"])
    : null;
  const customerId = claims["customerId"]
    ? Number(claims["customerId"])
    : null;

  return {
    id: nameId ?? "",
    email: email ?? "",
    firstName,
    lastName,
    roles,
    companyId,
    customerId,
  };
}

function isTokenExpired(token: string): boolean {
  try {
    const claims = parseJwt(token);
    const exp = claims["exp"] as number | undefined;
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore token on mount
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored && !isTokenExpired(stored)) {
      setToken(stored);
      setUser(extractUserFromToken(stored));
    } else if (stored) {
      localStorage.removeItem(TOKEN_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token: newToken } = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(extractUserFromToken(newToken));
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      role: UserRole,
      companyId?: number,
      customerId?: number
    ) => {
      await authApi.register({
        email,
        password,
        firstName,
        lastName,
        role,
        companyId,
        customerId,
      });
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const roles = user?.roles ?? [];

  const value = useMemo<AuthState>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      isInternal: roles.some(
        (r) => r === "InternalAdmin" || r === "InternalTech"
      ),
      isCompanyUser: roles.some(
        (r) => r === "CompanyAdmin" || r === "CompanyTech"
      ),
      isHomeowner: roles.includes("HomeownerViewer"),
      roles,
      login,
      register,
      logout,
    }),
    [user, token, isLoading, roles, login, register, logout]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
