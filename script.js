document.addEventListener('DOMContentLoaded', () => {
  const savedRides = getSavedRides();
  const savedDropdown = document.getElementById('saved-rides');

  if (Object.keys(savedRides).length > 0) {
    updateSavedRidesDropdown(savedRides);
  }

  savedDropdown.addEventListener('change', e => {
    const availableSavedRides = getSavedRides();
    const ride = availableSavedRides[e.target.value];
    fillRideDetails(ride);
  });

  const form = document.getElementById("ride-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    generateAndCopy(e.target);
  });
});

function getSavedRides() {
  const savedRides = JSON.parse(localStorage.getItem('savedRides') || '{}');
  return savedRides;
}

function setSavedRides(savedRides) {
  localStorage.setItem('savedRides', JSON.stringify(savedRides));
}

function updateSavedRidesDropdown(rides) {
  const savedDropdown = document.getElementById('saved-rides');
  savedDropdown.disabled = false;

  savedDropdown.innerHTML = '<option value="">-- Select --</option>' +
    Object.keys(rides).map(title => `<option value="${title}">${title}</option>`).join('');
}

function fillRideDetails(ride) {
  if (ride) {
    document.getElementById('ride-title').value = ride.title;
    document.getElementById('date').value = ride.date;
    document.getElementById('time').value = ride.time;
    document.getElementById('from').value = ride.from;
    document.getElementById('to').value = ride.to;
    document.getElementById('via').value = ride.via;
    document.getElementById('vehicle').value = ride.vehicle;
    document.getElementById('upi').value = ride.upi;
    document.getElementById('note').value = ride.note || '';
  }
}

function formatTimeTo12Hour(time) {
  const [hour, minute] = time.split(':');
  let h = parseInt(hour);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${minute} ${ampm}`;
}

function generateAndCopy(form) {
  const formData = new FormData(form);
  const title = formData.get('ride-title');
  const date = formData.get('date');
  const time = formData.get('time');
  const from = formData.get('from');
  const to = formData.get('to');
  const via = formData.get('via');
  const vehicle = formData.get('vehicle');
  const upi = formData.get('upi');
  const note = formData.get('note');
  const save = formData.get('save-details') === 'on';

  const formattedDate = new Date(date);
  const dayName = formattedDate.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDateStr = `${String(formattedDate.getDate()).padStart(2, '0')}-${String(formattedDate.getMonth() + 1).padStart(2, '0')}-${formattedDate.getFullYear()} (${dayName})`;
  const formattedTime = formatTimeTo12Hour(time);

  let message = `Hi All,\n\n${title}\n📆 Date: ${formattedDateStr}\n⏰ Time: ${formattedTime}\n📍 From: ${from}\n➡️ To: ${to}`;
  if (via) {
    message += `\n🛣️ Via: ${via}`;
  }
  message += `\n🚘 Vehicle: ${vehicle}\n💳 UPI: ${upi}`;

  if (note) {
    message += `\n\nNote: ${note}`;
  }

  navigator.clipboard.writeText(message)
    .then(() => alert('Message copied to clipboard!'))
    .catch(() => alert('Failed to copy message.'));

  if (save && title) {
    const savedRides = getSavedRides();
    savedRides[title] = { title, date, time, from, to, via, vehicle, upi, note };
    setSavedRides(savedRides);

    updateSavedRidesDropdown(savedRides);
  }
}
