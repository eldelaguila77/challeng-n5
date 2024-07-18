from flask import Flask
from config import config
from flask_mysqldb import MySQL
from flask_cors import CORS
from router import setup_routes

app = Flask(__name__)
CORS(app)

connection = MySQL(app)

setup_routes(app, connection)
    
def not_found_page(error):
    return {'error': 'Not found' + str(error)}, 404

if __name__ == '__main__':
    app.config.from_object(config['development'])
    app.register_error_handler(404, not_found_page)
    app.run(host='0.0.0.0')