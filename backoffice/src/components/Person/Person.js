import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Table } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { getPersonsService, createPersonService, updatePersonService, deletePersonService } from '../../services/httpService/personService';
import { toast, ToastContainer } from 'react-toastify';

const Person = () => {

  const getPeople = async () => {
    try {
      const people = await getPersonsService();
      console.log('People', people);
      setPeople(people.people);
    } catch (error) {
      console.error('Error while fetching people', error);
    }
  };

  const createPerson = async (person) => {
    try {
      const newPerson = await createPersonService(person);
      console.log('New person', newPerson);
      await getPeople();
      toast.success('Person added successfully');
    } catch (error) {
      console.error('Error while adding person', error);
      toast.error(`Error while adding person: ${error.response.data.message}`);
    }
  }

  const updatePersonById = async (person) => {
    try {
      const updatedPerson = await updatePersonService(person.id, person);
      console.log('Updated person', updatedPerson);
      await getPeople();
      toast.success('Person updated successfully');
    } catch (error) {
      console.error('Error while updating person', error);
      toast.error(`Error while updating person: ${error.response.data.message}`);
    }
  };


  useEffect(() => {
    getPeople();
  }, []);

  const navigate = useNavigate();  

  const [people, setPeople] = useState([]);
  const [currentPerson, setCurrentPerson] = useState({ id: 0, name: '', email: '' });
  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState({}); // Nuevo estado para manejar errores

  const toggleModal = () => setModal(!modal);

  const handleInputChange = (e) => {
    setCurrentPerson({ ...currentPerson, [e.target.name]: e.target.value });
    // Limpiar errores al cambiar el valor
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!currentPerson.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!currentPerson.email.trim()) newErrors.email = 'El email es obligatorio.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addPerson = () => {
    if (!validateForm()) return;
    //setPeople([...people, { ...currentPerson, id: Date.now() }]);
    createPerson(currentPerson);
    toggleModal();
    setCurrentPerson({ id: 0, name: '', email: '' }); // Corregido para usar setCurrentPerson
  };

  const editPerson = (personId) => {
    // Encuentra la persona en el arreglo de people y actualiza su información
    const personToUpdate = people.find(p => p.id === personId);
    setCurrentPerson(personToUpdate);
    toggleModal(); // Cierra el modal
  }

  const updatePerson = () => {
    if (!validateForm()) return;
    //setPeople(people.map(p => (p.id === currentPerson.id ? currentPerson : p)));
    updatePersonById(currentPerson);
    toggleModal();
    setCurrentPerson({ id: 0, name: '', email: '' }); // Corregido para usar setCurrentPerson
  };

  const deletePerson = async (id) => {
    //setPeople(people.filter(p => p.id !== id));
    try {
      const deletePerson = await deletePersonService(id);
      console.log('Deleted person', deletePerson);
      await getPeople();
      toast.success('Person deleted successfully');
    } catch (error) {
      console.error('Error while deleting person', error);
      toast.error(`Error while deleting person: ${error.response.data.message}`);
    }
  };

  const confirmDelete = (id) => {
      if (window.confirm('Are you sure you want to delete this person?')) {
          deletePerson(id);
      }
  };

  const navigateToVehicles = (personId) => {
    navigate(`/vehicle/${personId}`)
  }

  return (
    <Container>
      <Button color="primary" onClick={toggleModal}>Add Person</Button>
      <Table>
          <thead>
              <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>
              {people.map(person => (
                  <tr key={person.id}>
                      <td>{person.name}</td>
                      <td>{person.email}</td>
                      <td>
                          <Button color="secondary" onClick={() => editPerson(person.id)}>Edit</Button>{' '}
                          <Button color="danger" onClick={() => confirmDelete(person.id)}>Delete</Button>{' '}
                          <Button color='secondary' onClick={() => navigateToVehicles(person.id)}>Vehicles</Button>
                      </td>
                  </tr>
              ))}
          </tbody>
      </Table>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{currentPerson.id ? 'Edit Person': 'Add Person'}</ModalHeader>
        <ModalBody>
          <Form>
              <FormGroup>
                  <Label for="name">Name</Label>
                  <Input id="name" name="name" value={currentPerson.name} onChange={handleInputChange} invalid={!!errors.name} />
                  <FormFeedback>{errors.name}</FormFeedback>
              </FormGroup>
              <FormGroup>
                  <Label for="email">Email</Label>
                  <Input id="email" name="email" value={currentPerson.email} onChange={handleInputChange} invalid={!!errors.email} />
                  <FormFeedback>{errors.email}</FormFeedback>
              </FormGroup>
              <Button color="primary" onClick={currentPerson.id ? updatePerson : addPerson}>{currentPerson.id ? 'Update' : 'Add'}</Button>
          </Form>
        </ModalBody>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

Person.propTypes = {
  people: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  })),
  currentPerson: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  modal: PropTypes.bool,
};

export default Person;