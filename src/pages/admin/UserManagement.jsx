import React, { useState, useEffect } from 'react';
import api from '../../services/api.client';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Container from '../../components/ui/Container';
import Badge from '../../components/ui/Badge';
import { Title, BodyText, Label } from '../../components/ui/Typography';
import Skeleton from '../../components/ui/Skeleton';
import {
  Shield,
  Search,
  UserX,
  UserCheck,
  MoreVertical,
  Mail,
  Calendar,
  Filter,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?page=${page}&limit=10&search=${search}`);
      setUsers(res.data.users || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleAction = async (userId, action, role = null) => {
    if (!window.confirm(`Are you sure you want to perform "${action}" on this user?`)) return;
    try {
      await api.post(`/admin/users/${userId}/manage`, { action, role });
      fetchUsers();
    } catch (err) {
      alert('Action failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Container className="py-10 space-y-8 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <Label className="text-primary-600 block mb-2 uppercase tracking-widest font-black text-xs">Access Control</Label>
          <Title className="text-4xl text-slate-900">User Management</Title>
          <BodyText className="mt-2 text-slate-500 max-w-lg">Manage platform access, assign administrative roles, and monitor user account status.</BodyText>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchUsers} className="bg-white">
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="w-full pl-12 p-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm font-medium text-sm"
            placeholder="Search users by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
          />
        </div>
        <Button onClick={fetchUsers} className="px-8 shadow-lg shadow-primary-600/10">Search Registry</Button>
      </div>

      <Card className="border-slate-200 shadow-xl overflow-hidden p-0 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400">Identity</th>
                <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400">Permissions</th>
                <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400">Account status</th>
                <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-slate-400">Engagement</th>
                <th className="px-8 py-5 text-right text-[10px] uppercase font-black tracking-widest text-slate-400">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td colSpan="5" className="px-8 py-6"><Skeleton className="h-12 w-full" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                    <AlertCircle size={40} className="mx-auto mb-4 text-slate-200" />
                    <h3 className="text-xl font-bold text-slate-900">No users found</h3>
                    <p className="text-slate-500 mt-1">Refine your search parameters to find matching accounts.</p>
                  </td>
                </tr>
              ) : (
                users.map(user => {
                  const isLocked = user.lockUntil && new Date(user.lockUntil) > new Date();
                  return (
                    <tr key={user._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black">
                            {user.name?.[0]?.toUpperCase() || <Shield size={18} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Mail size={12} /> {user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge
                          variant={user.role === 'admin' ? 'primary' : 'neutral'}
                          className={`uppercase tracking-widest text-[9px] font-black underline-offset-4 ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100'}`}
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        {isLocked ? (
                          <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-tight">
                            <div className="w-2 h-2 rounded-full bg-rose-500 shadow-lg shadow-rose-500/30" /> Banned
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-tight">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" /> Verified
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                          <Calendar size={14} className="text-slate-300" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isLocked ? (
                            <button onClick={() => handleAction(user._id, 'unban')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-bold text-xs uppercase tracking-widest">Unban</button>
                          ) : (
                            <button onClick={() => handleAction(user._id, 'ban')} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors font-bold text-xs uppercase tracking-widest">Restrict</button>
                          )}
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleAction(user._id, 'promote', 'admin')}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-bold text-xs uppercase tracking-widest"
                            >
                              Elevate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="bg-white px-6">Previous</Button>
        <div className="text-slate-400 text-xs font-black uppercase tracking-widest">
          Registry Page <span className="text-slate-900">{page}</span> of <span className="text-slate-900">{totalPages}</span>
        </div>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="bg-white px-6">Next</Button>
      </div>
    </Container>
  );
};

export default UserManagement;
