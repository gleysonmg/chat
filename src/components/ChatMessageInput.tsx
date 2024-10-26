import IconSend from "@/icons/IconSend";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

type Props = {
    disabled: boolean;
    onSend: (message: string) => void;
}

export const ChatMessageInput = ({ disabled, onSend }: Props) => {

    const [text, setText] = useState('');
    const textElement = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textElement.current) {
            textElement.current.style.height = '0px';
            let scrollHeight = textElement.current.scrollHeight;
            textElement.current.style.height = scrollHeight + 'px';
        }
    }, [text, textElement]);

    const handleTextKeyUp = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.code.toLowerCase() === 'enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }

    const sendMessage = () => {
        if (!disabled && text.trim() !== '') {
            onSend(text);
            setText('');
        }
    }

    return (
        <div className={`flex border border-gray-800/50 bg-chat-lightgray p-2 rounded-md
            ${disabled && 'opacity-50'}`}>

            <textarea
                ref={textElement}
                className="flex-1 border-0 bg-transparent resize-none outline-none
                h-7 max-h-48 overflow-y-auto"
                placeholder="Digite uma mensagem"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyUp={handleTextKeyUp}
                disabled={disabled}
            ></textarea>
            <div onClick={sendMessage} className={`self-end p-1 cursor-pointer rounded
                ${text.length ? 'opacity-100 hover:bg-black/20' : 'opacity-20'}`}>
                <IconSend width={14} height={14} />
            </div>
        </div>
    );
}