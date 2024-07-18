import os

class DevelopmentConfig():
    DEBUG=True
    host='0.0.0.0'
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'db')
    MYSQL_PORT = int(os.getenv('MYSQL_PORT', 3306))
    MYSQL_USER = os.getenv('MYSQL_USER', 'n5_user')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'n5_password')
    MYSQL_DB = os.getenv('MYSQL_DB', 'n5')
    SECRET_KEY = os.getenv('SECRET_KEY', "prueba_secret_key")

config = {
    'development': DevelopmentConfig
}
