/* ===== OTAKU ANIME CLUB — VIT BHOPAL ===== */

const DEFAULT_EVENTS = [
  {
    id: "evt-001",
    title: "Attack on Titan Final Season Screening",
    category: "screening",
    icon: "⚔️",
    date: "2026-09-20",
    time: "6:00 PM – 9:30 PM",
    venue: "AB-1 Auditorium, VIT Bhopal",
    seats: 120,
    booked: 47,
    fee: 0,
    description: "Marathon screening of Attack on Titan Final Season. Free entry for club members. Snacks available. Come early for good seats, senpai!"
  },
  {
    id: "evt-002",
    title: "Cosplay Meet & Photoshoot",
    category: "cosplay",
    icon: "🎭",
    date: "2026-09-25",
    time: "3:00 PM – 6:00 PM",
    venue: "Open Ground near AB-2",
    seats: 50,
    booked: 28,
    fee: 50,
    description: "Dress as your favourite character! Group photos, mini contest & social. Best cosplay wins merch. Fee covers photo prints."
  },
  {
    id: "evt-003",
    title: "Anime Quiz Championship",
    category: "quiz",
    icon: "🧠",
    date: "2026-09-28",
    time: "4:00 PM – 6:30 PM",
    venue: "Seminar Hall, Academic Block",
    seats: 80,
    booked: 61,
    fee: 30,
    description: "Test your otakuness! Solo & team rounds covering classics to new-gen. Prizes for top 3. Registration includes quiz booklet."
  },
  {
    id: "evt-004",
    title: "Manga Drawing Workshop",
    category: "workshop",
    icon: "✏️",
    date: "2026-10-03",
    time: "2:00 PM – 5:00 PM",
    venue: "Design Studio, VIT Bhopal",
    seats: 30,
    booked: 11,
    fee: 0,
    description: "Learn manga paneling, character design & inking basics. Materials provided. Beginners welcome. Bring your sketchbook if you have one."
  },
  {
    id: "evt-005",
    title: "Jujutsu Kaisen Watch Party",
    category: "screening",
    icon: "👁️",
    date: "2026-10-08",
    time: "7:00 PM – 10:00 PM",
    venue: "AB-1 Auditorium",
    seats: 100,
    booked: 34,
    fee: 0,
    description: "Shibuya Incident arc watch party with live reactions. Free entry. Limited merch giveaway for early birds."
  },
  {
    id: "evt-006",
    title: "Otaku Social & Karaoke Night",
    category: "meetup",
    icon: "🎤",
    date: "2026-10-12",
    time: "5:30 PM – 9:00 PM",
    venue: "Student Activity Centre",
    seats: 70,
    booked: 22,
    fee: 40,
    description: "Sing anime OP/ED, play games, meet fellow otakus. Fee covers snacks & soft drinks. All years welcome!"
  },
  {
    id: "evt-007",
    title: "One Piece Treasure Hunt",
    category: "meetup",
    icon: "🏴‍☠️",
    date: "2026-10-18",
    time: "10:00 AM – 1:00 PM",
    venue: "Campus Grounds",
    seats: 60,
    booked: 15,
    fee: 20,
    description: "Solve riddles across campus like a true Straw Hat. Teams of 3–5. Grand Prize for the crew that finds the One Piece!"
  },
  {
    id: "evt-008",
    title: "Voice Acting Workshop",
    category: "workshop",
    icon: "🎙️",
    date: "2026-10-22",
    time: "3:00 PM – 5:30 PM",
    venue: "Media Lab",
    seats: 25,
    booked: 25,
    fee: 0,
    description: "Intro to seiyuu techniques, character voices & dubbing basics. Fully booked — waitlist only."
  }
];

let events = [];
let bookings = [];
let currentFilter = "all";

async function init() {
  await loadData();
  renderFeatured();
  renderAllEvents();
  populateEventSelect();
  updateStats();
  setupFilters();
  setupForm();
  setupMobile();
}

async function loadData() {
  try {
    const resEvents = await fetch('/api/events');
    events = await resEvents.json();
    
    const resBookings = await fetch('/api/bookings');
    bookings = await resBookings.json();
  } catch (err) {
    console.error("Failed to fetch API:", err);
    events = JSON.parse(JSON.stringify(DEFAULT_EVENTS));
    bookings = [];
  }
}

