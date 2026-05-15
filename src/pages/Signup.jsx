import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineAcademicCap, HiOutlineUser, HiOutlineIdentification } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    rollNo: '',
    semester: '',
    branch: '',
    college: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HiOutlineAcademicCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
          <p className="text-sm text-slate-500 mt-1">Join InfoMate and manage your academic life</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3.5">
          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Full Name *</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus-within:border-indigo-300 focus-within:bg-white transition-all">
              <HiOutlineUser className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Devansh Kumar"
                className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder-slate-400 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Email *</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus-within:border-indigo-300 focus-within:bg-white transition-all">
              <HiOutlineMail className="w-4 h-4 text-slate-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder-slate-400 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Password *</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus-within:border-indigo-300 focus-within:bg-white transition-all">
              <HiOutlineLockClosed className="w-4 h-4 text-slate-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder-slate-400 outline-none"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Roll No</label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus-within:border-indigo-300 focus-within:bg-white transition-all">
                <HiOutlineIdentification className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="rollNo"
                  value={form.rollNo}
                  onChange={handleChange}
                  placeholder="CS2023045"
                  className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Semester</label>
              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 outline-none focus:border-indigo-300"
              >
                <option value="">Select</option>
                {[1,2,3,4,5,6,7,8].map(s => (
                  <option key={s} value={`${s}${s===1?'st':s===2?'nd':s===3?'rd':'th'} Semester`}>
                    {s}{s===1?'st':s===2?'nd':s===3?'rd':'th'} Sem
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Branch</label>
            <input
              type="text"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              placeholder="Computer Science & Engineering"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-300 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">College</label>
            <input
              type="text"
              name="college"
              value={form.college}
              onChange={handleChange}
              placeholder="National Institute of Technology"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-300 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-[13px] font-medium rounded-lg transition-colors mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-[13px] text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
