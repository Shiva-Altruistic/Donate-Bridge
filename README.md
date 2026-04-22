# DonateBridge

This is a full-stack donation platform I built to connect donors with NGOs and make the donation process more structured and transparent.

The idea was simple — instead of random donations, create a system where donations can be tracked, managed, and distributed properly.

---

## What this project does

Users can:

* Register and login
* Donate to a specific NGO
* Or donate to a general fund
* Track their donation status

Admin can:

* See all donations
* Approve them
* Assign NGOs to general donations

---

## Why I built this

Most donation apps are either too simple or too complex.
I wanted to build something in between — practical, clean, and closer to how real systems work.

---

## Key things I implemented

* JWT-based authentication
* Role-based system (admin + user)
* NGO-based donation system
* General fund donation logic
* Status tracking (Pending → Approved → Completed)
* Dummy payment UI (Razorpay-like)
* Clean dashboard for both user and admin

---

## Something different in this project

One thing I focused on was **how donations are actually handled**.

Instead of just donating blindly:

* Users can choose an NGO
* Or donate to a general pool
* Admin then distributes that properly

This makes it feel more like a real system rather than just a form submission app.

---

## Tech stack

Frontend:

* React (Vite)
* Tailwind CSS

Backend:

* Node.js
* Express
* MongoDB

Other:

* JWT Auth
* REST APIs

---

## How to run this project

Clone the repo:

```bash
git clone https://github.com/shiva-Altruistic/donatebridge.git
cd donatebridge
```

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

---

## Environment variables

Create a `.env` file in backend:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
PORT=5000
```

---

## Notes

* Currency is in ₹ (Indian Rupees)
* Payment is simulated (no real transactions)
* Focus was more on system design than UI complexity

---
<img width="1266" height="667" alt="image" src="https://github.com/user-attachments/assets/e91e27d2-dfe6-42ee-91ca-53c7593572d7" />

## What I learned

* Structuring a full-stack project properly
* Handling real-world flows (not just CRUD)
* Managing roles and permissions
* Keeping things simple without overbuilding

---

## Future improvements

* Real payment integration
* Notifications
* Better analytics
* Mobile version

---

## Author

Sadha Shiva

---

This project was built as part of learning and exploring real-world system design.
