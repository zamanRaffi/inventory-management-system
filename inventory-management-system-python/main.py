import sqlite3
from tkinter import *
from tkinter import messagebox
import ttkbootstrap as ttk
from ttkbootstrap.constants import *

class AdminDB:
    def __init__(self, db_name="inventory.db"):
        self.connection = sqlite3.connect(db_name)
        self.cursor = self.connection.cursor()
        self.create_inventory_table()

    def create_inventory_table(self):
        self.cursor.execute("""CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL
        )""")
        self.connection.commit()

    def add_product(self, name, quantity, price):
        self.cursor.execute("INSERT INTO inventory (name, quantity, price) VALUES (?, ?, ?)", (name, quantity, price))
        self.connection.commit()

    def remove_product(self, product_id):
        self.cursor.execute("DELETE FROM inventory WHERE id = ?", (product_id,))
        self.connection.commit()

    def update_product(self, product_id, name, quantity, price):
        self.cursor.execute("UPDATE inventory SET name = ?, quantity = ?, price = ? WHERE id = ?", (name, quantity, price, product_id))
        self.connection.commit()

    def get_all_products(self):
        self.cursor.execute("SELECT * FROM inventory")
        return self.cursor.fetchall()

    def __del__(self):
        self.connection.close()

class InventoryApp:
    def __init__(self, root):
        self.db = AdminDB()
        self.root = root
        self.root.title("Inventory Management System")
        self.root.geometry("700x500")
        self.root.configure(bg="#f2f2f2")

        # Apply the ttkbootstrap style
        self.style = ttk.Style(theme='darkly')

        # Create main frame
        main_frame = ttk.Frame(root, padding=(20, 10))
        main_frame.pack(fill=BOTH, expand=True)

        # Product Entry Section
        entry_frame = ttk.Frame(main_frame)
        entry_frame.pack(pady=10)

        ttk.Label(entry_frame, text="Product Name:", font=("Arial", 12)).grid(row=0, column=0, sticky=W, padx=5, pady=5)
        self.name_var = StringVar()
        ttk.Entry(entry_frame, textvariable=self.name_var, font=("Arial", 12), width=25).grid(row=0, column=1, padx=5, pady=5)

        ttk.Label(entry_frame, text="Quantity:", font=("Arial", 12)).grid(row=1, column=0, sticky=W, padx=5, pady=5)
        self.quantity_var = IntVar()
        ttk.Entry(entry_frame, textvariable=self.quantity_var, font=("Arial", 12), width=25).grid(row=1, column=1, padx=5, pady=5)

        ttk.Label(entry_frame, text="Price:", font=("Arial", 12)).grid(row=2, column=0, sticky=W, padx=5, pady=5)
        self.price_var = DoubleVar()
        ttk.Entry(entry_frame, textvariable=self.price_var, font=("Arial", 12), width=25).grid(row=2, column=1, padx=5, pady=5)

        # Buttons Section
        button_frame = ttk.Frame(main_frame)
        button_frame.pack(pady=10)

        ttk.Button(button_frame, text="Add Product", command=self.add_product, bootstyle="success", width=15).grid(row=0, column=0, padx=10)
        ttk.Button(button_frame, text="Update Product", command=self.update_product, bootstyle="info", width=15).grid(row=0, column=1, padx=10)
        ttk.Button(button_frame, text="Delete Product", command=self.delete_product, bootstyle="danger", width=15).grid(row=0, column=2, padx=10)
        ttk.Button(button_frame, text="Logout", command=self.logout, bootstyle="warning", width=15).grid(row=0, column=3, padx=10)

        # Product List Section (Table)
        columns = ("id", "name", "quantity", "price")
        self.product_table = ttk.Treeview(main_frame, columns=columns, show="headings", height=10)
        self.product_table.heading("id", text="ID")
        self.product_table.heading("name", text="Product Name")
        self.product_table.heading("quantity", text="Quantity")
        self.product_table.heading("price", text="Price ($)")
        self.product_table.column("id", width=0, stretch=NO)  # Hide ID column
        self.product_table.column("name", anchor=W, width=200)
        self.product_table.column("quantity", anchor=CENTER, width=100)
        self.product_table.column("price", anchor=CENTER, width=100)
        self.product_table.pack(fill=BOTH, expand=True)

        # Load products from database
        self.load_products()

        # Add scrollbar to the table
        scrollbar = ttk.Scrollbar(main_frame, orient=VERTICAL, command=self.product_table.yview)
        self.product_table.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side=RIGHT, fill=Y)

    def clear_fields(self):
        self.name_var.set("")
        self.quantity_var.set("")
        self.price_var.set("")

    def load_products(self):
        for row in self.product_table.get_children():
            self.product_table.delete(row)

        products = self.db.get_all_products()
        for product in products:
            self.product_table.insert("", END, values=product)

    def add_product(self):
        name = self.name_var.get()
        quantity = self.quantity_var.get()
        price = self.price_var.get()

        if not name or quantity <= 0 or price <= 0:
            messagebox.showwarning("Input Error", "Please provide valid product details.")
            return

        self.db.add_product(name, quantity, price)
        self.load_products()
        self.clear_fields()

    def update_product(self):
        selected_item = self.product_table.selection()
        if selected_item:
            item = self.product_table.item(selected_item)
            product_id, _, _, _ = item["values"]
            name = self.name_var.get()
            quantity = self.quantity_var.get()
            price = self.price_var.get()

            if name and quantity > 0 and price > 0:
                self.db.update_product(product_id, name, quantity, price)
                self.load_products()
                self.clear_fields()
            else:
                messagebox.showwarning("Input Error", "Please provide valid product details.")
        else:
            messagebox.showwarning("Selection Error", "Please select a product to update.")

    def delete_product(self):
        selected_item = self.product_table.selection()
        if selected_item:
            item = self.product_table.item(selected_item)
            product_id, _, _, _ = item["values"]
            self.db.remove_product(product_id)
            self.load_products()
            self.clear_fields()
        else:
            messagebox.showwarning("Selection Error", "Please select a product to delete.")

    def logout(self):
        self.root.destroy()
        from admin_login import LoginApp
        login_root = Tk()
        LoginApp(login_root)
        login_root.mainloop()

if __name__ == "__main__":
    root = ttk.Window()
    root.title("Login")
    from admin_login import LoginApp
    app = LoginApp(root)
    root.mainloop()
