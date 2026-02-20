import axios from 'axios';
import BASE_URL from '../../../config';

const authHeaders = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const withCenter = (data, centerId) => ({
  ...data,
  centerId,
  institute_uuid: centerId,
});

export const getIntegrations = async (centerId) => {
  const { data } = await axios.get(`${BASE_URL}/api/whatsapp/integrations`, {
    params: { centerId, institute_uuid: centerId },
    headers: authHeaders(),
  });
  return data;
};

export const connectManual = async (payload) => {
  const { centerId, ...credentials } = payload;
  const { data } = await axios.post(
    `${BASE_URL}/api/whatsapp/manual/connect`,
    withCenter(credentials, centerId),
    { headers: authHeaders() },
  );
  return data;
};

export const connectEmbedded = async ({ code, centerId }) => {
  const { data } = await axios.post(
    `${BASE_URL}/api/whatsapp/embedded/exchange`,
    withCenter({ code }, centerId),
    { headers: authHeaders() },
  );
  return data;
};

export const disconnectIntegration = async (centerId, integrationId) => {
  const { data } = await axios.post(
    `${BASE_URL}/api/whatsapp/disconnect`,
    withCenter({ integrationId }, centerId),
    { headers: authHeaders() },
  );
  return data;
};

export const syncTemplates = async (centerId, integrationId) => {
  const { data } = await axios.post(
    `${BASE_URL}/api/whatsapp/templates/sync`,
    withCenter({ integrationId }, centerId),
    { headers: authHeaders() },
  );
  return data;
};

export const getTemplates = async (centerId, integrationId) => {
  const { data } = await axios.get(`${BASE_URL}/api/whatsapp/templates`, {
    params: { centerId, institute_uuid: centerId, integrationId },
    headers: authHeaders(),
  });
  return data;
};

export const getConnectedNumbers = async (centerId) => {
  const { data } = await axios.get(`${BASE_URL}/api/whatsapp/numbers`, {
    params: { centerId, institute_uuid: centerId },
    headers: authHeaders(),
  });
  return data;
};

export const sendTextMessage = async (payload) => {
  const { data } = await axios.post(`${BASE_URL}/api/whatsapp/messages/send`, payload, {
    headers: authHeaders(),
  });
  return data;
};