/* Boot log typing */
function typeBootLog() {
  const lines = [
    "> Initializing Otaku Anime Club systems...",
    "> Loading VIT Bhopal student database... OK",
    "> Connecting UPI gateway... OK",
    "> Events module ready. Welcome, senpai."
  ];
  const el = document.getElementById("bootLog");
  let i = 0;
  function next() {
    if (i < lines.length) {
      el.textContent += (i ? "\n" : "") + lines[i];
      i++;
      setTimeout(next, 280);
    }
  }
  next();
}

/* Navigation */
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.section === id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (id === "register") populateEventSelect();
}

function setupMobile() {
  document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.toggle("open");
  });
}
function closeMobile() {
  document.getElementById("mobileMenu").classList.remove("open");
}

/* Helpers */
function formatDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric"
  });
}

function seatsInfo(e) {
  const left = e.seats - e.booked;
  if (left <= 0) return { text: "FULLY BOOKED", cls: "full" };
  if (left <= 8) return { text: left + " seats left", cls: "limited" };
  return { text: left + " seats available", cls: "available" };
}

function feeText(fee) {
  return fee > 0 ? "₹" + fee : "FREE";
}

function createCard(e) {
  const s = seatsInfo(e);
  const full = e.booked >= e.seats;
  return `
    <article class="event-card" data-category="${e.category}">
      <div class="event-banner">
        <span class="event-cat">${e.category}</span>
        <span class="event-fee">${feeText(e.fee)}</span>
        ${e.icon}
      </div>
      <div class="event-body">
        <h3 class="event-title">${e.title}</h3>
        <div class="event-meta">
          📅 ${formatDate(e.date)}<br>
          🕐 ${e.time}<br>
          📍 ${e.venue}
        </div>
        <p class="event-desc">${e.description}</p>
        <div class="event-footer">
          <span class="seats ${s.cls}">${s.text}</span>
          <div style="display:flex;gap:0.35rem;">
            <button class="btn btn-sm" onclick="openModal('${e.id}')">[INFO]</button>
            ${!full ? `<button class="btn btn-sm btn-accent" onclick="quickReg('${e.id}')">[JOIN]</button>` : ""}
          </div>
        </div>
      </div>
    </article>`;
}

function renderFeatured() {
  const list = events
    .filter(e => e.booked < e.seats)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);
  document.getElementById("featuredEvents").innerHTML =
    list.map(createCard).join("") || "<pre>> No open events right now.</pre>";
}

function renderAllEvents() {
  let list = currentFilter === "all" ? events : events.filter(e => e.category === currentFilter);
  list = [...list].sort((a, b) => a.date.localeCompare(b.date));
  const grid = document.getElementById("allEvents");
  const empty = document.getElementById("eventsEmpty");
  if (!list.length) {
    grid.innerHTML = "";
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
    grid.innerHTML = list.map(createCard).join("");
  }
}

function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderAllEvents();
    });
  });
}

function updateStats() {
  document.getElementById("statEvents").textContent =
    events.filter(e => e.booked < e.seats).length;
  document.getElementById("statBookings").textContent = bookings.length;
}

/* Modal */
function openModal(id) {
  const e = events.find(x => x.id === id);
  if (!e) return;
  const s = seatsInfo(e);
  const full = e.booked >= e.seats;
  document.getElementById("modalBody").innerHTML = `
    <div class="modal-banner">${e.icon}</div>
    <h3>${e.title}</h3>
    <div class="modal-meta">
      📅 ${formatDate(e.date)} · 🕐 ${e.time}<br>
      📍 ${e.venue}<br>
      💰 Fee: <strong>${feeText(e.fee)}</strong>
    </div>
    <p class="modal-desc">${e.description}</p>
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
      <span class="seats ${s.cls}">${s.text}</span>
      ${!full
        ? `<button class="btn btn-accent" onclick="closeModal();quickReg('${e.id}')">[REGISTER]</button>`
        : `<span class="seats full">REGISTRATION CLOSED</span>`}
    </div>`;
  document.getElementById("eventModal").classList.add("open");
}

function closeModal() {
  document.getElementById("eventModal").classList.remove("open");
}

