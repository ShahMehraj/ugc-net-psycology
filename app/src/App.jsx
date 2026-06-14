import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home.jsx'
import Exam from './components/Exam.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* mode = "practice" | "cbt" */}
      <Route path="/exam/:paperId/:mode" element={<Exam />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
