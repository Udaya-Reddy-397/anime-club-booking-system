# 御宅 Otaku Anime Club — VIT Bhopal

Terminal-style event booking website for the **Otaku Anime Club** at **VIT Bhopal**.

## Features

- **Terminal / CRT aesthetic** — green-on-black, monospace, scanlines, boot log
- **Anime-themed events** — screenings, cosplay, quiz, workshops, meetups
- **Registration form** — Name, Registration No, Email, Phone, Event, Year/Branch, Favourite Anime
- **Real UPI payment** — Scan the provided Paytm QR or pay to `8637288493@ptyes`
- **My Bookings** — lookup by Registration Number + cancel
- **Seat tracking** + duplicate prevention
- **Localhost ready** — Node.js Express backend, data in `db.json`

## Run

```bash
npm install
node server.js
```

### Accessing the Application

- **Student Website**: [http://localhost:8080](http://localhost:8080) (Book events, view bookings, submit transaction IDs)
- **Admin Dashboard**: [http://localhost:8080/admin.html](http://localhost:8080/admin.html) (View all bookings, verify payments, manage events)

## Payment

- QR code is in `assets/qr-code.png` (Paytm UPI)
- UPI ID: **8637288493@ptyes**
- Users can choose “Pay now via UPI” or “Pay later / Free”
- After scanning & paying, they can optionally enter Transaction ID on the Payment tab

## Sample Events

| Event | Category | Fee |
|-------|----------|-----|
| Attack on Titan Final Season Screening | Screening | Free |
| Cosplay Meet & Photoshoot | Cosplay | ₹50 |
| Anime Quiz Championship | Quiz | ₹30 |
| Manga Drawing Workshop | Workshop | Free |
| Jujutsu Kaisen Watch Party | Screening | Free |
| Otaku Social & Karaoke Night | Meetup | ₹40 |
| One Piece Treasure Hunt | Meetup | ₹20 |
| Voice Acting Workshop | Workshop | Free (Full) |

## Reset data

To reset data, open `db.json` and clear the `bookings` array, or reset the `booked` counts for events, then restart the server.

---

御宅 Otaku Anime Club · VIT Bhopal · localhost