document.getElementById("eventModal").addEventListener("click", e => {
  if (e.target.id === "eventModal") closeModal();
});

/* Registration */
function populateEventSelect() {
  const sel = document.getElementById("eventSelect");
  const open = events.filter(e => e.booked < e.seats).sort((a, b) => a.date.localeCompare(b.date));
  sel.innerHTML = `<option value="">— choose event —</option>` +
    open.map(e =>
      `<option value="${e.id}">${e.title} · ${formatDate(e.date)} · ${feeText(e.fee)} (${e.seats - e.booked} left)</option>`
    ).join("");
}

function quickReg(id) {
  showSection("register");
  document.getElementById("eventSelect").value = id;
  setTimeout(() => document.getElementById("registrationForm").scrollIntoView({ behavior: "smooth" }), 80);
}

function setupForm() {
  document.getElementById("registrationForm").addEventListener("submit", handleSubmit);
}

function clearErrors() {
  ["errName","errReg","errEmail","errPhone","errEvent","errAgree"].forEach(id => {
    document.getElementById(id).textContent = "";
  });
}

function validate(data) {
  clearErrors();
  let ok = true;
  if (!data.fullName || data.fullName.length < 2) {
    document.getElementById("errName").textContent = "> Name required (min 2 chars)";
    ok = false;
  }
  if (!data.regNumber || data.regNumber.length < 4) {
    document.getElementById("errReg").textContent = "> Valid registration number required";
    ok = false;
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    document.getElementById("errEmail").textContent = "> Valid email required";
    ok = false;
  }
  const ph = (data.phone || "").replace(/[\s\-()]/g, "");
  if (!ph || ph.length < 10) {
    document.getElementById("errPhone").textContent = "> Valid phone required";
    ok = false;
  }
  if (!data.eventSelect) {
    document.getElementById("errEvent").textContent = "> Select an event";
    ok = false;
  }
  if (!data.agree) {
    document.getElementById("errAgree").textContent = "> You must confirm";
    ok = false;
  }
  return ok;
}

function genId() {
  return "OTK-" + Date.now().toString(36).toUpperCase() + "-" +
    Math.random().toString(36).substring(2, 5).toUpperCase();
}

function handleSubmit(e) {
  e.preventDefault();
  const f = e.target;
  const data = {
    fullName: f.fullName.value.trim(),
    regNumber: f.regNumber.value.trim().toUpperCase(),
    email: f.email.value.trim().toLowerCase(),
    phone: f.phone.value.trim(),
    eventSelect: f.eventSelect.value,
    year: f.year.value.trim(),
    favAnime: f.favAnime.value.trim(),
    notes: f.notes.value.trim(),
    payMethod: f.payMethod.value,
    agree: f.agree.checked
  };

  if (!validate(data)) {
    document.getElementById("registrationForm").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const event = events.find(ev => ev.id === data.eventSelect);
  if (!event || event.booked >= event.seats) {
    showToast("Event full or not found.", "error");
    populateEventSelect();
    return;
  }

  if (bookings.some(b => b.regNumber === data.regNumber && b.eventId === data.eventSelect)) {
    showToast("Already registered for this event.", "error");
    return;
  }

  const bookingId = genId();
  const booking = {
    id: bookingId,
    eventId: event.id,
    eventTitle: event.title,
    eventDate: event.date,
    eventTime: event.time,
    eventVenue: event.venue,
    fee: event.fee,
    fullName: data.fullName,
    regNumber: data.regNumber,
    email: data.email,
    phone: data.phone,
    year: data.year,
    favAnime: data.favAnime,
    notes: data.notes,
    payMethod: data.payMethod,
    paid: event.fee === 0 ? true : false,
    txnId: "",
    createdAt: new Date().toISOString()
  };

  // Save via API
  fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  }).then(async (res) => {
    if (!res.ok) throw new Error("Server rejected booking");
    await loadData();
    updateStats();
    renderFeatured();
    renderAllEvents();
    populateEventSelect();

    f.style.display = "none";
    const card = document.getElementById("successCard");
    card.style.display = "block";
    document.getElementById("successMsg").textContent =
      `You are registered for "${event.title}" on ${formatDate(event.date)}.`;
    document.getElementById("bookingId").textContent = bookingId;

    const hint = document.getElementById("paymentHint");
    const successTitle = document.querySelector("#successCard h3");
    if (event.fee > 0) {
      hint.style.display = "block";
      if (successTitle) successTitle.textContent = "> REGISTRATION_PENDING_PAYMENT";
      showToast("Registration pending payment!", "success");
    } else {
      hint.style.display = "none";
      if (successTitle) successTitle.textContent = "> REGISTRATION_SUCCESSFUL";
      showToast("Free event entry confirmed!", "success");
    }
  }).catch(err => {
    console.error(err);
    showToast("Error saving booking! Are you using the correct link?", "error");
  });
}

