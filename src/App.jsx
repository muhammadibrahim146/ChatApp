import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Chat from './pages/Chat.jsx';
import Profil from './pages/Profil.jsx';
import Info from './pages/Info.jsx';
import { ToastContainer, toast } from 'react-toastify';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useData } from './context/Chatcontext.jsx';

function App() {
  const navigate = useNavigate();
  const auth = getAuth();

const{loadUserData}=useData()
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
// console.log(userdata)
      if (user) {
        navigate('/chat');
        //console.log(user)
        await loadUserData(user.uid)
        //console.log(useSnap)
        
      } else {
    
        navigate('/');
      }
     
    });
  }, []);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Info />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profil" element={<Profil />} />
      </Routes>
      
    </>
  );
}

export default App;
