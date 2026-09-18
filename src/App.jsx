import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
// import ProtectedRoute from "./Components/ProtectedRoute";
import CreateEvent from "./pages/CreateEvent";
import Feed from "./pages/feed";
import EventDetail from "./pages/EventDetail";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore"; // Import v9 functions
import { db } from "./firebase";
import Navbar from "./Components/NavBar";
import getSampleEvents from "./data/sampleData";
import Profile from "./pages/Profile";

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

  const addSampleEvents = async () => {
    try {
      const events = getSampleEvents();
      console.log("Adding sample events to Firestore...", events);
      await Promise.all(
        events.map(async (event) => {
          await addDoc(collection(db, "events"), event);
        }),
      );
      alert("Sample events added successfully!");
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  return (
    <>
      {/* <h1>Students List</h1>
      <ul>
        {students.map((student) => (
          <li key={student.Name}>
            {student.Name} - {student.Age}
          </li>
        ))}
      </ul> */}

      <BrowserRouter>
        <Navbar />
        <button className="btn btn-primary" onClick={addSampleEvents}>
          Add sample events
        </button>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/feed" element={<Feed />} students={students} />
          <Route path="/event/:id" element={<EventDetail />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/create" element={<CreateEvent />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
