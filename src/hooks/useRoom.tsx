import { getDatabase, onValue, ref, off } from "firebase/database";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

type QuestionType = {
    id: string,
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likeCount: number,
    likeId: string | undefined
}

type FirebaseQuestion = Record<string, {
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likes: Record<string, {
        authorId: string
    }>
}>

export function useRoom(roomId: string){
    const { user } = useAuth()

    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

    //fetch questions
    useEffect(() => {

        const db = getDatabase();
        const roomIdRef = ref(db, `rooms/${roomId}`);
        onValue(roomIdRef, retrievedRoom => {

            //firebaseRoom eh um object 
            const firebaseRoom = retrievedRoom.val();

            //set titulo da sala
            setTitle(firebaseRoom.title);

            const firebaseQuestions: FirebaseQuestion = firebaseRoom.questions ?? {};
            // {
            //     "nh9oikjhgfri": {
            //         author: {
            //             ...
            //         },
            //         content: 'ddd'
            //         ...
            //     },

            //      "kjhy90it5r": {
            //          ...
            //     }
            // }

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    author: value.author,
                    content: value.content,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find( ([key, like]) => like.authorId === user?.id)?.[0]
                }
            })

            setQuestions(parsedQuestions);

        });

        //detach listeners
        return () => {
            off(roomIdRef);
        }

        //essa function depende de user para funcionar integralmente (line 73). por isso deve se passar tambem
    }, [roomId, user?.id]); //quando roomId mudar, executa de novo


    return { questions, title }


}