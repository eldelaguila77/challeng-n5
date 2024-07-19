from flask import jsonify, request

class TicketController:
    def __init__(self, connection):
        self.connection = connection
    
    def get_tickets(self):
        try:
            cursor = self.connection.connection.cursor()
            sql = "SELECT * FROM vehicle_ticket"
            cursor.execute(sql)
            data = cursor.fetchall()
            tickets = []
            for ticket in data:
                tickets.append({'id': ticket[0], 'vehicleId': ticket[1], 'officerId': ticket[2], 'ticket_date': ticket[3], 'comments': ticket[4]})
            return jsonify({'tickets': tickets, 'message': 'Tickets list'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400
        
    def get_ticket(self, id):
        try:
            cursor = self.connection.connection.cursor()
            sql = f"SELECT * FROM vehicle_ticket WHERE id = {id}"
            cursor.execute(sql)
            ticket = cursor.fetchone()
            if ticket:
                ticket = {'id': ticket[0], 'vehicleId': ticket[1], 'officerId': ticket[2], 'ticket_date': ticket[3], 'comments': ticket[4]}
                return jsonify({'ticket': ticket, 'message': 'Ticket found'}), 200
            else:
                return jsonify({'message': 'Ticket not found'}), 404
        except Exception as e:
            return jsonify({'message': str(e)}), 400
        
    def create_ticket(self, data):
        try:
            cursor = self.connection.connection.cursor()
            sql_get_vehicle = "SELECT * FROM vehicle WHERE plate = %s"
            cursor.execute(sql_get_vehicle, (data['plate'],))
            vehicle = cursor.fetchone()
            if not vehicle:
                return jsonify({'message': 'Vehicle not found'}), 404
            sql = "INSERT INTO vehicle_ticket (vehicleId, officerId, ticket_date, comments) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (vehicle[0], data['official_id'], data['ticket_date'], data['comments']))
            self.connection.connection.commit()
            return jsonify({'message': 'Ticket created'}), 201
        except Exception as e:
            return jsonify({'message': str(e)}), 400
        
    def update_ticket(self, id, data):
        try:
            cursor = self.connection.connection.cursor()
            sql_check = "SELECT * FROM vehicle_ticket WHERE id = %s"
            cursor.execute(sql_check, (id,))
            if not cursor.fetchone():
                return jsonify({'message': 'Ticket not found'}), 404
            
            sql_check_vehicle = "SELECT * FROM vehicle WHERE id = %s"
            cursor.execute(sql_check_vehicle, (data['vehicleId'],))
            if not cursor.fetchone():
                return jsonify({'message': 'Vehicle not found'}), 404
            
            sql_check_officer = "SELECT * FROM officer WHERE id = %s"
            cursor.execute(sql_check_officer, (data['officerId'],))
            if not cursor.fetchone():
                return jsonify({'message': 'Officer not found'}), 404

            sql = "UPDATE vehicle_ticket SET vehicleId = %s, officerId = %s, ticket_date = %s, comments = %s WHERE id = %s"
            cursor.execute(sql, (data['vehicleId'], data['officerId'], data['ticket_date'], data['comments'], id))
            self.connection.connection.commit()
            return jsonify({'message': 'Ticket updated'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400
        
    def delete_ticket(self, id):
        try:
            cursor = self.connection.connection.cursor()
            sql = "DELETE FROM vehicle_ticket WHERE id = %s"
            cursor.execute(sql, (id,))
            self.connection.connection.commit()
            if cursor.rowcount == 0:
                return jsonify({'message': 'vehicle_ticket not found'}), 404
            return jsonify({'message': 'vehicle_ticket deleted successfully'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400
        

    def get_tikets_by_email(self, email):
        try:
            cursor = self.connection.connection.cursor()
            sql = """
            SELECT vt.id, vt.ticket_date, vt.comments,
                   v.id AS vehicle_id, v.plate, v.brand, v.color,
                   p.id AS person_id, p.name, p.email
            FROM vehicle_ticket vt
            JOIN vehicle v ON vt.vehicleId = v.id
            JOIN person p ON v.personId = p.id
            WHERE p.email = %s
            """
            cursor.execute(sql, (email,))
            data = cursor.fetchall()
            complete_tickets = []
            for row in data:
                complete_tickets.append({
                    'ticket': {
                        'id': row[0],
                        'ticket_date': row[1],
                        'comments': row[2]
                    },
                    'vehicle': {
                        'id': row[3],
                        'plate': row[4],
                        'brand': row[5],
                        'color': row[6]
                    },
                    'person': {
                        'id': row[7],
                        'name': row[8],
                        'email': row[9]
                    }
                })
            return jsonify({'tickets': complete_tickets, 'message': 'Tickets found'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400