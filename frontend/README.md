# The Kenyan Locksmith
***The Kenyan Locksmith*** is a website designed to showcase premium door locks and handles for homes and offices in Kenya. we focus on style and quality.
## Problem statement
Many customers in Kenya find it hard to get specialized door locks online. Most shops only sell general hardware and customers cannot easily view products or contact the company. Specialized shops mainly rely on Facebook and physical stores.
## solution
With The Kenyan Locksmith website, customers can now;
- view locks with name, image, price, and series
- filter, search, and sort the catalogue
- open a product page
- add items to a cart that survives refresh
- check out with a simulated order (pickup or delivery)
- register / login before checkout
- send a contact enquiry

## Features
### 1. Catalogue
- Products loaded with `fetch` from `GET /api/products`
- Cards show name, image, price, series
- Filter by series (Wood, Metallic, Leather, Grand, Villa, Smart)
- Search by name or SKU
- Sort by price or name
- In stock / sold out
- Home featured grid
- Product detail:
- Home “View” and footer series links:
### 2. Cart
- Add to cart from the grid and from the detail page
- Bag icon shows item count
- Drawer: line items, + / −, remove, subtotal
- Cart saved in `localStorage`
- Spend rules (shown in the drawer, offer line, and checkout):
  - KSh 50,000+ → free delivery in Nairobi
  - KSh 100,000+ → 5% off and free Nairobi delivery

### 3. Checkout (simulated)
- `checkout.html`: products, totals, pickup or deliver
- Deliver + Nairobi + 50k+ → delivery fee 0
- Totals are recalculated from the cart (not typed in by the user)
- Place order clears the cart and stores `lastOrder`
- Success / empty-cart messages are coloured

### Auth 4. (simulated)
- `login.html`: register (email, password, confirm password) and login
- Users stored in `localStorage`
- Email and password must match with `===`
- Separate errors: email not registered vs wrong password
- Checkout redirects to login if there is no `currentUser`

### 5. Contact
- Name, email, phone, subject, comment
- Validation and blocked submit when invalid
- “Sending…” then save enquiry in `localStorage`

### 6. Site tools
- Header search → `ourproducts.html?search=...`
- Country select: Kenya, Uganda, Tanzania (saved; prices stay in KSh)
- Dark / light theme saved in `localStorage`
- Cookie banner: Accept or Deny
- Open / closed hours on Contact (Mon–Sat 07:00–18:00 EAT)

### File structure
```
index.html
about.html
ourproducts.html
contact.html
images/
```

### Installation setup
To run this project
``` 
git clone https://github.com/JohnnyKhayo/locksmith.git
```
*right click* and **open live server** or ***go live***

### How the project looks like 

![Home page screenshot](/images/locksmith.readme.png)

### Collaborate and contribution
For anyone intrested in contributing and collaborating to this project. Please feel free and follow the steps below.
1. Clone the project
``` 
git clone https://github.com/JohnnyKhayo/locksmith.git
```
2. Make a pull request
3. Document the contribution as an issue

#### License
This project was created and build by @JohnnyKhayo under MIT license. 
