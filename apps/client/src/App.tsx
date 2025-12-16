import '@xyflow/react/dist/style.css';
import { Router,BrowserRouter,Routes,Route } from 'react-router-dom';
import CreateWorkflow from './components/CreateWorkflow';

export default function App() {

  return <div className="min-h-screen bg-gray-50">
    <BrowserRouter>
    <Routes>
      <Route path="/create-workflow" element={<CreateWorkflow/>} />
    </Routes>
    </BrowserRouter>
  </div>
}