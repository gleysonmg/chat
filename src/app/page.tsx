'use client';

import { ChatArea } from "@/components/ChatArea";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SideBar } from "@/components/SideBar";
import { SideBarChatButton } from "@/components/SideBarChatButton";
import { Chat } from "@/types/Chat";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const Page = () => {
  const [sideBarOpened, setSideBarOpened] = useState(false);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [chatActiveId, setChatActiveId] = useState<string>('');
  const [chatActive, setChatActive] = useState<Chat>();
  const [migLoading, setMigLoading] = useState(false);

  // Monitora o estado do chatActiveId e chatList
  useEffect(() => {
    setChatActive(chatList.find(item => item.id === chatActiveId));
  }, [chatActiveId, chatList]);

  useEffect(() => {
    if (migLoading) getMigResponse();
  }, [migLoading]);

  const getMigResponse = () => {
    setTimeout(() => {
      let chatListClone = [...chatList];
      let chatIndex = chatListClone.findIndex(item => item.id === chatActiveId);

      if (chatIndex > -1) {
        chatListClone[chatIndex].messages.push({
          id: uuidv4(),
          author: 'mig',
          body: 'Resposta do Mig'
        });
      }
      setChatList(chatListClone);
      setMigLoading(false);
    }, 2000);
  }

  // ***** Para testes
  // const [chatActive, setChatActive] = useState<Chat>({
  //   id: '123',
  //   title: 'Bla BRB',
  //   messages: [
  //     { id: '99', author: 'me', body: 'Ola' },
  //     { id: '100', author: 'mig', body: 'Em que posso te ajudar?' }
  //   ]
  // });

  const openSideBar = () => setSideBarOpened(true);
  const closeSideBar = () => setSideBarOpened(false);

  const clearConversations = () => {
    if (migLoading) return;

    setChatActiveId('');
    setChatList([]);
  }

  const newChat = () => {
    if (migLoading) return;

    setChatActiveId('');
    closeSideBar();
  }

  const sendMessage = (message: string) => {
    if (!chatActiveId) {
      // Cria novo chat
      let newChatId = uuidv4();

      setChatList([{
        id: newChatId,
        title: message,
        messages: [
          { id: uuidv4(), author: 'me', body: message }
        ]
      }, ...chatList]);

      setChatActiveId(newChatId);
    } else {
      // Atualiza um chat existente
      let chatListClone = [...chatList];
      let chatIndex = chatListClone.findIndex(item => item.id === chatActiveId);

      chatListClone[chatIndex].messages.push({
        id: uuidv4(),
        author: 'me',
        body: message
      });

      setChatList(chatListClone);
    }

    setMigLoading(true);
  }

  const handleSelectChat = (id: string) => {
    if (migLoading) return;

    let item = chatList.find(item => item.id === id);
    if (item) setChatActiveId(item.id);
    closeSideBar();
  }

  const handleDeleteChat = (id: string) => {
    let chatListClone = [...chatList];
    let chatIndex = chatListClone.findIndex(item => item.id === id);
    chatListClone.splice(chatIndex, 1);
    setChatList(chatListClone);
    setChatActiveId('');
  }

  const handleEditChat = (id: string, newTitle: string) => {
    if (newTitle) {
      let chatListClone = [...chatList];
      let chatIndex = chatListClone.findIndex(item => item.id === id);
      chatListClone[chatIndex].title = newTitle;
      setChatList(chatListClone);
    }
  }

  return (
    <main className="flex min-h-screen bg-chat-gray">
      <SideBar
        open={sideBarOpened}
        onClose={closeSideBar}
        onClear={clearConversations}
        onNewChat={newChat}
      >
        {chatList.map(item => (
          <SideBarChatButton
            key={item.id}
            chatItem={item}
            active={item.id === chatActiveId}
            onClick={handleSelectChat}
            onDelete={handleDeleteChat}
            onEdit={handleEditChat}
          />
        ))}
      </SideBar>
      <section className="flex flex-col w-full">
        <Header
          openSideBarClick={openSideBar}
          title={chatActive ? chatActive.title : 'Nova conversa'}
          newChatClick={newChat}
        />

        <ChatArea chat={chatActive} loading={migLoading} />

        <Footer
          onSendMessage={sendMessage}
          disabled={migLoading}
        />

      </section>
    </main>

  )
}

export default Page;