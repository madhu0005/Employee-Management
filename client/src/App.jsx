import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Header';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from './Components/Home';
import Employee from './Components/Employee';
import AddEmployee from './Components/AddEmployee';
import EditEmployee from './Components/EditEmployee';
import PrivateRoute from './Components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/adminlogin' element={<Login />} />
        <Route path='/dashboard' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
          <Route path='' element={<Home />} />
          <Route path='/dashboard/employee' element={<Employee />} />
          <Route path='/dashboard/add_employee' element={<AddEmployee />} />
          <Route path='/dashboard/edit_employee/:id' element={<EditEmployee />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
