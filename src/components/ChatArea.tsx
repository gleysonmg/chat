import { Chat } from "@/types/Chat"
import { ChatPlaceHolder } from "./ChatPlaceHolder";
import { ChatMessageItem } from "./ChatMessageItem";
import { ChatMessageLoading } from "./ChatMessageLoading";

type Props = {
    chat: Chat | undefined;
    loading: boolean;
}

export const ChatArea = ({ chat, loading }: Props) => {
    return (
        <section className="flex-auto h-0 overflow-y-scroll">
            {!chat && <ChatPlaceHolder />}
            {chat && chat.messages.map(item => (
                <ChatMessageItem
                    key={item.id}
                    item={item}
                />
            ))}

            {loading && <ChatMessageLoading />}
        </section>
    );
}