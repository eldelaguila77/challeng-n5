import { apiClient } from "./httpService";

export const getVehiclesService = async () => {
    try {
        const response = await apiClient.get("/vehicles");
        return response.data;
    } catch (error) {
        console.error("Error while fetching vehicles", error);
        throw error;
    }
}

export const getVehicleService = async (id) => {
    try {
        const response = await apiClient.get(`/vehicle/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error while fetching vehicle", error);
        throw error;
    }
}

export const getVehiclesByOwnerIdService = async (ownerId) => {
    try {
        const response = await apiClient.get(`/vehicles/person/${ownerId}`);
        return response.data;
    } catch (error) {
        console.error("Error while fetching vehicles by owner", error);
        throw error;
    }
}

export const createVehicleService = async (vehicle) => {
    try {
        const response = await apiClient.post("/vehicle", vehicle);
        return response.data;
    } catch (error) {
        console.error("Error while adding vehicle", error);
        throw error;
    }
}

export const updateVehicleService = async (id, vehicle) => {
    try {
        const response = await apiClient.put(`/vehicle/${id}`, vehicle);
        return response.data;
    } catch (error) {
        console.error("Error while updating vehicle", error);
        throw error;
    }
}

export const deleteVehicleService = async (id) => {
    try {
        const response = await apiClient.delete(`/vehicle/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error while deleting vehicle", error);
        throw error;
    }
}