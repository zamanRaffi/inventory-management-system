import sqlite3
from tkinter import *
from tkinter import messagebox

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
        self.root.geometry("600x400")
        self.root.configure(bg="#f2f2f2")

        # Create main frame
        main_frame = Frame(root, bg="#ffffff", padx=20, pady=20)
        main_frame.pack(fill=BOTH, expand=True)

        # Product Entry Section
        entry_frame = Frame(main_frame, bg="#ffffff")
        entry_frame.pack(pady=10)

        Label(entry_frame, text="Product Name:", bg="#ffffff", font=("Arial", 12)).grid(row=0, column=0, sticky=W, padx=5, pady=5)
        self.name_var = StringVar()
        Entry(entry_frame, textvariable=self.name_var, font=("Arial", 12), width=25).grid(row=0, column=1, padx=5, pady=5)

        Label(entry_frame, text="Quantity:", bg="#ffffff", font=("Arial", 12)).grid(row=1, column=0, sticky=W, padx=5, pady=5)
        self.quantity_var = IntVar()
        Entry(entry_frame, textvariable=self.quantity_var, font=("Arial", 12), width=25).grid(row=1, column=1, padx=5, pady=5)

        Label(entry_frame, text="Price:", bg="#ffffff", font=("Arial", 12)).grid(row=2, column=0, sticky=W, padx=5, pady=5)
        self.price_var = DoubleVar()
        Entry(entry_frame, textvariable=self.price_var, font=("Arial", 12), width=25).grid(row=2, column=1, padx=5, pady=5)

        # Buttons Section
        button_frame = Frame(main_frame, bg="#ffffff")
        button_frame.pack(pady=10)

        Button(button_frame, text="Add Product", command=self.add_product, font=("Arial", 12), bg="#4caf50", fg="white").grid(row=0, column=0, padx=10)
        Button(button_frame, text="Update Product", command=self.update_product, font=("Arial", 12), bg="#2196f3", fg="white").grid(row=0, column=1, padx=10)
        Button(button_frame, text="Delete Product", command=self.delete_product, font=("Arial", 12), bg="#f44336", fg="white").grid(row=0, column=2, padx=10)
        Button(button_frame, text="Logout", command=self.logout, font=("Arial", 12), bg="#ff9800", fg="white").grid(row=0, column=3, padx=10)

        # Product List Section
        product_list_frame = Frame(main_frame, bg="#ffffff")
        product_list_frame.pack(fill=BOTH, expand=True, pady=10)

        self.product_list = Listbox(product_list_frame, height=10, width=50, font=("Arial", 12), selectbackground="#03a9f4")
        self.product_list.pack(side=LEFT, fill=BOTH, expand=True)

        self.load_products()

    def clear_fields(self):
        self.name_var.set("")
        self.quantity_var.set(0)
        self.price_var.set(0.0)

    def load_products(self):
        self.product_list.delete(0, END)
        products = self.db.get_all_products()
        for product in products:
            self.product_list.insert(END, f"Name: {product[1]} | Quantity: {product[2]} | Price: ${product[3]:.2f}")

    def add_product(self):
        name = self.name_var.get()
        quantity = self.quantity_var.get()
        price = self.price_var.get()
    
        # Validate quantity
        try:
            quantity = int(quantity)
            if quantity < 0:
                raise ValueError
        except ValueError:
            messagebox.showwarning("Input Error", "Quantity must be a valid non-negative integer.")
            return
    
        # Validate price
        try:
            price = float(price)
            if price < 0:
                raise ValueError
        except ValueError:
            messagebox.showwarning("Input Error", "Price must be a valid positive number.")
            return
    
        if name and quantity >= 0 and price >= 0:
            self.db.add_product(name, quantity, price)
            self.load_products()
            self.clear_fields()
        else:
            messagebox.showwarning("Input Error", "Please provide valid product details.")

    def update_product(self):
        selected_product = self.product_list.curselection()
        if selected_product:
            product_index = selected_product[0]
            product_id = self.db.get_all_products()[product_index][0]
            name = self.name_var.get()
            quantity = self.quantity_var.get()
            price = self.price_var.get()

            # Validate quantity
            try:
                quantity = int(quantity)
                if quantity < 0:
                    raise ValueError
            except ValueError:
                messagebox.showwarning("Input Error", "Quantity must be a valid non-negative integer.")
                return

            # Validate price
            try:
                price = float(price)
                if price < 0:
                    raise ValueError
            except ValueError:
                messagebox.showwarning("Input Error", "Price must be a valid positive number.")
                return
            
            if name:
                self.db.update_product(product_id, name, quantity, price)
                self.load_products()
                self.clear_fields()
            else:
                messagebox.showwarning("Input Error", "Please provide valid product details.")

    def delete_product(self):
        selected_product = self.product_list.curselection()
        if selected_product:
            product_index = selected_product[0]
            product_id = self.db.get_all_products()[product_index][0]
            self.db.remove_product(product_id)
            self.load_products()
            self.clear_fields()

    def logout(self):
        self.root.destroy()
        from admin_login import LoginApp  # Import here to avoid circular import
        login_root = Tk()
        LoginApp(login_root)
        login_root.mainloop()

if __name__ == "__main__":
    root = Tk()
    from admin_login import LoginApp
    LoginApp(root)
    root.mainloop()
