import os
import logging
import json
import traceback
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth
from werkzeug.utils import secure_filename

from algorithms.search import search
from algorithms.sort import sort
from algorithms.queue import Queue
from algorithms.binarytree import BinaryTree

# Load env variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv("SECRET_KEY", "fallback_secret")
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
logging.basicConfig(level=logging.DEBUG)

# Firebase initialization
firebase_config_json = os.getenv('FIREBASE_CONFIG')
if not firebase_config_json:
    raise Exception("FIREBASE_CONFIG environment variable is missing")




print("FIREBASE_CONFIG:", os.getenv("FIREBASE_CONFIG")[:200])

firebase_config = json.loads(firebase_config_json)
firebase_config['private_key'] = firebase_config['private_key'].replace('\\n', '\n')

if not firebase_admin._apps:
    cred = credentials.Certificate(firebase_config)
    firebase_admin.initialize_app(cred)

# MongoDB connection
try:
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise ValueError("Missing MONGO_URI")
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    client.server_info()
    db = client["dsa_manager"]
    users_collection = db["users"]
    print("✅ Connected to MongoDB Atlas")
except Exception as e:
    print(f"❌ MongoDB connection error: {e}")
    users_collection = None

# Queue instance
queue_instance = Queue()

# Firebase Signup Route
@app.route('/firebase-signup', methods=['POST'])
def firebase_signup():
    if users_collection is None:
        return jsonify({'message': 'Database not connected'}), 500

    try:
        data = request.get_json()
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        uid = data.get('uid')

        if not all([first_name, last_name, email, uid]):
            return jsonify({'message': 'All fields are required'}), 400

        if users_collection.find_one({'email': email}):
            return jsonify({'message': 'User already exists'}), 409

        users_collection.insert_one({
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'uid': uid
        })
        return jsonify({'message': 'User data saved successfully'}), 201

    except Exception as e:
        app.logger.error("Signup error:\n%s", traceback.format_exc())
        return jsonify({'message': 'Signup failed'}), 500

# Firebase Login Route
@app.route('/login', methods=['POST'])
def login():
    if users_collection is None:
        return jsonify({'message': 'Database not connected'}), 500

    try:
        id_token = request.headers.get('Authorization', '').split('Bearer ')[-1]
        decoded_token = auth.verify_id_token(id_token)
        email = decoded_token.get('email')

        user = users_collection.find_one({'email': email})
        if user:
            return jsonify({
                'first_name': user.get('first_name'),
                'last_name': user.get('last_name'),
                'email': user.get('email'),
                'profile_photo': user.get('profile_photo', '')
            }), 200
        else:
            return jsonify({'message': 'User profile not found'}), 404

    except Exception as e:
        print("Login error:", e)
        return jsonify({'message': 'Invalid or expired token'}), 401

# ✅ New: Get User Info by Email
@app.route('/userinfo', methods=['GET'])
def get_user_info():
    if users_collection is None:
        return jsonify({'message': 'Database not connected'}), 500

    try:
        email = request.args.get('email')
        if not email:
            return jsonify({'message': 'Email parameter is required'}), 400

        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'message': 'User not found'}), 404

        return jsonify({
            'first_name': user.get('first_name', ''),
            'last_name': user.get('last_name', ''),
            'user_id': str(user.get('_id')),
            'profile_photo': user.get('profile_photo', '')
        }), 200

    except Exception as e:
        print("User info error:", e)
        return jsonify({'message': 'Internal server error'}), 500

# ✅ New: Upload profile photo
@app.route('/upload-profile-photo', methods=['POST'])
def upload_profile_photo():
    if users_collection is None:
        return jsonify({'message': 'Database not connected'}), 500

    try:
        if 'file' not in request.files or 'email' not in request.form:
            return jsonify({'message': 'Missing file or email'}), 400

        file = request.files['file']
        email = request.form['email']
        if file.filename == '':
            return jsonify({'message': 'No selected file'}), 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        image_url = f"http://localhost:5000/uploads/{filename}"

        users_collection.update_one({'email': email}, {'$set': {'profile_photo': image_url}})
        return jsonify({'status': 'success', 'url': image_url}), 200

    except Exception as e:
        app.logger.error("Photo upload error:\n%s", traceback.format_exc())
        return jsonify({'message': 'Image upload failed'}), 500

# ✅ New: Serve uploaded images
@app.route('/uploads/<filename>')
def serve_uploaded_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Placeholder routes for algorithms
# (Include your search, sort, queue, binary tree routes here)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
