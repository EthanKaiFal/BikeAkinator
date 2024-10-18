import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Stats from "./components/stats"
import Bikes from "./components/bikes"
import Profile from "./components/profile"
import NavBar from './components/navbar';

//const client = generateClient<Schema>();

function App() {
  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  // const { user, signOut } = useAuthenticator();

  // useEffect(() => {
  //   client.models.Todo.observeQuery().subscribe({
  //     next: (data) => setTodos([...data.items]),
  //   });
  // }, []);

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }

  // function deleteTodo(id: string) {
  //   client.models.Todo.delete({id})
  // }

  return (
    <div className="bg-zinc-800 flex-col mx-auto max-w-3xl">
        <NavBar />
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
