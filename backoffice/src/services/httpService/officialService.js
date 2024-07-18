import { apiClient } from "./httpService";

export const getOfficialsService = async () => {
  try {
    const response = await apiClient.get("/officers");
    return response.data;
  } catch (error) {
    console.error("Error while fetching officials", error);
    throw error;
  }
}

export const getOfficialService = async (id) => {
  try {
    const response = await apiClient.get(`/officer/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching official", error);
    throw error;
  }
}

export const createOfficialService = async (official) => {
  try {
    const response = await apiClient.post("/officer", official);
    return response.data;
  } catch (error) {
    console.error("Error while adding official", error);
    throw error;
  }
}

export const updateOfficialService = async (id, official) => {
  try {
    const response = await apiClient.put(`/officer/${id}`, official);
    return response.data;
  } catch (error) {
    console.error("Error while updating official", error);
    throw error;
  }
}

export const deleteOfficialService = async (id) => {
  try {
    const response = await apiClient.delete(`/officer/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while deleting official", error);
    throw error;
  }
}