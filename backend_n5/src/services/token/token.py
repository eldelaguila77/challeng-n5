import jwt
from datetime import datetime, timedelta
from flask import request, jsonify
import jwt
from functools import wraps
from config import config

development_config = config['development']()

SECRET_KEY = development_config.SECRET_KEY

def generate_token(official_id):
    payload = {
        'official_id': official_id,
        'exp': datetime.utcnow() + timedelta(days=1),
        "iat": datetime.utcnow()
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    
def required_token(f):
    @wraps(f)
    def decorada(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = verify_token(token)
            if not data:
                return jsonify({'message': 'Invalid token'}), 401
            official_id = data['official_id']
            kwargs['official_id'] = official_id
        except:
            return jsonify({'message': 'Invalidad token or expired!'}), 401
        return f( *args, **kwargs)
    return decorada