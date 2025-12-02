import React, {createContext, useState, useContext, useEffect} from "react";
import {onAuthStateChanged, signOut, User} from "firebase/auth";
import {auth} from "@/auth/firebase-config";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";
import { router } from "expo-router";
import { authService } from "@/api/services/auth.service";
import { userService } from "@/api/services/user.service";

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  loginAndCheckProfile: (email: string, password: string) => Promise<{ needsProfile: boolean }>;
  register: (email: string, password: string, username: string, biography: string, location: string, isPrivate: boolean) => Promise<any>;
  completeProfile: (username: string, biography: string, location: string, isPrivate: boolean) => Promise<any>;
  logout: () => Promise<any>;
  loading: boolean;
}

export const UserContext = createContext<UserContextType>({ 
  user: null, 
  login: async (): Promise<undefined> => {}, 
  loginAndCheckProfile: async (): Promise<{ needsProfile: boolean }> => ({ needsProfile: false }),
  register: async (): Promise<undefined> => {}, 
  completeProfile: async (): Promise<undefined> => {},
  logout: async (): Promise<undefined> => {}, 
  loading: true
});

export const UserProvider = ({children}: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      console.log("User state changed:", firebaseUser);
      if (firebaseUser) {
        router.replace("/feed")
      }
      else {
        router.replace("/auth/login")
      }
    });

    return () => unsub();
  }, []);



  async function login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      
      // Récupérer et stocker le token Firebase
      await authService.getAndStoreToken(result.user);
      
    } catch (e) {
      console.log("Erreur login :", e);
      return e;
    }
  }

  async function loginAndCheckProfile(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      
      // Récupérer et stocker le token Firebase
      await authService.getAndStoreToken(result.user);
      
      // Vérifier si le profil existe sur le backend
      try {
        await userService.getMe();
        return { needsProfile: false };
      } catch (profileError: any) {
        // Si erreur 404, le profil n'existe pas
        if (profileError.response?.status === 404) {
          console.log("Profil non trouvé, complétion nécessaire");
          return { needsProfile: true };
        }
        throw profileError;
      }
      
    } catch (e) {
      console.log("Erreur login :", e);
      throw e;
    }
  }

  async function completeProfile(username: string, biography: string, location: string, isPrivate: boolean) {
    try {
      // Créer le profil utilisateur sur le backend social
      await userService.createUser({
        username,
        biography,
        location,
        isPrivate,
      });
      
      console.log("Profil utilisateur créé avec succès");
      
    } catch (e) {
      console.log("Erreur création profil :", e);
      throw e;
    }
  }

  async function register(email: string, password: string, username: string, biography: string, location: string, isPrivate: boolean) {
    try {
      // 1. Créer l'utilisateur dans Firebase
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      
      // 2. Récupérer et stocker le token Firebase
      await authService.getAndStoreToken(result.user);
      
      // 3. Créer le profil utilisateur sur le backend social
      await userService.createUser({
        username,
        biography,
        location,
        isPrivate,
      });
      
      console.log("Utilisateur créé avec succès sur Firebase et le backend");
      
    } catch (e) {
      console.log("Erreur register :", e);
      return e;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setUser(null);
      
      // Supprimer le token stocké
      await authService.clearToken();
      
    } catch (e) {
      console.log("Erreur logout :", e);
      console.log(typeof e);
      return e;
    }
  }


  return (
    <UserContext.Provider value={{ user, login, loginAndCheckProfile, register, completeProfile, logout, loading }}>

    {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
