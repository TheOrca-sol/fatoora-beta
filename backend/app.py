import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate
from database import db

# Load environment variables from .env file in backend directory
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'), override=True)

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize CORS with explicit domains
    CORS(app, origins=[
        'http://localhost:5173', 
        'https://*.vercel.app', 
        'https://*.netlify.app',
        'https://fatoora-beta.vercel.app',  # Explicit domain
        'https://fatoora-beta-production.up.railway.app'  # Self-reference for testing
    ])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Import models WITHIN app context to avoid circular imports
    with app.app_context():
        from models import user, team, teammembership, client, invoice, invoice_item
        
        # Create tables if they don't exist (for development)
        db.create_all()

    # Import routes AFTER models are loaded
    from routes.auth import auth_bp
    from routes.clients import clients_bp
    from routes.invoices import invoices_bp
    from routes.dashboard import dashboard_bp
    from routes.export import export_bp
    from routes.teams import teams_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(clients_bp, url_prefix='/api/clients')
    app.register_blueprint(invoices_bp, url_prefix='/api/invoices')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(export_bp, url_prefix='/api/export')
    app.register_blueprint(teams_bp, url_prefix='/api/teams')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

# To run migrations:
# flask db init
# flask db migrate -m "Initial migration."
# flask db upgrade
