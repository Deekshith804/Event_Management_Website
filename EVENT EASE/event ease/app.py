import os
import time
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS


APP_ROOT = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_folder=APP_ROOT, static_url_path='')
CORS(app)
START_TIME = time.time()

# Demo in-memory stores (replace with a real DB for persistence)
BOOKINGS = []
CONTACTS = []


@app.get('/')
def serve_index():
    return send_from_directory(APP_ROOT, 'index.html')


@app.get('/api/health')
def health():
    return jsonify({
        'ok': True,
        'uptime': round(time.time() - START_TIME, 2)
    })


@app.get('/api/bookings')
def list_bookings():
    return jsonify(BOOKINGS)


@app.post('/api/bookings')
def create_booking():
    data = request.get_json(silent=True) or {}
    category = data.get('category')
    event = data.get('event')
    name = data.get('name')
    email = data.get('email')
    if not all([category, event, name, email]):
        return jsonify({'error': 'Missing required fields'}), 400
    new_id = (BOOKINGS[-1]['id'] + 1) if BOOKINGS else 1
    booking = {
        'id': new_id,
        'category': category,
        'event': event,
        'name': name,
        'email': email,
        'date': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'status': 'confirmed'
    }
    BOOKINGS.append(booking)
    return jsonify(booking), 201


@app.delete('/api/bookings/<int:booking_id>')
def delete_booking(booking_id: int):
    idx = next((i for i, b in enumerate(BOOKINGS) if b['id'] == booking_id), -1)
    if idx == -1:
        return jsonify({'error': 'Not found'}), 404
    BOOKINGS.pop(idx)
    return jsonify({'ok': True})


@app.get('/api/contacts')
def list_contacts():
    return jsonify(CONTACTS)


@app.post('/api/contacts')
def create_contact():
    data = request.get_json(silent=True) or {}
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    if not all([name, email, message]):
        return jsonify({'error': 'Missing required fields'}), 400
    new_id = (CONTACTS[-1]['id'] + 1) if CONTACTS else 1
    contact = {
        'id': new_id,
        'name': name,
        'email': email,
        'message': message,
        'date': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    }
    CONTACTS.append(contact)
    return jsonify(contact), 201


# Serve other static files directly (styles, scripts, etc.)
@app.get('/<path:filepath>')
def serve_static(filepath: str):
    return send_from_directory(APP_ROOT, filepath)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', '5000'))
    app.run(host='0.0.0.0', port=port, debug=True)



