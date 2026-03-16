import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Works from './pages/Works'
import Articles from './pages/Articles'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import WorksManage from './pages/admin/WorksManage'
import ArticlesManage from './pages/admin/ArticlesManage'
import InquiriesManage from './pages/admin/InquiriesManage'
import AdminsManage from './pages/admin/AdminsManage'
import Login from './pages/admin/Login'

function App() {
  return (
    <Router>
      <Routes>
        {/* 前台路由 */}
        <Route path="/" element={<Home />} />
        <Route path="/works" element={<Works />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* 后台路由 */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="works" element={<WorksManage />} />
          <Route path="articles" element={<ArticlesManage />} />
          <Route path="inquiries" element={<InquiriesManage />} />
          <Route path="admins" element={<AdminsManage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App