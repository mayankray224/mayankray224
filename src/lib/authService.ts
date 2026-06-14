import { useStore } from "@/store/useStore";

export interface AuthResponse {
  success: boolean;
  error?: string;
}

export interface IAuthService {
  register(name: string, email: string, passwordPlain: string): Promise<AuthResponse>;
  login(email: string, passwordPlain: string): Promise<AuthResponse>;
  isDbAvailable(): Promise<boolean>;
}

class LocalStorageAuthService implements IAuthService {
  async register(name: string, email: string, passwordPlain: string): Promise<AuthResponse> {
    try {
      const res = useStore.getState().registerUserLocal(name, email, passwordPlain);
      return res;
    } catch (e: any) {
      return { success: false, error: e.message || "Registration failed." };
    }
  }

  async login(email: string, passwordPlain: string): Promise<AuthResponse> {
    try {
      // Check Demo Account first
      if (email === "demo@nazaraana.ai" && passwordPlain === "demo123") {
        useStore.getState().loginDemoUser();
        return { success: true };
      }

      const res = useStore.getState().loginUserLocal(email, passwordPlain);
      return res;
    } catch (e: any) {
      return { success: false, error: e.message || "Login failed." };
    }
  }

  async isDbAvailable(): Promise<boolean> {
    // Database is deprecated in MVP, return false to enforce local mode everywhere
    return false;
  }
}

export const authService = new LocalStorageAuthService();
export default authService;
