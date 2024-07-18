import React, { useEffect, useState } from 'react';
import { Button, Container, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Table } from 'reactstrap';
import { getOfficialsService, createOfficialService, updateOfficialService, deleteOfficialService } from '../../services/httpService/officialService';
import { toast, ToastContainer } from 'react-toastify';

const Official = () => {

  const getOfficials = async () => {
    try {
      const officials = await getOfficialsService();
      console.log('Officials', officials);
      setOfficials(officials.officers);
    } catch (error) {
      console.error('Error while fetching officials', error);
    }
  };

  const createOfficial = async (official) => {
    try {
      const newOfficial = await createOfficialService(official);
      console.log('New official', newOfficial);
      await getOfficials();
      toast.success('Official added successfully');
    } catch (error) {
      console.error('Error while adding official', error);
      toast.error(`Error while adding official: ${error.response.data.message}`);
    }
  }

  const updateOfficialById = async (official) => {
    try {
      const updatedOfficial = await updateOfficialService(official.id, official);
      console.log('Updated official', updatedOfficial);
      await getOfficials();
      toast.success('Official updated successfully');
    } catch (error) {
      console.error('Error while updating official', error);
      toast.error(`Error while updating official: ${error.response.data.message}`);
    }
  };

  useEffect(() => {
    getOfficials();
  }, []);

  const [officials, setOfficials] = useState([]);
  const [currentOfficial, setCurrentOfficial] = useState({ id: 0, name: '', officer_number: '' });
  const [modal, setModal] = useState(false);
  const [errors, setErrors] = useState({});

  const toggleModal = () => setModal(!modal);

  const handleInputChange = (e) => {
    setCurrentOfficial({ ...currentOfficial, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!currentOfficial.name.trim()) newErrors.name = 'Name is required.';
    if (!currentOfficial.officer_number.trim()) newErrors.officer_number = 'Unique ID is required.';
    else if (officials.some(official => official.officer_number === currentOfficial.officer_number && official.id !== currentOfficial.id)) {
      newErrors.officer_number = 'This Unique ID already exists.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addOfficial = () => {
    if (!validateForm()) return;
    //setOfficials([...officials, { ...currentOfficial, id: Date.now() }]);
    createOfficial(currentOfficial);
    toggleModal();
    setCurrentOfficial({ id: 0, name: '', officer_number: '' });
  };

  const editOfficial = (officialId) => {
    const officialToUpdate = officials.find(official => official.id === officialId);
    setCurrentOfficial(officialToUpdate);
    toggleModal();
  };

  const updateOfficial = () => {
    if (!validateForm()) return;
    //setOfficials(officials.map(official => (official.id === currentOfficial.id ? currentOfficial : official)));
    updateOfficialById(currentOfficial);
    toggleModal();
    setCurrentOfficial({ id: 0, name: '', officer_number: '' });
  };

  const deleteOfficial = async (id) => {
    //setOfficials(officials.filter(p => p.id !== id));
    try {
      const deletedOfficial = deleteOfficialService(id);
      console.log('Deleted official', deletedOfficial);
      await getOfficials();
      toast.success('Official deleted successfully');
    } catch (error) {
      console.error('Error while deleting official', error);
      toast.error(`Error while deleting official: ${error.response.data.message}`);
    }
  };

  const confirmDelete = (id) => {
      if (window.confirm('Are you sure you want to delete this official?')) {
          deleteOfficial(id);
      }
  };
  return (
    <Container>
        <Button color="primary" onClick={toggleModal}>Add Official</Button>
      <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>{currentOfficial.id ? 'Edit Official' : 'Add Official'}</ModalHeader>
            <ModalBody>
                <Form>
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter official's name"
                    value={currentOfficial.name}
                    onChange={handleInputChange}
                    invalid={errors.name ? true : false}
                    />
                    <FormFeedback>{errors.name}</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="officer_number">Unique ID</Label>
                    <Input
                    type="text"
                    name="officer_number"
                    id="officer_number"
                    placeholder="Enter unique ID"
                    value={currentOfficial.officer_number}
                    onChange={handleInputChange}
                    invalid={errors.officer_number ? true : false}
                    />
                    <FormFeedback>{errors.officer_number}</FormFeedback>
                </FormGroup>
                <Button color="primary" onClick={currentOfficial.id ? updateOfficial : addOfficial}>
                    {currentOfficial.id ? 'Update' : 'Add'}
                </Button>
                </Form>
            </ModalBody>
        </Modal>
        <Table>
            <thead>
                <tr>
                <th>Name</th>
                <th>Unique ID</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {officials.map((official) => (
                <tr key={official.id}>
                    <td>{official.name}</td>
                    <td>{official.officer_number}</td>
                    <td>
                    <Button color="warning" onClick={() => editOfficial(official.id)}>Edit</Button>{' '}
                    <Button color="danger" onClick={() => confirmDelete(official.id)}>Delete</Button>
                    </td>
                </tr>
                ))}
            </tbody>
        </Table>
        <ToastContainer />
    </Container>
  );
};

export default Official;