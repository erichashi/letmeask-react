import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

import { useNavigate } from 'react-router-dom'

import { FormEvent } from 'react'

//https://firebase.google.com/docs/auth/web/google-signin

// import { AuthContext } from '../contexts/AuthContext'
// import { useContext } from 'react'
//ao inves de declaras os dois acima, foi feita uma funcao em src/hooks para declarar apenas uma funcao, useAuth()
import {useAuth} from '../hooks/useAuth'
import { useState } from 'react';
import { getDatabase, get, ref } from 'firebase/database';


export function Home() {
    const history = useNavigate();
    // const {user, signInWithGoogle} = useContext(AuthContext);
    const {user, signInWithGoogle} = useAuth();

    const [roomCode, setRoomCode] = useState('');


    async function handleCreateNewRoom() {
        if(!user) await signInWithGoogle();
        history('/rooms/new');
    }

    async function handleJoinRoom(event:FormEvent){
        event.preventDefault();

        if(roomCode.trim() === '') return;

        const db = getDatabase();
        const roomDb = await get(ref(db, `rooms/${roomCode}`));

        if(!roomDb.exists()) {
            alert("Room does not exist.");
            return;
        }

        if (roomDb.val().closedAt) {
            alert("Room already closed.");
            return;
        }

        
        history(`rooms/${roomCode}`);

    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas"></img>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>

            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask logo"></img>

                    <button onClick={handleCreateNewRoom} className="create-room">
                        <img src={googleIconImg} alt="Google logo"></img>
                        Crie sua sala com o Google
                    </button>

                    <div className="separator">ou entre em uma sala</div>

                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder='Digite o código da sala'
                            onChange={e => setRoomCode(e.target.value)}
                        />
                        <Button type='submit'>Entrar na sala</Button>
                    </form>

                </div>
            </main>
        </div>
    )
}