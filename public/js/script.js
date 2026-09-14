// Wanderlust Global Interactive Script

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. Dark / Light Mode System
  // ==========================================
  const themeToggleBtns = [
    document.getElementById("themeToggleBtn"),
    document.getElementById("themeToggleBtnMobile"),
  ].filter(Boolean);

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("wanderlust_theme", theme);

    themeToggleBtns.forEach((btn) => {
      const icon = btn.querySelector("i");
      if (icon) {
        if (theme === "dark") {
          icon.className = "fa-solid fa-sun text-warning";
        } else {
          icon.className = "fa-solid fa-moon";
        }
      }
    });

    if (window.leafletMap) {
      window.leafletMap.invalidateSize();
    }
  }

  const currentTheme =
    localStorage.getItem("wanderlust_theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  applyTheme(currentTheme);

  themeToggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const activeTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      const nextTheme = activeTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      showToast(
        nextTheme === "dark" ? "Dark mode enabled" : "Light mode enabled",
        nextTheme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun text-warning"
      );
    });
  });

  // ==========================================
  // 2. Interactive Toast Helper
  // ==========================================
  const toastEl = document.getElementById("interactiveToast");
  const toastMessage = document.getElementById("toastMessage");
  const toastIcon = document.getElementById("toastIcon");
  let bsToast = null;
  if (toastEl && window.bootstrap) {
    bsToast = new bootstrap.Toast(toastEl, { delay: 3500 });
  }

  function showToast(msg, iconClass = "fa-solid fa-circle-check text-success") {
    if (toastMessage && toastIcon && bsToast) {
      toastMessage.textContent = msg;
      toastIcon.className = iconClass + " fs-5";
      bsToast.show();
    }
  }
  window.showToast = showToast;

  // ==========================================
  // 3. Category Carousel Horizontal Scroll
  // ==========================================
  const filtersContainer = document.getElementById("filters");
  const scrollLeftBtn = document.getElementById("scrollLeftBtn");
  const scrollRightBtn = document.getElementById("scrollRightBtn");

  if (filtersContainer) {
    if (scrollLeftBtn) {
      scrollLeftBtn.addEventListener("click", () => {
        filtersContainer.scrollBy({ left: -260, behavior: "smooth" });
      });
    }
    if (scrollRightBtn) {
      scrollRightBtn.addEventListener("click", () => {
        filtersContainer.scrollBy({ left: 260, behavior: "smooth" });
      });
    }
  }

  // ==========================================
  // 4. Tax Toggle Switch
  // ==========================================
  const taxSwitch = document.getElementById("flexSwitchCheckDefault");
  if (taxSwitch) {
    taxSwitch.addEventListener("click", () => {
      const taxInfo = document.getElementsByClassName("tax-info");
      for (const info of taxInfo) {
        if (info.style.display !== "inline") {
          info.style.display = "inline";
        } else {
          info.style.display = "none";
        }
      }
    });
  }

  // ==========================================
  // 5. Wishlist Guarded with Login
  // ==========================================
  const wishlistBtns = document.querySelectorAll(".wishlist-btn, .wishlist-btn-show");
  const wishlistModalEl = document.getElementById("wishlistLoginModal");
  let wishlistLoginModal = null;
  if (wishlistModalEl && window.bootstrap) {
    wishlistLoginModal = new bootstrap.Modal(wishlistModalEl);
  }

  wishlistBtns.forEach((btn) => {
    const listingId = btn.getAttribute("data-id");

    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      // If user is NOT logged in, show login prompt modal!
      if (!window.isUserLoggedIn) {
        if (wishlistLoginModal) {
          wishlistLoginModal.show();
        } else {
          window.location.href = "/login";
        }
        showToast("Please log in to save to your wishlist", "fa-solid fa-lock text-danger");
        return;
      }

      // If user IS logged in, sync with database
      try {
        const response = await fetch(`/listings/${listingId}/wishlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();

        if (result.success) {
          const icon = btn.querySelector("i");
          if (result.isSaved) {
            btn.classList.add("active");
            if (icon) icon.className = "fa-solid fa-heart text-danger";
            showToast("Saved to your Wishlist!", "fa-solid fa-heart text-danger");
          } else {
            btn.classList.remove("active");
            if (icon) icon.className = "fa-regular fa-heart";
            showToast("Removed from Wishlist", "fa-regular fa-heart text-secondary");
          }
        }
      } catch (err) {
        showToast("Unable to update wishlist", "fa-solid fa-triangle-exclamation text-warning");
      }
    });
  });

  // ==========================================
  // 6. Share Listing Button
  // ==========================================
  const shareBtn = document.getElementById("shareBtn");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast("Listing link copied to clipboard!", "fa-solid fa-copy text-primary");
        } catch {
          showToast("Link: " + window.location.href, "fa-solid fa-share-nodes text-primary");
        }
      } else {
        showToast("Share: " + window.location.href, "fa-solid fa-share-nodes text-primary");
      }
    });
  }

  // ==========================================
  // 7. Interactive Review Star Rating Widget
  // ==========================================
  const starRatingContainer = document.getElementById("starRatingContainer");
  const selectedRatingInput = document.getElementById("selectedRatingInput");
  const ratingDisplayLabel = document.getElementById("ratingDisplayLabel");

  if (starRatingContainer && selectedRatingInput) {
    const starIcons = starRatingContainer.querySelectorAll(".star-icon");
    const labels = {
      1: "1 Star - Terrible",
      2: "2 Stars - Poor",
      3: "3 Stars - Average",
      4: "4 Stars - Very Good",
      5: "5 Stars - Excellent",
    };

    function highlightStars(count) {
      starIcons.forEach((star) => {
        const rating = parseInt(star.getAttribute("data-rating"));
        if (rating <= count) {
          star.classList.add("active");
        } else {
          star.classList.remove("active");
        }
      });
    }

    starIcons.forEach((star) => {
      star.addEventListener("mouseenter", () => {
        const val = parseInt(star.getAttribute("data-rating"));
        highlightStars(val);
      });

      star.addEventListener("click", () => {
        const val = parseInt(star.getAttribute("data-rating"));
        selectedRatingInput.value = val;
        highlightStars(val);
        if (ratingDisplayLabel) {
          ratingDisplayLabel.textContent = labels[val];
        }
      });
    });

    starRatingContainer.addEventListener("mouseleave", () => {
      const savedVal = parseInt(selectedRatingInput.value) || 5;
      highlightStars(savedVal);
    });
  }

  // ==========================================
  // 8. Interactive Booking & Payment Modal
  // ==========================================
  const checkinInput = document.getElementById("checkinDate");
  const checkoutInput = document.getElementById("checkoutDate");
  const guestSelect = document.getElementById("guestSelect");
  const openPaymentModalBtn = document.getElementById("openPaymentModalBtn");
  let currentCalculatedTotal = 0;
  let currentNights = 3;

  if (checkinInput && checkoutInput && window.listingData) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const defaultCheckout = new Date(tomorrow);
    defaultCheckout.setDate(defaultCheckout.getDate() + 3);

    checkinInput.value = tomorrow.toISOString().split("T")[0];
    checkoutInput.value = defaultCheckout.toISOString().split("T")[0];
    checkinInput.min = today.toISOString().split("T")[0];
    checkoutInput.min = tomorrow.toISOString().split("T")[0];

    function calculateBooking() {
      const d1 = new Date(checkinInput.value);
      const d2 = new Date(checkoutInput.value);
      const diffTime = d2 - d1;
      let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (isNaN(nights) || nights < 1) nights = 1;
      currentNights = nights;

      const price = window.listingData.price || 0;
      const subtotal = price * nights;
      const cleaningFee = 500;
      const serviceFee = 850;
      const gst = Math.round((subtotal + cleaningFee + serviceFee) * 0.18);
      const total = subtotal + cleaningFee + serviceFee + gst;
      currentCalculatedTotal = total;

      const calcLabel = document.getElementById("priceCalculationLabel");
      const subtotalEl = document.getElementById("subtotalPrice");
      const gstEl = document.getElementById("gstAmount");
      const totalEl = document.getElementById("totalPriceFinal");

      if (calcLabel) calcLabel.innerHTML = `&#8377; ${price.toLocaleString("en-IN")} &times; ${nights} night${nights > 1 ? "s" : ""}`;
      if (subtotalEl) subtotalEl.innerHTML = `&#8377; ${subtotal.toLocaleString("en-IN")}`;
      if (gstEl) gstEl.innerHTML = `&#8377; ${gst.toLocaleString("en-IN")}`;
      if (totalEl) totalEl.innerHTML = `&#8377; ${total.toLocaleString("en-IN")}`;
    }

    checkinInput.addEventListener("change", () => {
      const nextDay = new Date(checkinInput.value);
      nextDay.setDate(nextDay.getDate() + 1);
      checkoutInput.min = nextDay.toISOString().split("T")[0];
      if (new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
        checkoutInput.value = nextDay.toISOString().split("T")[0];
      }
      calculateBooking();
    });

    checkoutInput.addEventListener("change", calculateBooking);
    calculateBooking();

    // Opening Payment & Confirmation Modal
    if (openPaymentModalBtn) {
      openPaymentModalBtn.addEventListener("click", () => {
        if (!window.isUserLoggedIn) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
          return;
        }

        const modalEl = document.getElementById("checkoutPaymentModal");
        if (modalEl && window.bootstrap) {
          // Fill form values
          const formCheckin = document.getElementById("formCheckin");
          const formCheckout = document.getElementById("formCheckout");
          const formNights = document.getElementById("formNights");
          const formGuests = document.getElementById("formGuests");
          const formTotalPrice = document.getElementById("formTotalPrice");

          if (formCheckin) formCheckin.value = checkinInput.value;
          if (formCheckout) formCheckout.value = checkoutInput.value;
          if (formNights) formNights.value = currentNights;
          if (formGuests) formGuests.value = guestSelect ? guestSelect.value : 1;
          if (formTotalPrice) formTotalPrice.value = currentCalculatedTotal;

          // Fill preview labels
          const d1 = new Date(checkinInput.value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          const d2 = new Date(checkoutInput.value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          const datesPreview = document.getElementById("checkoutDatesPreview");
          const nightsPreview = document.getElementById("checkoutNightsPreview");
          const guestsPreview = document.getElementById("checkoutGuestsPreview");
          const totalPreview = document.getElementById("checkoutTotalPreview");

          if (datesPreview) datesPreview.textContent = `${d1} - ${d2}`;
          if (nightsPreview) nightsPreview.textContent = `${currentNights} night${currentNights > 1 ? "s" : ""}`;
          if (guestsPreview) guestsPreview.textContent = `${guestSelect ? guestSelect.value : 1} guest${guestSelect && guestSelect.value > 1 ? "s" : ""}`;
          if (totalPreview) totalPreview.innerHTML = `&#8377; ${currentCalculatedTotal.toLocaleString("en-IN")}`;

          const paymentModal = new bootstrap.Modal(modalEl);
          paymentModal.show();
        }
      });
    }

    // Toggle Card fields based on payment method
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const cardFields = document.getElementById("cardFields");
    paymentRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (cardFields) {
          cardFields.style.display = radio.value === "Card" ? "block" : "none";
        }
      });
    });
  }

  // ==========================================
  // 9. Interactive Leaflet Map
  // ==========================================
  const mapElement = document.getElementById("map");
  if (mapElement && typeof L !== "undefined" && window.listingData) {
    const { title, location, country, price } = window.listingData;

    const knownCoordinates = {
      malibu: [34.0259, -118.7798],
      "new york city": [40.7128, -74.006],
      montana: [46.8797, -110.3626],
      orlando: [28.5383, -81.3792],
      goa: [15.2993, 74.124],
      jaipur: [26.9124, 75.7873],
      phuket: [7.8804, 98.3923],
      "scottish highlands": [57.3229, -4.4244],
      dubai: [25.2048, 55.2708],
      mykonos: [37.4467, 25.3289],
      "costa rica": [9.7489, -83.7534],
      charleston: [32.7765, -79.9311],
      tokyo: [35.6762, 139.6503],
      "new hampshire": [43.1939, -71.5724],
      maldives: [3.2028, 73.2207],
      aspen: [39.1911, -106.8175],
      tuscany: [43.7711, 11.2486],
      bali: [-8.4095, 115.1889],
      paris: [48.8566, 2.3522],
      rome: [41.9028, 12.4964],
      london: [51.5074, -0.1278],
    };

    const locKey = (location || "").toLowerCase().trim();
    const countryKey = (country || "").toLowerCase().trim();
    let coords = knownCoordinates[locKey] || knownCoordinates[countryKey] || [28.6139, 77.209];

    const map = L.map("map", {
      center: coords,
      zoom: 12,
      scrollWheelZoom: false,
    });
    window.leafletMap = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const customIcon = L.divIcon({
      className: "custom-map-pin",
      html: `
        <div style="
          background: #fe424d;
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 3px solid white;
        ">
          <i class="fa-solid fa-house" style="transform: rotate(45deg); font-size: 16px;"></i>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -42],
    });

    const marker = L.marker(coords, { icon: customIcon }).addTo(map);

    marker
      .bindPopup(`
        <div style="padding: 6px; min-width: 180px;">
          <h6 style="margin: 0 0 4px 0; font-weight: 700; color: #fe424d;">${title}</h6>
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #555;">${location}, ${country}</p>
          <div style="font-size: 13px; font-weight: 700;">&#8377; ${price.toLocaleString("en-IN")} <span style="font-weight: 400; color: #777;">/ night</span></div>
          <div style="margin-top: 6px; font-size: 11px; background: #f0f0f0; padding: 2px 6px; border-radius: 4px; color: #444;">Exact location provided after booking</div>
        </div>
      `)
      .openPopup();

    const recenterBtn = document.getElementById("recenterMapBtn");
    if (recenterBtn) {
      recenterBtn.addEventListener("click", () => {
        map.setView(coords, 13);
        marker.openPopup();
      });
    }
  }

  // ==========================================
  // 10. Bootstrap Form Validation
  // ==========================================
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
});
