import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getConnectedNumbers, getTemplates, sendTextMessage } from '../services/whatsapp.api';

const SendWhatsAppMessageModal = ({ isOpen, centerId, contact, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [numbers, setNumbers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({
    integrationId: '',
    mode: 'text',
    message: '',
    templateName: '',
    to: contact || '',
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    setForm((prev) => ({ ...prev, to: contact || '' }));
  }, [contact]);

  useEffect(() => {
    if (!isOpen || !centerId) return;
    const load = async () => {
      try {
        const numberRes = await getConnectedNumbers(centerId);
        const rows = numberRes?.data || numberRes?.numbers || numberRes || [];
        const list = Array.isArray(rows) ? rows : [];
        setNumbers(list);
        if (list[0] && !form.integrationId) {
          setForm((prev) => ({ ...prev, integrationId: list[0].id || list[0].integrationId || '' }));
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Unable to load connected numbers.');
      }
    };
    load();
  }, [isOpen, centerId, form.integrationId]);

  const selectedIntegration = useMemo(() => numbers.find((n) => (n.id || n.integrationId) === form.integrationId), [numbers, form.integrationId]);

  useEffect(() => {
    if (!isOpen || !form.integrationId || form.mode !== 'template') return;
    const loadTemplates = async () => {
      try {
        const response = await getTemplates(centerId, form.integrationId);
        const rows = response?.data || response?.templates || response || [];
        setTemplates(Array.isArray(rows) ? rows : []);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Unable to load templates.');
      }
    };
    loadTemplates();
  }, [isOpen, centerId, form.integrationId, form.mode]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!form.integrationId || !form.to) {
      toast.error('Connected number and recipient are required.');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const payload = {
        centerId,
        institute_uuid: centerId,
        integrationId: form.integrationId,
        to: form.to,
        type: form.mode,
        message: form.mode === 'text' ? form.message : undefined,
        templateName: form.mode === 'template' ? form.templateName : undefined,
      };
      const response = await sendTextMessage(payload);
      setResult(response?.data || response);
      toast.success('WhatsApp message sent.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send WhatsApp message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h3 className="font-semibold">Send WhatsApp Message</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="p-4 space-y-3">
          <select className="w-full border rounded p-2" value={form.integrationId} onChange={(e) => setForm((p) => ({ ...p, integrationId: e.target.value }))}>
            <option value="">Select Connected Number</option>
            {numbers.map((n) => (
              <option key={n.id || n.integrationId} value={n.id || n.integrationId}>
                {(n.displayName || n.phoneNumber || n.phone_number) + ` (${n.wabaId || n.waba_id || 'WABA'})`}
              </option>
            ))}
          </select>

          <input className="w-full border rounded p-2" value={form.to} onChange={(e) => setForm((p) => ({ ...p, to: e.target.value }))} placeholder="Recipient phone" />

          <div className="flex gap-3 text-sm">
            <label><input type="radio" checked={form.mode === 'text'} onChange={() => setForm((p) => ({ ...p, mode: 'text' }))} /> Text</label>
            <label><input type="radio" checked={form.mode === 'template'} onChange={() => setForm((p) => ({ ...p, mode: 'template' }))} /> Template</label>
          </div>

          {form.mode === 'text' ? (
            <textarea className="w-full border rounded p-2" rows={4} placeholder="Type message" value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} />
          ) : (
            <select className="w-full border rounded p-2" value={form.templateName} onChange={(e) => setForm((p) => ({ ...p, templateName: e.target.value }))}>
              <option value="">Select Template</option>
              {templates.map((t) => (
                <option key={t.id || t.name} value={t.name}>{t.name}</option>
              ))}
            </select>
          )}

          <button onClick={handleSend} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {loading ? 'Sending...' : 'Send WhatsApp Message'}
          </button>

          {selectedIntegration && (
            <div className="text-xs text-gray-500">Using: {selectedIntegration.phoneNumber || selectedIntegration.phone_number || selectedIntegration.displayName}</div>
          )}

          {result && (
            <div className="bg-green-50 text-green-700 text-sm p-2 rounded">
              Status: {result.status || result.messageStatus || 'sent'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendWhatsAppMessageModal;
