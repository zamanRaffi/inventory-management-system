# Function to hash passwords for secure storage
import hashlib

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()