import firebase_admin
from firebase_admin import auth, credentials
from flask import request, abort
import os
import json
import logging

# Initialize Firebase Admin SDK (singleton)
if not firebase_admin._apps:
    # Try to load credentials from environment variable first (preferred for production)
    cred_json = os.getenv('FIREBASE_ADMIN_CREDENTIALS_JSON')
    if cred_json:
        try:
            cred_dict = json.loads(cred_json)
            cred = credentials.Certificate(cred_dict)
            logging.info("Firebase credentials loaded from environment variable")
        except json.JSONDecodeError:
            logging.error("Invalid FIREBASE_ADMIN_CREDENTIALS_JSON format")
            raise
    else:
        # Fallback to file path
        cred_path = os.getenv('FIREBASE_ADMIN_CREDENTIALS')
        if not cred_path:
            # Default fallback path (adjusted for Railway's root directory being 'backend/')
            cred_path = 'fatoora-b2d0b-firebase-adminsdk-fbsvc-364c3ffd79.json'
        
        if not os.path.exists(cred_path):
            raise ValueError(f"Firebase credentials file not found at {cred_path}. Please set FIREBASE_ADMIN_CREDENTIALS_JSON environment variable with the credentials JSON content.")
        
        cred = credentials.Certificate(cred_path)
        logging.info(f"Firebase credentials loaded from file: {cred_path}")
    
    firebase_admin.initialize_app(cred)

def verify_firebase_token():
    auth_header = request.headers.get('Authorization', None)
    logging.warning(f"Authorization header: {auth_header}")
    if not auth_header or not auth_header.startswith('Bearer '):
        logging.error("Missing or invalid Authorization header")
        abort(401, 'Missing or invalid Authorization header')
    id_token = auth_header.split(' ')[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        logging.warning(f"Decoded Firebase token: {decoded_token}")
        return decoded_token
    except Exception as e:
        logging.error(f"Invalid Firebase token: {str(e)}")
        abort(401, f'Invalid Firebase token: {str(e)}') 