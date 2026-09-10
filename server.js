const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());
// Serve frontend files
app.use(express.static(__dirname));

// Utility to read DB
const readDB = () => {
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
};

// Utility to write DB
const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// GET all events
app.get('/api/events', (req, res) => {
  const db = readDB();
  res.json(db.events);
});

// GET all bookings (Admin only, but open for this assignment)
app.get('/api/bookings', (req, res) => {
  const db = readDB();
  res.json(db.bookings);
});

// POST a new booking
app.post('/api/bookings', (req, res) => {
  const db = readDB();
  const booking = req.body;
  
  // Update event seats
  const eventIndex = db.events.findIndex(e => e.id === booking.eventId);
  if (eventIndex !== -1) {
    db.events[eventIndex].booked += 1;
  }
  
  db.bookings.push(booking);
  writeDB(db);
  res.status(201).json({ success: true, booking });
});

// POST to cancel a booking
app.post('/api/bookings/cancel', (req, res) => {
  const db = readDB();
  const { id } = req.body;
  
  const bookingIndex = db.bookings.findIndex(b => b.id === id);
  if (bookingIndex === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }
  
  const booking = db.bookings[bookingIndex];
  
  // Free up the seat
  const eventIndex = db.events.findIndex(e => e.id === booking.eventId);
  if (eventIndex !== -1) {
    db.events[eventIndex].booked = Math.max(0, db.events[eventIndex].booked - 1);
  }
  
  db.bookings.splice(bookingIndex, 1);
  writeDB(db);
  res.json({ success: true });
});

// POST to submit transaction ID (Student)
app.post('/api/bookings/submit-txn', (req, res) => {
  const db = readDB();
  const { regNumber, txnId } = req.body;
  
  const userBookings = db.bookings.filter(b => b.regNumber === regNumber && !b.paid && b.fee > 0);
  if (userBookings.length === 0) {
    return res.status(404).json({ error: "No pending paid bookings found for this Registration Number." });
  }
  
  userBookings.forEach(b => {
    b.txnId = txnId; // Store the txnId but keep paid=false until admin verifies
  });
  
  writeDB(db);
  res.json({ success: true, count: userBookings.length });
});

// POST to approve/verify payment (Admin)
app.post('/api/bookings/verify', (req, res) => {
  const db = readDB();
  const { regNumber, txnId } = req.body;
  
  const userBookings = db.bookings.filter(b => b.regNumber === regNumber && !b.paid);
  if (userBookings.length === 0) {
    return res.status(404).json({ error: "No pending payments found for this Registration Number." });
  }
  
  userBookings.forEach(b => {
    b.paid = true;
    b.txnId = txnId || "ADMIN-APPROVED";
  });
  
  writeDB(db);
  res.json({ success: true, count: userBookings.length });
});

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`Otaku Club Booking System is Running!`);
  console.log(`========================================`);
  console.log(`> Student Website: http://localhost:${PORT}`);
  console.log(`> Admin Dashboard: http://localhost:${PORT}/admin.html\n`);
});
