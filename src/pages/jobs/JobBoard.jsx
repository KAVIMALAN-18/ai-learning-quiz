import React, { useState, useEffect } from 'react';
import api from '../../services/api.client';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Container from '../../components/ui/Container';
import { Briefcase, MapPin, DollarSign, Upload, Search, Star } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

const JobBoard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, recommended
  const [applying, setApplying] = useState(null); // jobId being applied to

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const endpoint = filter === 'recommended' ? '/jobs/recommendations' : '/jobs';
      const res = await api.get(endpoint);
      setJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      // For MVP, we auto-submit without resume/cover letter modal
      // In prod, this would open a modal to upload resume
      await api.post('/jobs/apply', {
        jobId,
        resumeUrl: "https://example.com/resume.pdf", // Mock resume
        coverLetter: "I am interested in this role."
      });
      alert('Application Submitted Successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  return (
    <Container className="py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Career Opportunities</h1>
          <p className="text-slate-500">Find your next role tailored to your skills.</p>
        </div>
        
        <div className="flex gap-4">
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Jobs
          </Button>
          <Button 
            variant={filter === 'recommended' ? 'primary' : 'outline'}
            onClick={() => setFilter('recommended')}
            className="flex items-center gap-2"
          >
            <Star size={16} /> Recommended
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading opportunities...</div>
      ) : (
        <div className="grid gap-6">
          {jobs.map(job => (
            <Card key={job._id} className="p-6 transition-all hover:shadow-lg border-l-4 border-l-transparent hover:border-l-primary-600">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                    {job.companyId?.logo ? <img src={job.companyId.logo} className="w-full h-full object-cover rounded-lg"/> : "🏢"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                    <div className="text-slate-600 font-medium">{job.companyId?.name || "Unknown Company"}</div>
                    
                    <div className="flex gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Briefcase size={14}/> {job.type}</span>
                      <span className="flex items-center gap-1"><MapPin size={14}/> {job.location} {job.isRemote && '(Remote)'}</span>
                      {job.salary && (
                        <span className="flex items-center gap-1"><DollarSign size={14}/> {job.salary.min / 1000}k - {job.salary.max / 1000}k</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {job.matchScore && (
                    <div className="mb-2 inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                      {job.matchScore}% Match
                    </div>
                  )}
                  <div>
                  <Button 
                    onClick={() => handleApply(job._id)}
                    disabled={applying === job._id}
                    className="shadow-md shadow-primary-500/20"
                  >
                    {applying === job._id ? 'Sending...' : 'Apply Now'}
                  </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                {job.skillsRequired.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          ))}

          {jobs.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
              <p className="text-slate-500">No jobs found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default JobBoard;
