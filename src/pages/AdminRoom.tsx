import { useNavigate, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteIcon from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'

import '../styles/room.scss'

import { useAuth } from '../hooks/useAuth'
import { getDatabase, ref, get, remove, update } from 'firebase/database'
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'




type RoomParams = {
    id: string;
}



export function AdminRoom() {
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const history = useNavigate();

    const db = getDatabase();

    const { user } = useAuth();

    const { questions, title } = useRoom(roomId as string);

    async function handleDeleteQuestion(qId: string) {
        if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
            await remove(ref(db, `rooms/${roomId}/questions/${qId}`));
        }
    }

    async function handleEndRoom() {
        await update(ref(db, `rooms/${roomId}`), {
            closedAt: new Date()
        })

        history('/');
    }

    async function handleCheckQuestionAsAnswered(qId: string) {
        await update(ref(db, `rooms/${roomId}/questions/${qId}`), {
            isAnswered: true
        })
    }

    async function handleHighlightQuestion(qId: string) {
        const currentState = await (await get(ref(db, `rooms/${roomId}/questions/${qId}`))).val().isHighlighted;

        await update(ref(db, `rooms/${roomId}/questions/${qId}`), {
            isHighlighted: !currentState
        });

    }


    return (
        <div id="page-room">
            <header>
                <div className="content">

                    <img src={logoImg} alt="Letmeask" />

                    <div>
                        <RoomCode code={roomId as string} />
                        <Button isOutlined onClick={() => handleEndRoom()}>Encerrar Sala</Button>
                    </div>

                </div>
            </header>

            <main className='content'>
                <div className="room-title">
                    <h1>{title}</h1>

                    {questions.length > 0 && <span>{questions.length} pergunta{questions.length > 1 && <>s</>}</span>}
                </div>

                <div className='questions-being-answered'>


                </div>


                <div className="question-list">
                    {questions.map(question => {
                        



                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type='button'
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida"></img>
                                        </button>

                                        <button
                                            type='button'
                                            onClick={() => handleHighlightQuestion(question.id)}

                                        >
                                            <img src={answerImg} alt="answer icon"></img>
                                        </button>
                                    </>
                                )}


                                <button
                                    type='button'
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteIcon} alt="delete icon"></img>
                                </button>
                            </Question>
                        );
                    })}
                </div>

            </main>
        </div>
    )
}