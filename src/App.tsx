
import { Routes, Route } from 'react-router-dom';
import Stats from "./components/stats"
import Bikes from "./components/bikes"
import Profile from "./components/profile"
import Navbar from './components/navbar';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';


//const client = generateClient<Schema>();

function App() {
 
Amplify.configure(outputs);
  return (
    <div className="bg-zinc-800 flex-col mx-auto max-w-3xl">
        <Navbar />
        <main className="px-4">
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/Bikes" element={<Bikes />} />
          <Route path="/Stats" element={<Stats />} />
          {/* <Route path="/login/:profileID" element={<Login />} /> */}
          {/* <Route path="/profile" element ={<Profile />} />
          <Route path="/Groups" element={<Groups />} /> */}
          <Route path="*" element={<Profile />} />
        </Routes>
        </main>
        </div>
  );
}

export default App;
