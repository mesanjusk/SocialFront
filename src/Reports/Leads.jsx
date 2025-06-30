import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BASE_URL from '../config';
import LeadStatusModal from "../components/leads/LeadStatusModal"; // ✅ keep as is if file exists

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const navigate = useNavigate();
  const { username } = useParams();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const institute_uuid = localStorage.getItem('institute_uuid');
      const { data } = await axios.get(`${BASE_URL}/api/leads`, {
        params: { institute_uuid },
      });
      setLeads(Array.isArray(data?.data) ? data.data : []);
      console.log('✅ Leads fetched', data?.data);
    } catch (error) {
      console.error('❌ Error fetching leads:', error.response?.data || error.message);
      toast.error('Error fetching leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const name = `${lead.studentData?.firstName || ''} ${lead.studentData?.lastName || ''}`.toLowerCase();
    const mobile = lead.studentData?.mobileSelf || '';
    return name.includes(search.toLowerCase()) || mobile.includes(search);
  });

  return (
    <div className="p-4">
      <Toaster />
      {selectedLead && (
        <LeadStatusModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          refresh={fetchLeads}
        />
      )}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or mobile"
          className="border p-2 rounded w-full max-w-xs"
        />
        <button
          onClick={() => navigate(`/${username}/add-lead`)}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + New Lead
        </button>
      </div>

      {loading && <div>Loading leads...</div>}
      {!loading && filteredLeads.length === 0 && <div>No leads found.</div>}
      {!loading && filteredLeads.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Mobile</th>
                <th className="border p-2 text-left">Branch</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Referred By</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.uuid}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="border p-2">
                    {lead.studentData?.firstName} {lead.studentData?.lastName}
                  </td>
                  <td className="border p-2">{lead.studentData?.mobileSelf}</td>
                  <td className="border p-2">{lead.branchCode || '-'}</td>
                  <td className="border p-2">
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      lead.leadStatus === 'open' ? 'bg-blue-500' :
                      lead.leadStatus === 'follow-up' ? 'bg-yellow-500' :
                      lead.leadStatus === 'converted' ? 'bg-green-500' :
                      lead.leadStatus === 'lost' ? 'bg-red-500' :
                      'bg-gray-400'
                    }`}>
                      {lead.leadStatus || 'N/A'}
                    </span>
                  </td>
                  <td className="border p-2">{lead.referredBy || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leads;
