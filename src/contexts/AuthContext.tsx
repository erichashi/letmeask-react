import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";


//contextos: forma de compartilhar informação entre cpmponents 

//useEffect: dispara uma funcao sempre que algo acontece
// useEffect( () => {}, [])
// () => {}: qual funcao vai disparar
// []: quando vai disparar. vazia dispara uma unica vez


type AuthContextType = {
    user: UserType | undefined,
    signInWithGoogle: () => Promise<void>;
}
export const AuthContext = createContext({} as AuthContextType); // {} is object


type UserType = {
    id: string,
    name: string,
    avatar: string
}


type AuthContextProviderProps = {
    children: ReactNode
}

export function AuthContextProvider(props: AuthContextProviderProps) {

    //variavel user esta disponivel em todo o website
    const [user, setUser] = useState<UserType>();

    //detectar se o usuario esta logado
    useEffect(() => {
        const auth = getAuth();

        //unsubscribe para o event nao entrar em loop
        const unsubscribe = auth.onAuthStateChanged(user => {
            //funcao detecta se existe usuario logado

            if (user) {
                const { displayName, photoURL, uid } = user;

                if (!displayName || !photoURL) {
                    throw new Error('Missing information from Google Account')
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }
        })

        //ao final, sair do evento
        return () => unsubscribe();
    }, [])


    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();

        try {
            const result = await signInWithPopup(auth, provider);

            //login success 
            if (result.user) {
                const { displayName, photoURL, uid } = result.user;

                if (!displayName || !photoURL) {
                    throw new Error('Missing information from Google Account')
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }
        } catch (error: any) {
            // Handle Errors here.
            console.log(error.code)
            console.log(error.message);
        }
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    )
}