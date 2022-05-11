import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

import { Link, useNavigate } from 'react-router-dom'
import { FormEvent, useState } from 'react'

import {useAuth} from '../hooks/useAuth'
import { getDatabase, push, ref } from 'firebase/database';


export function NewRoom() {
    
    const {user} = useAuth();

    const [newRoom, setNewRoom] = useState('');

    const history = useNavigate();

    async function handleCreateRoom(e:FormEvent) {
        e.preventDefault();

        if (newRoom.trim() === '') return;
        
        //https://firebase.google.com/docs/database/web/read-and-write
        const db = getDatabase();
        const newRoomKey = push(ref(db, 'rooms'), {
            title: newRoom,
            authorId: user?.id
        }).key;

        history(`/rooms/${newRoomKey}`);



    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas"></img>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>

            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask logo"></img>


                    {user?.name}

                    <h2>Criar uma nova sala</h2>

                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text"
                            placeholder='Nome da sala'
                            onChange={e => setNewRoom(e.target.value)}
                            value={newRoom}
                        />
                        <Button type='submit'>Criar sala</Button>
                    </form>

                    <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
                    
                </div>
            </main>
        </div>
    )
}