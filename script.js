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
});

function getSavedRides() {
  const savedRides = JSON.parse(localStorage.getItem('savedRides') || '{}');
  return savedRides;
}

function updateSavedRidesDropdown(rides) {
  const savedDropdown = document.getElementById('saved-rides');
  savedDropdown.disabled = false;

  savedDropdown.innerHTML = '<option value="">-- Select --</option>' +
    Object.keys(rides).map(title => `<option value="${title}">${title}</option>`).join('');
}

function fillRideDetails(ride) {
  if (ride) {
    document.getElementById('ride-title').value = e.target.value;
    document.getElementById('date').value = ride.date;
    document.getElementById('time').value = ride.time;
    document.getElementById('from').value = ride.from;
    document.getElementById('to').value = ride.to;
    document.getElementById('via').value = ride.via;
    document.getElementById('vehicle').value = ride.vehicle;
    document.getElementById('upi').value = ride.upi;
  }
}

function formatTimeTo12Hour(time) {
  const [hour, minute] = time.split(':');
  let h = parseInt(hour);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${minute} ${ampm}`;
}

function generateAndCopy() {
  const title = document.getElementById('ride-title').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const via = document.getElementById('via').value;
  const vehicle = document.getElementById('vehicle').value;
  const upi = document.getElementById('upi').value;
  const save = document.getElementById('save-details').checked;

  const formattedDate = new Date(date);
  const dayName = formattedDate.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDateStr = `${String(formattedDate.getDate()).padStart(2, '0')}-${String(formattedDate.getMonth() + 1).padStart(2, '0')}-${formattedDate.getFullYear()} (${dayName})`;
  const formattedTime = formatTimeTo12Hour(time);

  const message = `Hi All,\n\n${title}\n📆 Date: ${formattedDateStr}\n⏰ Time: ${formattedTime}\n📍 From: ${from}\n➡️ To: ${to}\n🛣️ Via: ${via}\n🚘 Vehicle: ${vehicle}\n💳 UPI: ${upi}`;

  navigator.clipboard.writeText(message)
    .then(() => alert('Message copied to clipboard!'))
    .catch(() => alert('Failed to copy message.'));

  if (save && title) {
    const savedRides = getSavedRides();
    savedRides[title] = { date, time, from, to, via, vehicle, upi };
    localStorage.setItem('savedRides', JSON.stringify(savedRides));

    updateSavedRidesDropdown(savedRides);
  }
}
