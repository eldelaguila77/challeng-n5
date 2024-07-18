import React, { useEffect, useState } from 'react';
import { Button, Container, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Table } from 'reactstrap';
import { getVehiclesByOwnerIdService, createVehicleService, updateVehicleService, deleteVehicleService } from '../../services/httpService/vehicleService';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';

const Vehicle = () => {

  const { personId } = useParams();
  const getVehiclesByPersonId = async (personId) => {
    try {
      const vehicles = await getVehiclesByOwnerIdService(personId);
      console.log('Vehicles', vehicles);
      setVehicles(vehicles.vehicles);
    } catch (error) {
      console.error('Error while fetching vehicles', error);
    }
  };

  const createVehicle = async (vehicle) => {
    try {
      const newVehicle = await createVehicleService(vehicle);
      console.log('New vehicle', newVehicle);
      await getVehiclesByPersonId(personId);
      toast.success('Vehicle added successfully');
    } catch (error) {
      console.error('Error while adding vehicle', error);
      toast.error(`Error while adding vehicle: ${error.response.data.message}`);
    }
  };

  const updateVehicleById = async (vehicle) => {
    try {
      const updatedVehicle = await updateVehicleService(vehicle.id, vehicle);
      console.log('Updated vehicle', updatedVehicle);
      await getVehiclesByPersonId(personId);
      toast.success('Vehicle updated successfully');
    } catch (error) {
      console.error('Error while updating vehicle', error);
      toast.error(`Error while updating vehicle: ${error.response.data.message}`);
    }
  };

  useEffect(() => {
    console.log('Owner ID', personId);
    getVehiclesByPersonId(personId);
  }, []);

  const [vehicles, setVehicles] = useState([]);
  const [currentVehicle, setCurrentVehicle] = useState({ id: 0, plate: '', brand: '', color: '', personId: personId });
  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState({});

  const toggleModal = () => setModal(!modal);

  const handleInputChange = (e) => {
    setCurrentVehicle({ ...currentVehicle, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!currentVehicle.plate.trim()) newErrors.plate = 'License plate is required.';
    if (!currentVehicle.brand.trim()) newErrors.brand = 'Brand is required.';
    if (!currentVehicle.color.trim()) newErrors.color = 'Color is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addVehicle = () => {
    if (!validateForm()) return;
    //setVehicles([...vehicles, { ...currentVehicle, id: Date.now(), personId: personId}]);
    createVehicle(currentVehicle);
    toggleModal();
    setCurrentVehicle({ id: 0, plate: '', brand: '', color: '', personId: personId });
  };

  const editVehicle = (vehicleId) => {
    const vehicleToUpdate = vehicles.find(vehicle => vehicle.id === vehicleId);
    setCurrentVehicle(vehicleToUpdate);
    toggleModal();
  };

    const updateVehicle = () => {
        if (!validateForm()) return;
        //setVehicles(vehicles.map(vehicle => (vehicle.id === currentVehicle.id ? currentVehicle : vehicle)));
        updateVehicleById(currentVehicle);
        toggleModal();
        setCurrentVehicle({ id: 0, plate: '', brand: '', color: '', personId: personId });
    };

  const deleteVehicle = async (vehicleId) => {
    //setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
    try {
      const deletedVehicle = deleteVehicleService(vehicleId);
      console.log('Deleted vehicle', deletedVehicle);
      await getVehiclesByPersonId(personId);
      toast.success('Vehicle deleted successfully');
    } catch (error) {
      console.error('Error while deleting vehicle', error);
      toast.error(`Error while deleting vehicle: ${error.response.data.message}`);
    }
  };

    const confirmDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            deleteVehicle(id);
        }
    };

    return (
        <Container>
          <Button color="primary" onClick={toggleModal}>Add Vehicle</Button>
          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Vehicle Details</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="plate">License Plate</Label>
                  <Input
                    type="text"
                    name="plate"
                    id="plate"
                    placeholder="Enter license plate"
                    value={currentVehicle.plate}
                    onChange={handleInputChange}
                    invalid={errors.plate ? true : false}
                  />
                  <FormFeedback>{errors.plate}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="brand">Brand</Label>
                  <Input
                    type="text"
                    name="brand"
                    id="brand"
                    placeholder="Enter brand"
                    value={currentVehicle.brand}
                    onChange={handleInputChange}
                    invalid={errors.brand ? true : false}
                  />
                  <FormFeedback>{errors.brand}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="color">Color</Label>
                  <Input
                    type="text"
                    name="color"
                    id="color"
                    placeholder="Enter color"
                    value={currentVehicle.color}
                    onChange={handleInputChange}
                    invalid={errors.color ? true : false}
                  />
                  <FormFeedback>{errors.color}</FormFeedback>
                </FormGroup>
                <Button color="primary" onClick={currentVehicle.id ? updateVehicle : addVehicle}>{currentVehicle.id ? 'Update' : 'Add'}</Button>
              </Form>
            </ModalBody>
          </Modal>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>License Plate</th>
                <th>Brand</th>
                <th>Color</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle, index) => (
                <tr key={vehicle.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{vehicle.plate}</td>
                  <td>{vehicle.brand}</td>
                  <td>{vehicle.color}</td>
                  <td>
                    <Button color="secondary" onClick={() => editVehicle(vehicle.id)}>Edit</Button>{' '}
                    <Button color="danger" onClick={() => confirmDelete(vehicle.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <ToastContainer />
        </Container>
    );
};

export default Vehicle;