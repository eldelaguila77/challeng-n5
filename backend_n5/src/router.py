# router.py
from flask import request
from controllers.person.person_controller import PersonController
from controllers.vehicle.vehicle_controller import VehicleController
from controllers.officer.officer_controller import OfficerController
from controllers.ticket.ticket_controller import TicketController
from controllers.token.token import TokenController
from services.token.token import required_token

def setup_routes(app, connection):
    # Person routes

    person_controller = PersonController(connection)

    @app.route('/person', methods=['POST'])
    def create_person():
        # Captura los datos de la solicitud
        person_data = request.json
        return person_controller.create_person(person_data)

    @app.route('/persons', methods=['GET'])
    def get_persons():
        return person_controller.get_persons()

    @app.route('/person/<int:id>', methods=['GET'])
    def get_person(id):
        return person_controller.get_person(id)

    @app.route('/person/<int:id>', methods=['PUT'])
    def update_person(id):
        # Captura los datos de la solicitud para actualizar
        person_data = request.json
        return person_controller.update_person(id, person_data)

    @app.route('/person/<int:id>', methods=['DELETE'])
    def delete_person(id):
        return person_controller.delete_person(id)


    # Vehicle routes
    vehicle_controller = VehicleController(connection)

    @app.route('/vehicle', methods=['POST'])
    def create_vehicle():
        vehicle_data = request.json
        return vehicle_controller.create_vehicle(vehicle_data)
    
    @app.route('/vehicles', methods=['GET'])
    def get_vehicles():
        return vehicle_controller.get_vehicles()
    
    @app.route('/vehicle/<int:id>', methods=['GET'])
    def get_vehicle(id):
        return vehicle_controller.get_vehicle(id)
    
    @app.route('/vehicles/person/<int:personId>', methods=['GET'])
    def get_vehicle_by_personId(personId):
        return vehicle_controller.get_vehicle_by_personId(personId)
    
    @app.route('/vehicle/<int:id>', methods=['PUT'])
    def update_vehicle(id):
        vehicle_data = request.json
        return vehicle_controller.update_vehicle(id, vehicle_data)
    
    @app.route('/vehicle/<int:id>', methods=['DELETE'])
    def delete_vehicle(id):
        return vehicle_controller.delete_vehicle(id)
    
    # Officer routes
    officer_controller = OfficerController(connection)

    @app.route('/officer', methods=['POST'])
    def create_officer():
        officer_data = request.json
        return officer_controller.create_officer(officer_data)
    
    @app.route('/officers', methods=['GET'])
    def get_officers():
        return officer_controller.get_officers()
    
    @app.route('/officer/<int:id>', methods=['GET'])
    def get_officer(id):
        return officer_controller.get_officer(id)
    
    @app.route('/officer/<int:id>', methods=['PUT'])
    def update_officer(id):
        officer_data = request.json
        return officer_controller.update_officer(id, officer_data)
    
    @app.route('/officer/<int:id>', methods=['DELETE'])
    def delete_officer(id):
        return officer_controller.delete_officer(id)
    
    # Ticket routes
    ticket_controller = TicketController(connection)
    @app.route('/ticket', methods=['POST'])
    @required_token
    def create_ticket(official_id, *args, **kwargs):
        print(f"request json: {request.json}")
        print(f"request data: {request.data}")
        ticket_data = request.json
        ticket_data['official_id'] = official_id
        return ticket_controller.create_ticket(ticket_data)
    
    @app.route('/tickets', methods=['GET'])
    def get_tickets():
        return ticket_controller.get_tickets()
    
    @app.route('/ticket/<int:id>', methods=['GET'])
    def get_ticket(id):
        return ticket_controller.get_ticket(id)
    
    @app.route('/ticket/<int:id>', methods=['PUT'])
    def update_ticket(id):
        ticket_data = request.json
        return ticket_controller.update_ticket(id, ticket_data)
    
    @app.route('/ticket/<int:id>', methods=['DELETE'])
    def delete_ticket(id):
        return ticket_controller.delete_ticket(id)
    
    # Token routes
    token_controller = TokenController(connection)

    @app.route('/token', methods=['POST'])
    def generate_token():
        token_data = request.json
        return token_controller.generate_token(token_data['officerId'])
    
    @app.route('/token/verify', methods=['POST'])
    def verify_token():
        token_data = request.json
        return token_controller.verify_token(token_data['token'])