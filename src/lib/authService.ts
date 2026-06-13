import { checkDatabaseHealth, registerUser } from "@/app/actions";
import { signIn } from "next-auth/react";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  language?: string;
  comfortSubject?: string;
  examDate?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  fallbackToDemo?: boolean;
}

export interface IAuthService {
  register(name: string, email: string, password: string): Promise<AuthResponse>;
  login(email: string, password: string): Promise<AuthResponse>;
}

export class LocalStorageAuthProvider implements IAuthService {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    if (typeof window === "undefined") return { success: false, error: "Not in browser environment" };

    try {
      const usersStr = localStorage.getItem("nazaraana_users") || "[]";
      const users: User[] = JSON.parse(usersStr);

      const existing = users.find((u) => u.email === email);
      if (existing) {
        return { success: false, error: "An account already exists with this email." };
      }

      // Hash password using bcryptjs
      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser: User = {
        id: "local-" + Math.random().toString(36).substring(2, 9),
        name,
        email,
        password: hashedPassword,
        language: "English",
      };

      users.push(newUser);
      localStorage.setItem("nazaraana_users", JSON.stringify(users));

      // Set session
      localStorage.setItem("nazaraana_session", JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to register locally." };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    if (typeof window === "undefined") return { success: false, error: "Not in browser environment" };

    // Check Demo Mode credentials first
    if (email === "demo@nazaraana.ai" && password === "demo123") {
      const demoUser: User = {
        id: "demo-user",
        name: "Demo User",
        email: "demo@nazaraana.ai",
        language: "Hinglish",
      };
      localStorage.setItem("nazaraana_session", JSON.stringify(demoUser));
      return { success: true, user: demoUser };
    }

    try {
      const usersStr = localStorage.getItem("nazaraana_users") || "[]";
      const users: User[] = JSON.parse(usersStr);

      const user = users.find((u) => u.email === email);
      if (!user || !user.password) {
        return { success: false, error: "No student account found with this email." };
      }

      // Verify bcrypt password
      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
        return { success: false, error: "Invalid password. Please check your credentials." };
      }

      localStorage.setItem("nazaraana_session", JSON.stringify(user));
      return { success: true, user };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to login locally." };
    }
  }
}

export class DatabaseAuthProvider implements IAuthService {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await registerUser({
        name,
        email,
        password,
        confirmPassword: password,
      });
      if (res.success) {
        return { success: true };
      }
      return { success: false, error: "Registration failed." };
    } catch (err: any) {
      throw err; // Let manager handle fallback
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        return { success: false, error: res.error };
      }
      return { success: true };
    } catch (err: any) {
      throw err; // Let manager handle fallback
    }
  }
}

class AuthService implements IAuthService {
  private localProvider = new LocalStorageAuthProvider();
  private dbProvider = new DatabaseAuthProvider();

  async isDbAvailable(): Promise<boolean> {
    try {
      return await checkDatabaseHealth();
    } catch (e) {
      return false;
    }
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const dbOk = await this.isDbAvailable();
    if (dbOk) {
      try {
        const res = await this.dbProvider.register(name, email, password);
        if (res.success) {
          // Also sync to local storage
          await this.localProvider.register(name, email, password);
          return res;
        }
        return res;
      } catch (e) {
        console.warn("Database registration failed, falling back to LocalStorageAuthProvider", e);
        const localRes = await this.localProvider.register(name, email, password);
        return {
          ...localRes,
          fallbackToDemo: true,
          error: "Unable to connect to the server. Switching to Demo Mode.",
        };
      }
    } else {
      const localRes = await this.localProvider.register(name, email, password);
      return {
        ...localRes,
        fallbackToDemo: true,
        error: "Unable to connect to the server. Switching to Demo Mode.",
      };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Demo quick login bypass
    if (email === "demo@nazaraana.ai" && password === "demo123") {
      const res = await this.localProvider.login(email, password);
      return res;
    }

    const dbOk = await this.isDbAvailable();
    if (dbOk) {
      try {
        const res = await this.dbProvider.login(email, password);
        if (res.success) {
          // Sync database user session to local storage for offline continuity
          const dbUserSession: User = {
            id: "db-user",
            name: "Registered User",
            email: email,
            language: "English"
          };
          localStorage.setItem("nazaraana_session", JSON.stringify(dbUserSession));
          return res;
        }
        // If login failed due to password / user not found in DB, check local storage
        const localRes = await this.localProvider.login(email, password);
        return localRes;
      } catch (e) {
        console.warn("Database login failed, falling back to LocalStorageAuthProvider", e);
        const localRes = await this.localProvider.login(email, password);
        return {
          ...localRes,
          fallbackToDemo: true,
          error: "Unable to connect to the server. Switching to Demo Mode.",
        };
      }
    } else {
      const localRes = await this.localProvider.login(email, password);
      return {
        ...localRes,
        fallbackToDemo: true,
        error: "Unable to connect to the server. Switching to Demo Mode.",
      };
    }
  }
}

export const authService = new AuthService();
