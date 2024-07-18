from flask import jsonify, request

class OfficerController:
    def __init__(self, connection):
        self.connection = connection

    def get_officers(self):
        try:
            cursor = self.connection.connection.cursor()
            sql = "SELECT * FROM officer"
            cursor.execute(sql)
            data = cursor.fetchall()
            officers = []
            for officer in data:
                officers.append({'id': officer[0], 'name': officer[2], 'officer_number': officer[1]})
            return jsonify({'officers': officers}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400

    def get_officer(self, id):
        try:
            cursor = self.connection.connection.cursor()
            sql = f"SELECT * FROM officer WHERE id = {id}"
            cursor.execute(sql)
            data = cursor.fetchone()
            if data:
                officer = {'id': data[0], 'name': data[2], 'officer_number': data[1]}
                return jsonify(officer), 200
            else:
                return jsonify({'message': 'Officer not found'}), 404
        except Exception as e:
            return jsonify({'message': str(e)}), 400

    def create_officer(self, data):
        try:
            cursor = self.connection.connection.cursor()
            # Check if officer_number already exists
            sql_check = "SELECT * FROM officer WHERE officer_number = %s"
            cursor.execute(sql_check, (data['officer_number'],))
            if cursor.fetchone():
                return jsonify({'message': 'Officer number already exists'}), 400
            sql = "INSERT INTO officer (name, officer_number) VALUES (%s, %s)"
            cursor.execute(sql, (data['name'], data['officer_number']))
            self.connection.connection.commit()
            return jsonify({'message': 'Officer created successfully'}), 201
        except Exception as e:
            return jsonify({'message': str(e)}), 400

    def update_officer(self, id, data):
        try:
            cursor = self.connection.connection.cursor()

            sql_check = "SELECT * FROM officer WHERE id = %s"
            cursor.execute(sql_check, (id,))
            if not cursor.fetchone():
                return jsonify({'message': 'Officer not found'}), 404

            sql_check_officer_number = "SELECT * FROM officer WHERE officer_number = %s AND id != %s"
            cursor.execute(sql_check_officer_number, (data['officer_number'], id))
            if cursor.fetchone():
                return jsonify({'message': 'Officer number already exists'}), 409

            sql = "UPDATE officer SET name = %s, officer_number = %s WHERE id = %s"
            print(f"sql: " + str(sql))
            cursor.execute(sql, (data['name'], data['officer_number'], id))
            self.connection.connection.commit()
            return jsonify({'message': 'Officer updated successfully'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400

    def delete_officer(self, id):
        try:
            cursor = self.connection.connection.cursor()
            sql = "DELETE FROM officer WHERE id = %s"
            cursor.execute(sql, (id,))
            self.connection.connection.commit()
            if cursor.rowcount == 0:
                return jsonify({'message': 'Officer not found'}), 404
            return jsonify({'message': 'Officer deleted successfully'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400