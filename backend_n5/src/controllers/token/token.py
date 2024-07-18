from flask import jsonify
from services.token.token import generate_token, verify_token

class TokenController:
    def __init__(self, connection):
        self.connection = connection
    
    def generate_token(self, officerId):
        try:
            cursor = self.connection.connection.cursor()
            sql = f"SELECT * FROM officer WHERE id = {officerId}"
            cursor.execute(sql)
            data = cursor.fetchone()
            if not data:
                return jsonify({'message': 'Officer not found'}), 404
            token = generate_token(officerId)
            return jsonify({'token': token, 'message': 'Token generated'}), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 400
        
    def verify_token(self, token):
        try:
            payload = verify_token(token)
            if payload:
                return jsonify({'payload': payload, 'message': 'Token verified'}), 200
            else:
                return jsonify({'message': 'Invalid token'}), 400
        except Exception as e:
            return jsonify({'message': str(e)}), 400