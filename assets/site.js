/* =========================================================
   RealmTag — site behaviour
   ========================================================= */

(function () {
  "use strict";

  var config = window.REALMTAG_CONFIG || {};
  var $ = function (selector, root) {
    return (root || document).querySelector(selector);
  };
  var $$ = function (selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  };

  /* ---------- Config-driven links and labels ---------- */

  var downloadPath =
    config.downloadPath ||
    "https://github.com/LYRACorparation/RealmTag/releases/latest/download/game.apk";
  $$("[data-download-link]").forEach(function (link) {
    link.setAttribute("href", downloadPath);
    link.setAttribute("download", "");
  });

  var discordInvite = (config.discordInvite || "").trim();
  var discordReady = discordInvite && discordInvite.indexOf("REPLACE") === -1;
  $$("[data-discord-link]").forEach(function (link) {
    if (discordReady) {
      link.setAttribute("href", discordInvite);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    } else {
      link.setAttribute("href", "#");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("title", "Discord invite coming soon");
    }
  });

  var contactEmail = (config.contactEmail || "").trim();
  if (contactEmail) {
    $$("[data-contact-email]").forEach(function (link) {
      link.textContent = contactEmail;
      link.setAttribute("href", "mailto:" + contactEmail);
    });
  }

  $$("[data-version]").forEach(function (node) {
    node.textContent = config.version || node.textContent;
  });
  $$("[data-apk-size]").forEach(function (node) {
    node.textContent = config.apkSize || node.textContent;
  });
  $$("[data-updated]").forEach(function (node) {
    node.textContent = config.updated || node.textContent;
  });
  $$("[data-year]").forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  /* ---------- Header ---------- */

  var header = $(".site-header");
  if (header) {
    var setHeaderState = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });
  }

  var menuToggle = $(".menu-toggle");
  var siteNav = $("#site-nav");
  if (menuToggle && siteNav) {
    var closeMenu = function () {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });

    siteNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest(".site-header")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    var desktop = window.matchMedia("(min-width: 901px)");
    var handleDesktop = function (event) {
      if (event.matches) closeMenu();
    };
    if (desktop.addEventListener) desktop.addEventListener("change", handleDesktop);
    else if (desktop.addListener) desktop.addListener(handleDesktop);
  }

  /* ---------- Scroll reveal ---------- */

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealNodes = $$("[data-reveal]");
    revealNodes.forEach(function (node) {
      node.classList.add("reveal");
      if (node.dataset.revealDelay) {
        node.style.setProperty("--reveal-delay", node.dataset.revealDelay + "ms");
      }
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealNodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  /* ---------- Star rating ---------- */

  var ratingRoot = $("[data-rating]");
  if (ratingRoot) {
    var starButtons = $$(".star-btn", ratingRoot);
    var ratingInput = ratingRoot.parentElement.querySelector('input[name="rating"]');
    var ratingLabel = $("[data-rating-label]");
    var ratingForm = ratingRoot.closest("form");
    var currentRating = 0;
    var ratingNames = ["", "Needs work", "It's okay", "Solid", "Great", "Absolute cinema"];

    var paintStars = function (value) {
      starButtons.forEach(function (button, index) {
        var active = index < value;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-checked", String(index + 1 === value));
      });
      if (ratingLabel) {
        ratingLabel.textContent = value
          ? value + " / 5 — " + ratingNames[value]
          : "Tap a star to rate";
      }
    };

    var chooseRating = function (value) {
      currentRating = value;
      if (ratingInput) ratingInput.value = String(value);
      paintStars(value);
    };

    starButtons.forEach(function (button, index) {
      var value = index + 1;

      button.addEventListener("click", function () {
        chooseRating(value);
      });

      button.addEventListener("mouseenter", function () {
        paintStars(value);
      });

      button.addEventListener("mouseleave", function () {
        paintStars(currentRating);
      });

      button.addEventListener("focus", function () {
        paintStars(value);
      });

      button.addEventListener("blur", function () {
        paintStars(currentRating);
      });

      button.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          next = starButtons[Math.min(index + 1, starButtons.length - 1)];
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          next = starButtons[Math.max(index - 1, 0)];
        } else if (event.key === "Home") {
          next = starButtons[0];
        } else if (event.key === "End") {
          next = starButtons[starButtons.length - 1];
        }
        if (next) {
          event.preventDefault();
          next.focus();
          next.click();
        }
      });
    });

    if (ratingForm) {
      ratingForm.addEventListener("reset", function () {
        window.setTimeout(function () {
          currentRating = 0;
          if (ratingInput) ratingInput.value = "";
          paintStars(0);
        }, 0);
      });
    }

    paintStars(0);
  }

  /* ---------- Form helpers ---------- */

  var truncate = function (value, limit) {
    var text = String(value == null ? "" : value).trim();
    if (!text) return "—";
    if (text.length <= limit) return text;
    return text.slice(0, Math.max(0, limit - 1)).trimEnd() + "…";
  };

  var field = function (name, value, inline) {
    return {
      name: name,
      value: truncate(value, 1024),
      inline: Boolean(inline),
    };
  };

  var getWebhookUrl = function () {
    var proxy = (config.webhookProxyUrl || "").trim();
    if (proxy) return proxy;
    return (config.webhookUrl || "").trim();
  };

  var webhookReady = function (url) {
    return Boolean(url) && url.indexOf("REPLACE") === -1;
  };

  var setStatus = function (form, type, message) {
    var status = $(".form-status", form);
    if (!status) return;
    status.className = "form-status is-" + type;
    status.textContent = message;
  };

  var clearStatus = function (form) {
    var status = $(".form-status", form);
    if (!status) return;
    status.className = "form-status";
    status.textContent = "";
  };

  var setLoading = function (form, loading) {
    var button = form.querySelector('button[type="submit"]');
    if (!button) return;
    if (loading) {
      if (!button.dataset.originalHtml) {
        button.dataset.originalHtml = button.innerHTML;
      }
      button.disabled = true;
      button.textContent = "Sending…";
    } else {
      button.disabled = false;
      if (button.dataset.originalHtml) {
        button.innerHTML = button.dataset.originalHtml;
      }
    }
  };

  var cooldownKey = function (type) {
    return "realmTagCooldown:" + type;
  };

  var checkCooldown = function (type) {
    try {
      var until = Number(window.localStorage.getItem(cooldownKey(type)) || 0);
      if (until > Date.now()) {
        return Math.ceil((until - Date.now()) / 1000);
      }
    } catch (error) {
      /* localStorage can be unavailable in private mode */
    }
    return 0;
  };

  var setCooldown = function (type, seconds) {
    try {
      window.localStorage.setItem(cooldownKey(type), String(Date.now() + seconds * 1000));
    } catch (error) {
      /* ignore */
    }
  };

  var buildPayload = function (type, data) {
    var payload = {
      username: "RealmTag Website",
      allowed_mentions: { parse: [] },
    };

    if (type === "rating") {
      var stars = Number(data.rating || 0);
      var starText = stars > 0 ? "★".repeat(stars) + "☆".repeat(5 - stars) : "—";
      payload.embeds = [
        {
          title: "⭐ New RealmTag rating",
          description: data.review
            ? truncate(data.review, 3800)
            : "*No written feedback provided.*",
          color: 0xb06bff,
          fields: [
            field("Rating", starText + " (" + stars + "/5)", true),
            field("Gamertag", data.name, true),
            field("Favorite mode", data.mode, true),
            field("Can share anonymously", data.share ? "Yes" : "No", true),
          ],
          footer: { text: "RealmTag • Ratings" },
          timestamp: new Date().toISOString(),
        },
      ];
      return payload;
    }

    if (type === "creator") {
      payload.embeds = [
        {
          title: "🎬 New creator application",
          description: data.pitch
            ? truncate(data.pitch, 3800)
            : "*No pitch provided.*",
          color: 0xe879f9,
          fields: [
            field("Creator name", data.name, true),
            field("Email", data.email, true),
            field("Discord", data.discord, true),
            field("Platform", data.platform, true),
            field("Audience size", data.audience, true),
            field("Channel URL", data.channel, false),
            field("Content focus", data.focus, false),
          ],
          footer: { text: "RealmTag • Creator Program" },
          timestamp: new Date().toISOString(),
        },
      ];
      return payload;
    }

    payload.embeds = [
      {
        title: "🛡️ New staff application",
        description: data.motivation
          ? truncate(data.motivation, 3800)
          : "*No motivation provided.*",
        color: 0xffb454,
        fields: [
          field("Name", data.name, true),
          field("Discord", data.discord, true),
          field("Email", data.email, true),
          field("Age range", data.age, true),
          field("Timezone", data.timezone, true),
          field("Role", data.role, true),
          field("Availability", data.availability, true),
          field("Experience", data.experience, false),
          field("References", data.references, false),
        ],
        footer: { text: "RealmTag • Staff Applications" },
        timestamp: new Date().toISOString(),
      },
    ];
    return payload;
  };

  var successMessage = function (type) {
    if (type === "rating") {
      return "Rating sent. Thanks for helping us make RealmTag better!";
    }
    if (type === "creator") {
      return "Application sent. We review creator applications weekly and will reach out if it's a fit.";
    }
    return "Application sent. We'll review it and reach out through Discord or email.";
  };

  var submitForm = function (form, type, data) {
    var url = getWebhookUrl();
    if (!webhookReady(url)) {
      setStatus(
        form,
        "error",
        "Submissions are temporarily unavailable. Please try again later."
      );
      if (window.console) {
        console.warn(
          "RealmTag: add a Discord webhook URL to config.js to enable form submissions."
        );
      }
      return Promise.resolve();
    }

    var payload = buildPayload(type, data);
    var controller = new AbortController();
    var timer = window.setTimeout(function () {
      controller.abort();
    }, 20000);

    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
      .then(function (response) {
        window.clearTimeout(timer);
        if (response.ok) {
          setCooldown(type, type === "rating" ? 45 : 90);
          form.reset();
          setStatus(form, "success", successMessage(type));
          return;
        }
        if (response.status === 429) {
          throw new Error("rate-limited");
        }
        throw new Error("request-failed");
      })
      .catch(function (error) {
        window.clearTimeout(timer);
        if (error && error.name === "AbortError") {
          setStatus(form, "error", "That took too long. Check your connection and try again.");
        } else if (error && error.message === "rate-limited") {
          setStatus(form, "error", "You're sending too fast. Give it a minute and try again.");
        } else {
          setStatus(
            form,
            "error",
            "Couldn't send that just now. Check your connection and try again."
          );
        }
        if (window.console) console.error("RealmTag form error:", error);
      });
  };

  /* ---------- Forms ---------- */

  $$("form[data-webhook-form]").forEach(function (form) {
    var type = form.dataset.formType || "application";

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearStatus(form);

      // Honeypot: pretend it worked and drop it.
      var honey = form.querySelector('input[name="website"]');
      if (honey && honey.value) {
        setStatus(form, "success", successMessage(type));
        form.reset();
        return;
      }

      if (!form.reportValidity()) return;

      if (type === "rating") {
        var ratingInput = form.querySelector('input[name="rating"]');
        if (!ratingInput || !ratingInput.value) {
          setStatus(form, "error", "Pick a star rating first.");
          var firstStar = form.querySelector(".star-btn");
          if (firstStar) firstStar.focus();
          return;
        }
      }

      var remaining = checkCooldown(type);
      if (remaining > 0) {
        setStatus(
          form,
          "error",
          "You just sent one. Try again in " + remaining + " second" + (remaining === 1 ? "" : "s") + "."
        );
        return;
      }

      var data = {};
      new FormData(form).forEach(function (value, key) {
        if (key !== "website") data[key] = value;
      });

      setLoading(form, true);
      submitForm(form, type, data).then(function () {
        setLoading(form, false);
      });
    });
  });
})();
