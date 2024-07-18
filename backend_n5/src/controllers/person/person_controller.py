from flask import jsonify, request

class PersonController:
    def __init__(self, connection):
        self.connection = connection

    def get_persons(self):
        try:
            cursor = self.connection.connection.cursor()
            sql = "SELECT * FROM person"
            cursor.execute(sql)
            data = cursor.fetchall()
            people = []
            for person in data:
                people.append({'id': person[0], 'name': person[1], 'email': person[2]})
            return jsonify({'people': people, 'message': 'People list'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400
        
    def get_person(self, id):
        try:
            cursor = self.connection.connection.cursor()
            sql = f"SELECT * FROM person WHERE id = {id}"
            cursor.execute(sql)
            data = cursor.fetchone()
            if data is None:
                return jsonify({'message': 'Person not found'}), 404
            person = {'id': data[0], 'name': data[1], 'email': data[2]}
            return jsonify({'person': person, 'message': 'Person found'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400
        
    def create_person(self, data):
        try:
            print(f"request: " + str(data))
            cursor = self.connection.connection.cursor()

            sql_check = "SELECT * FROM person WHERE email = %s"
            cursor.execute(sql_check, (data['email'],))
            if cursor.fetchone():
                return jsonify({'message': 'Email already exists'}), 409

            sql = f"INSERT INTO person (name, email) VALUES ('{data['name']}', '{data['email']}')"
            cursor.execute(sql)
            self.connection.connection.commit()
            return jsonify({'message': 'Person created'}), 201
        except Exception as e:
            return jsonify({'message': str(e)}), 400
        
    def update_person(self, id, data):
        try:
            cursor = self.connection.connection.cursor()
            sql_check = "SELECT * FROM person WHERE id = %s"
            cursor.execute(sql_check, (id,))
            if not cursor.fetchone():
                return jsonify({'message': 'Person not found'}), 404

            sql_check_email = "SELECT * FROM person WHERE email = %s AND id != %s"
            cursor.execute(sql_check_email, (data['email'], id))
            if cursor.fetchone():
                return jsonify({'message': 'Email already exists'}), 409

            sql = f"UPDATE person SET name = '{data['name']}', email = '{data['email']}' WHERE id = {id}"
            cursor.execute(sql)
            self.connection.connection.commit()
            return jsonify({'message': 'Person updated'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400
        
    def delete_person(self, id):
        try:
            cursor = self.connection.connection.cursor()
            sql_check = "SELECT * FROM person WHERE id = %s"
            cursor.execute(sql_check, (id,))
            if not cursor.fetchone():
                return jsonify({'message': 'Person not found'}), 404

            sql = f"DELETE FROM person WHERE id = {id}"
            cursor.execute(sql)
            self.connection.connection.commit()
            return jsonify({'message': 'Person deleted'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400