function resetForm() {
  const f = document.getElementById("registrationForm");
  f.reset();
  f.style.display = "block";
  document.getElementById("successCard").style.display = "none";
  clearErrors();
  populateEventSelect();
}

/* Bookings */
function lookupBookings() {
  const reg = document.getElementById("lookupReg").value.trim().toUpperCase();
  const listEl = document.getElementById("bookingsList");
  const empty = document.getElementById("bookingsEmpty");
  if (!reg) {
    showToast("Enter registration number.", "error");
    return;
  }
  const mine = bookings
    .filter(b => b.regNumber === reg)
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate));

  if (!mine.length) {
    listEl.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
    listEl.innerHTML = mine.map(b => {
      let badgeClass = "";
      let badgeText = "";
      
      if (b.paid) {
        badgeClass = "paid";
        badgeText = b.fee === 0 ? "FREE ENTRY" : "PAYMENT VERIFIED";
      } else if (b.txnId) {
        badgeClass = "pending";
        badgeText = "VERIFICATION PENDING";
      } else {
        badgeClass = "";
        badgeText = "PAYMENT PENDING";
      }
      
      return `
      <div class="booking-card">
        <div class="booking-info">
          <h4>${b.eventTitle}</h4>
          <p>📅 ${formatDate(b.eventDate)} · ${b.eventTime}</p>
          <p>📍 ${b.eventVenue}</p>
          <p>💰 ${feeText(b.fee)} · ID: ${b.id}</p>
          <p>${b.fullName} · ${b.regNumber}</p>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem;">
          <span class="badge ${badgeClass}">${badgeText}</span>
          <button class="btn btn-sm btn-danger" onclick="cancelBooking('${b.id}')">[CANCEL]</button>
        </div>
      </div>`;
    }).join("");
}

async function cancelBooking(id) {
  if (!confirm("Cancel this registration?")) return;
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return;
  const b = bookings[idx];
  
  await fetch('/api/bookings/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  
  await loadData();
  updateStats();
  renderFeatured();
  renderAllEvents();
  populateEventSelect();
  document.getElementById("lookupReg").value = b.regNumber;
  lookupBookings();
  showToast("Booking cancelled.", "success");
}

/* Payment helpers */
function copyUpi() {
  const id = "8637288493@ptyes";
  navigator.clipboard.writeText(id).then(() => {
    showToast("UPI ID copied!", "success");
  }).catch(() => {
    showToast("Copy failed — select manually.", "error");
  });
}

async function submitTxn() {
  const regEl = document.getElementById("payReg");
  const reg = regEl ? regEl.value.trim().toUpperCase() : "";
  const txn = document.getElementById("txnId").value.trim();
  
  if (!reg) {
    showToast("Enter your Registration Number.", "error");
    return;
  }
  if (!txn) {
    showToast("Enter a transaction ID.", "error");
    return;
  }
  
  try {
    const res = await fetch('/api/bookings/submit-txn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regNumber: reg, txnId: txn })
    });
    
    const data = await res.json();
    if (res.ok) {
      await loadData();
      showToast(`Transaction ID submitted for ${reg}! Admin will verify soon.`, "success");
      if (regEl) regEl.value = "";
      document.getElementById("txnId").value = "";
    } else {
      showToast(data.error || `No pending payments found for ${reg}.`, "error");
    }
  } catch(err) {
    showToast("Failed to submit transaction ID.", "error");
  }
}

function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  t.textContent = "> " + msg;
  t.className = "toast " + type + " show";
  setTimeout(() => t.classList.remove("show"), 3000);
}

document.addEventListener("DOMContentLoaded", init);
