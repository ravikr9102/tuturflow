import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { ChatInterface } from "./components/ChatInterface";
import { StudyNotes } from "./components/StudyNotes";
import { ProfilePage } from "./pages/ProfilePage";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const [activeTab, setActiveTab] = useState<"call" | "chat">("call");
  const { user } = useAuthContext();

  return (
    <Router>
      <div className="min-h-screen bg-[#F8F9FE]">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-60px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
                    <div className="h-[calc(100vh-180px)] overflow-y-auto">
                      <ChatInterface mode={activeTab} />
                    </div>
                    <div className="h-[calc(100vh-180px)] overflow-y-auto">
                      <StudyNotes />
                    </div>
                  </div>
                </main>
              </>
            }
          />
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
