import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './Components/SignUp';
import Login from './Components/LoginPage';
import HomePage from './Pages/HomePage';
import ProfilePage from './Pages/ProfilePage';
import PostDetail from './Pages/PostDetail';
import CreatePost from './Pages/CreatePost';
import EditPost from './Pages/EditPost';
import NotFound from './Pages/NotFound';
import MessagesPage from './Pages/MessagesPage';
import LandingPage from './Pages/LandingPage';
import Layout from './Components/Layout';
import { AuthContext } from './AuthContext';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      
      {/* Pages wrapped in the Layout component */}
      <Route path="/" element={user ? <Layout><HomePage /></Layout> : <LandingPage />} />
      <Route path="/profile/:id" element={<Layout><ProfilePage /></Layout>} />
      <Route path="/profile/me" element={user ? <Navigate to={`/profile/${user.id}`} state={{ edit: true }} /> : <Navigate to="/login" />} />
      <Route path="/posts/new" element={user ? <Layout defaultExpanded={false}><CreatePost /></Layout> : <Navigate to="/login" />} />
      <Route path="/posts/:id/edit" element={user ? <Layout defaultExpanded={false}><EditPost /></Layout> : <Navigate to="/login" />} />
      <Route path="/messages" element={user ? <Layout><MessagesPage /></Layout> : <Navigate to="/login" />} />
      <Route path="/posts/:id" element={<Layout><PostDetail /></Layout>} />
      
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}

export default App;
