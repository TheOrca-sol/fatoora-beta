import firebase_admin
from firebase_admin import auth, credentials
from flask import request, abort
import os
import json
import logging

# Initialize Firebase Admin SDK (singleton)
if not firebase_admin._apps:
    # Try to load credentials from environment variable first
    cred_json = os.getenv('FIREBASE_ADMIN_CREDENTIALS_JSON')
    if cred_json:
        try:
            cred_dict = json.loads(cred_json)
            cred = credentials.Certificate(cred_dict)
        except json.JSONDecodeError:
            logging.error("Invalid FIREBASE_ADMIN_CREDENTIALS_JSON format")
            raise
    else:
        # Fallback to file path
        cred_path = os.getenv('FIREBASE_ADMIN_CREDENTIALS')
        if not cred_path:
            raise ValueError("Either FIREBASE_ADMIN_CREDENTIALS_JSON or FIREBASE_ADMIN_CREDENTIALS must be set")
        cred = credentials.Certificate(cred_path)
    
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