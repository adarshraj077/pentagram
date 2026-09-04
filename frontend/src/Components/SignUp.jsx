import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import api from '../api';
import { AuthContext } from '../AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      if (res.data.success) {
        login(res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-canvas text-primary transition-colors duration-300">
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] flex flex-col items-center justify-center"
      >
        <div className="w-full bg-surface rounded-2xl shadow-2xl border border-divider p-[40px] flex flex-col relative overflow-hidden transition-colors duration-300">
          
          <div className="flex flex-col items-center mb-8 text-center">

            <h2 className="text-xl font-semibold text-primary mb-1">Create your account</h2>
            <p className="text-sm text-secondary">Join Pentagram and start sharing</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            {error && <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-500 text-sm text-center font-bold">{error}</div>}
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">Name</label>
              <input value={formData.name} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-divider bg-canvas text-primary placeholder:text-secondary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all duration-300" name="name" placeholder="Enter your name" required type="text" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">Email</label>
              <input value={formData.email} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-divider bg-canvas text-primary placeholder:text-secondary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all duration-300" name="email" placeholder="name@example.com" required type="email" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">Password</label>
              <input value={formData.password} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-divider bg-canvas text-primary placeholder:text-secondary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all duration-300" name="password" placeholder="Create a password" required type="password" />
            </div>

            <div className="flex flex-col gap-1.5 mb-2">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">Confirm Password</label>
              <input value={formData.confirmPassword} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-divider bg-canvas text-primary placeholder:text-secondary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all duration-300" name="confirmPassword" placeholder="Confirm your password" required type="password" />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 flex items-center justify-center bg-black text-white text-lg font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-70 cursor-pointer" 
              type="submit"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Account'}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-accent font-bold hover:underline transition-all duration-200">Log in</Link>
            </p>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default SignUp;