import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
// import ProtectedRoute from "./Components/ProtectedRoute";
import CreateEvent from "./pages/CreateEvent";
import Feed from "./pages/feed";
import EventDetail from "./pages/EventDetail";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; // Import v9 functions
import { db } from "./firebase";

export default function App() {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // 1. Get collection reference
        const studentsRef = collection(db, "Students");

        // 2. Fetch documents
        const snapshot = await getDocs(studentsRef);

        // 3. Extract document data along with their IDs
        const studentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <>
      <h1>Students List</h1>
      <ul>
        {students.map((student) => (
          <li key={student.Name}>
            {student.Name} - {student.Age}
          </li>
        ))}
      </ul>

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/feed" element={<Feed />} students={students} />
          <Route path="/event/:id" element={<EventDetail />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/create" element={<CreateEvent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
