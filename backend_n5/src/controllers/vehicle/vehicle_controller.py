from flask import jsonify, request

class VehicleController:
    def __init__(self, connection):
        self.connection = connection

    def get_vehicles(self):
        try:
            cursor = self.connection.connection.cursor()
            sql = "SELECT * FROM vehicle"
            cursor.execute(sql)
            data = cursor.fetchall()
            vehicles = []
            for vehicle in data:
                vehicles.append({'id': vehicle[0], 'plate': vehicle[1], 'brand': vehicle[2], 'color': vehicle[3], 'personId': vehicle[4]})
            return jsonify({'vehicles': vehicles, 'message': 'Vechiles list'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400

    def get_vehicle(self, id):
        try:
            cursor = self.connection.connection.cursor()
            sql = f"SELECT * FROM vehicle WHERE id = {id}"
            cursor.execute(sql)
            data = cursor.fetchone()
            if data:
                vehicle = {'id': data[0], 'plate': data[1], 'brand': data[2], 'color': data[3], 'personId': data[4]}
                return jsonify(vehicle), 200
            else:
                return jsonify({'message': 'Vehicle not found'}), 404
        except Exception as e:
            return jsonify({'message': str(e)}), 400
        
    def get_vehicle_by_personId(self, personId):
        try:
            cursor = self.connection.connection.cursor()
            sql = f"SELECT * FROM vehicle WHERE personId = {personId}"
            cursor.execute(sql)
            data = cursor.fetchall()
            vehicles = []
            for vehicle in data:
                vehicles.append({'id': vehicle[0], 'plate': vehicle[1], 'brand': vehicle[2], 'color': vehicle[3], 'personId': vehicle[4]})
            return jsonify({'vehicles': vehicles, 'message': 'Vehicles list'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400

    def create_vehicle(self, data):
        try:
            cursor = self.connection.connection.cursor()
            # Check if plate already exists
            sql_check = "SELECT * FROM vehicle WHERE plate = %s"
            cursor.execute(sql_check, (data['plate'],))
            if cursor.fetchone():
                return jsonify({'message': 'License plate already exists'}), 400
            sql = "INSERT INTO vehicle (plate, brand, color, personId) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (data['plate'], data['brand'], data['color'], data['personId']))
            self.connection.connection.commit()
            return jsonify({'message': 'Vehicle created successfully'}), 201
        except Exception as e:
            return jsonify({'message': str(e)}), 400

    def update_vehicle(self, id, data):
        try:
            cursor = self.connection.connection.cursor()
            sql_check = "SELECT * FROM vehicle WHERE id = %s"
            cursor.execute(sql_check, (id,))
            if not cursor.fetchone():
                return jsonify({'message': 'Vehicle not found'}), 404

            sql_check_plate = "SELECT * FROM vehicle WHERE plate = %s AND id != %s"
            cursor.execute(sql_check_plate, (data['plate'], id))
            if cursor.fetchone():
                return jsonify({'message': 'Plate already registred'}), 409

            sql = "UPDATE vehicle SET plate = %s, brand = %s, color = %s, personId = %s WHERE id = %s"
            cursor.execute(sql, (data['plate'], data['brand'], data['color'], data['personId'], id))
            self.connection.connection.commit()
            return jsonify({'message': 'Vehicle updated successfully'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400

    def delete_vehicle(self, id):
        try:
            cursor = self.connection.connection.cursor()
            sql = "DELETE FROM vehicle WHERE id = %s"
            cursor.execute(sql, (id,))
            self.connection.connection.commit()
            if cursor.rowcount == 0:
                return jsonify({'message': 'Vehicle not found'}), 404
            return jsonify({'message': 'Vehicle deleted successfully'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400