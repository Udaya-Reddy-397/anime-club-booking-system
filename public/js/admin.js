const PASSWORD = "otaku"; // Simple hardcoded password

function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  t.textContent = "> " + msg;
  t.className = "toast " + type + " show";
  setTimeout(() => t.classList.remove("show"), 3000);
}

function login() {
  const pwd = document.getElementById("adminPwd").value;
  if (pwd === PASSWORD) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("dashboardScreen").style.display = "block";
    fetchBookings();
    showToast("Login successful", "success");
  } else {
    document.getElementById("loginErr").textContent = "> ACCESS DENIED. Incorrect password.";
  }
}

async function fetchBookings() {
  try {
    const res = await fetch('/api/bookings');
    const bookings = await res.json();
    renderTable(bookings);
  } catch (err) {
    showToast("Failed to fetch database.", "error");
  }
}

function renderTable(bookings) {
  const tbody = document.getElementById("bookingsTable");
  if (!bookings.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No bookings found.</td></tr>`;
    return;
  }
  
  // Sort: unverified paid events first, then latest
  bookings.sort((a, b) => {
    if (!a.paid && a.fee > 0 && (b.paid || b.fee === 0)) return -1;
    if ((a.paid || a.fee === 0) && !b.paid && b.fee > 0) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  tbody.innerHTML = bookings.map(b => {
    const isPending = !b.paid && b.fee > 0;
    
    let statusText = "";
    if (isPending) {
      statusText = b.txnId ? `PENDING (TXN: ${b.txnId})` : "PENDING";
    } else {
      statusText = b.fee === 0 ? "FREE" : `PAID (${b.txnId})`;
    }
    
    const actionBtn = isPending 
      ? `<button class="btn btn-sm" onclick="approvePayment('${b.regNumber}', '${b.txnId}')" style="background:#ff0000;color:#fff;border-color:#ff0000;">[APPROVE]</button>`
      : `<span style="color:#888;">VERIFIED</span>`;
      
    return `
      <tr>
        <td>${b.id}</td>
        <td>${b.fullName}</td>
        <td>${b.regNumber}</td>
        <td>${b.eventTitle}</td>
        <td>${b.fee > 0 ? '₹' + b.fee : 'FREE'}</td>
        <td style="color: ${isPending ? 'orange' : '#ff3333'}">${statusText}</td>
        <td>${actionBtn}</td>
      </tr>
    `;
  }).join("");
}

async function approvePayment(regNumber, submittedTxnId) {
  const defaultTxn = submittedTxnId && submittedTxnId !== "undefined" ? submittedTxnId : "ADMIN-APPROVED";
  const txnId = prompt(`Enter Transaction ID for ${regNumber} to approve:`, defaultTxn);
  if (!txnId) return;

  try {
    const res = await fetch('/api/bookings/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regNumber, txnId })
    });
    
    const data = await res.json();
    if (res.ok) {
      showToast(`Approved payment for ${regNumber}!`, "success");
      fetchBookings();
    } else {
      showToast(data.error || "Approval failed.", "error");
    }
  } catch (err) {
    showToast("API Error.", "error");
  }
}
