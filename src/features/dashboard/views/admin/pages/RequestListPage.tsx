import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Request {
  id: string;
  type: "BIOMETRIC" | "VPN";
  requester: string;
  department: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
}

const RequestListPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  // ===============================
  // MOCK DATA (no backend)
  // ===============================
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const mockData: Request[] = [
        { id: "1", type: "BIOMETRIC", requester: "John Doe", department: "Engineering", status: "PENDING", submittedAt: new Date().toISOString() },
        { id: "2", type: "VPN", requester: "Jane Smith", department: "HR", status: "APPROVED", submittedAt: new Date().toISOString() },
        { id: "3", type: "BIOMETRIC", requester: "Alice Johnson", department: "Sales", status: "REJECTED", submittedAt: new Date().toISOString() },
        { id: "4", type: "VPN", requester: "Bob Brown", department: "Finance", status: "PENDING", submittedAt: new Date().toISOString() },
      ];
      setRequests(mockData);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id: string) => {
    setUpdatingId(id);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "APPROVED" } : r));
    setUpdatingId(null);
  };

  const handleReject = (id: string) => {
    setUpdatingId(id);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "REJECTED" } : r));
    setUpdatingId(null);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  // Separate by type
  const biometricRequests = requests.filter(r => r.type === "BIOMETRIC");
  const vpnRequests = requests.filter(r => r.type === "VPN");

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
  
      {/* BIOMETRIC REQUESTS */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Biometric Requests</h2>
        <RequestTable requests={biometricRequests} updatingId={updatingId} onApprove={handleApprove} onReject={handleReject} />
      </section>

      {/* VPN REQUESTS */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">VPN Requests</h2>
        <RequestTable requests={vpnRequests} updatingId={updatingId} onApprove={handleApprove} onReject={handleReject} />
      </section>
    </div>
  );
};

interface RequestTableProps {
  requests: Request[];
  updatingId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const RequestTable: React.FC<RequestTableProps> = ({ requests, updatingId, onApprove, onReject }) => {
  if (requests.length === 0) return <div className="text-center text-gray-400 py-6">No requests found.</div>;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-x-auto border">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-gray-500 uppercase text-xs">
          <tr>
            <th className="px-6 py-3">Requester</th>
            <th className="px-6 py-3">Department</th>
            <th className="px-6 py-3">Submitted At</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {requests.map(req => (
            <motion.tr key={req.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-gray-700">{req.requester}</td>
              <td className="px-6 py-4 text-gray-600">{req.department}</td>
              <td className="px-6 py-4 text-gray-600">{new Date(req.submittedAt).toLocaleDateString()}</td>
              <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
              <td className="px-6 py-4 flex gap-3">
                {req.status === "PENDING" && (
                  <>
                    <button
                      disabled={updatingId === req.id}
                      onClick={() => onApprove(req.id)}
                      className="flex items-center gap-2 px-3 py-1 text-green-700 border border-green-300 rounded hover:bg-green-50 text-xs font-semibold"
                    >
                      <FaCheckCircle size={14} /> Approve
                    </button>
                    <button
                      disabled={updatingId === req.id}
                      onClick={() => onReject(req.id)}
                      className="flex items-center gap-2 px-3 py-1 text-red-700 border border-red-300 rounded hover:bg-red-50 text-xs font-semibold"
                    >
                      <FaTimesCircle size={14} /> Reject
                    </button>
                  </>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "APPROVED")
    return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Approved</span>;
  if (status === "REJECTED")
    return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">Rejected</span>;
  return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">Pending</span>;
};

export default RequestListPage;