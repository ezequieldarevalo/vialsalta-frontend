import type { Municipio, MunicipioForm } from '../types/municipios.types';
import axios from 'axios';

const API = '/api/municipios';

export const municipiosService = {
  getAll: async (): Promise<Municipio[]> => {
    const { data } = await axios.get(API);
    return data;
  },
  get: async (id: number): Promise<Municipio> => {
    const { data } = await axios.get(`${API}/${id}`);
    return data;
  },
  create: async (municipio: MunicipioForm): Promise<Municipio> => {
    const { data } = await axios.post(API, municipio);
    return data;
  },
  update: async (id: number, municipio: Partial<MunicipioForm>): Promise<Municipio> => {
    const { data } = await axios.put(`${API}/${id}`, municipio);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await axios.delete(`${API}/${id}`);
  },
};
