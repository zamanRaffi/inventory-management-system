# admin_login.py
import sqlite3
from tkinter import *
from tkinter import messagebox
from utils import hash_password

class InventoryDB:
    def __init__(self, db_name="inventory.db"):
        self.connection = sqlite3.connect(db_name)
        self.cursor = self.connection.cursor()
        self.create_users_table()

    def create_users_table(self):
        self.cursor.execute("""CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )""")
        self.connection.commit()

    def signup(self, username, password):
        try:
            self.cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
            self.connection.commit()
            messagebox.showinfo("Success", "Account created successfully!")
        except sqlite3.IntegrityError:
            messagebox.showwarning("Error", "Username already exists.")

    def login(self, username, password):
        self.cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
        return self.cursor.fetchone() is not None

    def reset_password(self, username):
        """Reset the user's password to a temporary one."""
        new_temp_password = "temp1234"  # Generate a temporary password (in a real app, make this random)
        hashed_password = hash_password(new_temp_password)
        self.cursor.execute("UPDATE users SET password = ? WHERE username = ?", (hashed_password, username))
        self.connection.commit()
        return new_temp_password  # Return the temporary password for display

    def __del__(self):
        self.connection.close()

class LoginApp:
    def __init__(self, root):
        self.db = InventoryDB()
        self.root = root
        self.root.title("Admin Login")
        self.root.geometry("400x400")
        self.root.configure(bg="#2c3e50")

        frame = Frame(self.root, bg="#2c3e50", padx=20, pady=20)
        frame.pack(expand=True)

        Label(frame, text="Inventory Management System", font=("Arial", 20, "bold"), fg="orange", bg="#2c3e50").pack(pady=10)
        Label(frame, text="Username", font=("Arial", 12), fg="white", bg="#2c3e50").pack(anchor="w", pady=5)
        self.username_entry = Entry(frame, font=("Arial", 12), width=30)
        self.username_entry.pack(pady=5)

        Label(frame, text="Password", font=("Arial", 12), fg="white", bg="#2c3e50").pack(anchor="w", pady=5)
        self.password_entry = Entry(frame, font=("Arial", 12), show="*", width=30)
        self.password_entry.pack(pady=5)

        Button(frame, text="Signin", command=self.login, font=("Arial", 12), bg="#4caf50", fg="white").pack(pady=10)
        Button(frame, text="Signup", command=self.signup, font=("Arial", 12), bg="#2196f3", fg="white").pack(pady=5)
        Button(frame, text="Lost Password", command=self.lost_password, font=("Arial", 12), bg="#ff5722", fg="white").pack(pady=5)

    def login(self):
        username = self.username_entry.get()
        password = hash_password(self.password_entry.get())
        if self.db.login(username, password):
            messagebox.showinfo("Success", "Login successful!")
            self.open_inventory_window()
        else:
            messagebox.showwarning("Error", "Invalid username or password.")

    def signup(self):
        username = self.username_entry.get()
        password = hash_password(self.password_entry.get())
        self.db.signup(username, password)

    def lost_password(self):
        """Handles the 'Lost Password' functionality."""
        username = self.username_entry.get()
        if not username:
            messagebox.showwarning("Error", "Please enter your username.")
            return

        # Check if the username exists
        self.db.cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        if self.db.cursor.fetchone():
            # Reset password and inform the user
            new_password = self.db.reset_password(username)
            messagebox.showinfo("Password Reset", f"Your temporary password is: {new_password}\nPlease change it after logging in.")
        else:
            messagebox.showwarning("Error", "Username not found.")

    def open_inventory_window(self):
        self.root.destroy()
        from main import InventoryApp  # Import here to avoid circular import
        inventory_root = Tk()
        InventoryApp(inventory_root)
        inventory_root.mainloop()

if __name__ == "__main__":
    root = Tk()
    app = LoginApp(root)
    root.mainloop()
