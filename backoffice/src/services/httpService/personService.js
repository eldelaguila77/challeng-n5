import { apiClient } from "./httpService";

export const getPersonsService = async () => {
  try {
    const response = await apiClient.get("/persons");
    return response.data;
  } catch (error) {
    console.error("Error while fetching persons", error);
    throw error;
  }
}

export const getPersonService = async (id) => {
  try {
    const response = await apiClient.get(`/person/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching person", error);
    throw error;
  }
}

export const createPersonService = async (person) => {
  try {
    const response = await apiClient.post("/person", person);
    return response.data;
  } catch (error) {
    console.error("Error while adding person", error);
    throw error;
  }
}

export const updatePersonService = async (id, person) => {
  try {
    const response = await apiClient.put(`/person/${id}`, person);
    return response.data;
  } catch (error) {
    console.error("Error while updating person", error);
    throw error;
  }
}

export const deletePersonService = async (id) => {
  try {
    const response = await apiClient.delete(`/person/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error while deleting person", error);
    throw error;
  }
}