# admin_login.py
import sqlite3
from tkinter import *
from tkinter import messagebox
from ttkbootstrap import Style  # Import ttkbootstrap style
import ttkbootstrap as ttk
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
        new_temp_password = "temp1234"  # Generate a temporary password
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

        # Apply the ttkbootstrap style
        self.style = Style(theme='darkly')  # You can choose other themes

        frame = Frame(self.root, bg="#2c3e50", padx=20, pady=20)
        frame.pack(expand=True)

        Label(frame, text="Inventory Management System", font=("Arial", 32, "bold"), fg="orange", bg="#2c3e50").pack(pady=10)
        Label(frame, text="Username", font=("Arial", 12), fg="white", bg="#2c3e50").pack(anchor="w", pady=5)
        self.username_entry = Entry(frame, font=("Arial", 12), width=70)
        self.username_entry.pack(pady=5)

        Label(frame, text="Password", font=("Arial", 12), fg="white", bg="#2c3e50").pack(anchor="w", pady=5)
        self.password_entry = Entry(frame, font=("Arial", 12), show="*", width=70)
        self.password_entry.pack(pady=5)

        # Create a frame for buttons to align them side by side
        button_frame = Frame(frame, bg="#2c3e50")
        button_frame.pack(pady=10)

        # Styling the buttons with ttkbootstrap and adding a border radius
        signin_button = ttk.Button(button_frame,text="Signin", command=self.login, bootstyle="success", width=15)
        signin_button.pack(side=LEFT, padx=(0, 10))  # Right padding for gap

        lost_password_button = ttk.Button(button_frame, text="Lost Password", command=self.lost_password, bootstyle="danger", width=15)
        lost_password_button.pack(side=RIGHT, padx=(10, 0))  # Left padding for gap

        signup_button = ttk.Button(frame, text="Signup", command=self.signup, bootstyle="primary", width=30)
        signup_button.pack(pady=(5, 0))  # Top padding for space between buttons

    def login(self):
        username = self.username_entry.get()
        password = hash_password(self.password_entry.get())
        if self.db.login(username, password):
            self.open_inventory_window()
        else:
            messagebox.showwarning("Error", "Invalid username or password.")

    def signup(self):
        username = self.username_entry.get()
        password = hash_password(self.password_entry.get())
        self.db.signup(username, password)

    def lost_password(self):
        username = self.username_entry.get()
        if not username:
            messagebox.showwarning("Error", "Please enter your username.")
            return

        self.db.cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        if self.db.cursor.fetchone():
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
    root = ttk.Window()  
    app = LoginApp(root)
    root.mainloop()
