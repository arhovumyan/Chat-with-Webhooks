import { useChatStore } from "../store/useChatStore.js"
import Sidebar from "../Components/Sidebar.jsx"
import NoChatSelected from "../Components/NoChatSelected.jsx"
import ChatContainer from "../Components/ChatContainer.jsx"

const HomePage = () => {
  const { selectedUser } = useChatStore()
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)] flex flex-col md:flex-row">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}

          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
