"use client";

import { useState, useEffect, useRef } from "react";
import {
  CalendarDays,
  Camera,
  Clock,
  Heart,
  MapPin,
  Music,
  Navigation,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Send,
  Sparkle,
  Check,
  Gift,
  Plus,
} from "lucide-react";

// Pre-configured list of schedule events
const schedule = [
  {
    time: "15:30",
    title: "Guest Welcome",
    detail: "Garden drinks, soft acoustic tunes & sunset portraits",
    location: "Ocean Lawn",
  },
  {
    time: "16:30",
    title: "The Ceremony",
    detail: "Vows and rings exchange under the Glass Garden arch",
    location: "Glass Chapel",
  },
  {
    time: "18:00",
    title: "Dinner Banquet",
    detail: "A family-style feast of gourmet Vietnamese & ocean fare",
    location: "Grand Pavillion",
  },
  {
    time: "20:00",
    title: "The Afterparty",
    detail: "First dance, champagne toasts, and dancing under the stars",
    location: "Beachside Stage",
  },
];

// Details band configuration
const details = [
  {
    icon: CalendarDays,
    label: "The Date",
    value: "Saturday, 22 August 2026",
    sub: "Mark your calendars",
  },
  {
    icon: Clock,
    label: "The Time",
    value: "3:30 PM until late",
    sub: "Arrival from 3:00 PM",
  },
  {
    icon: MapPin,
    label: "The Venue",
    value: "The Glass Garden, Da Nang",
    sub: "Truong Sa Highway, Da Nang City",
  },
];

// Story Milestones
const milestones = [
  {
    year: "2021",
    title: "Where it all started",
    detail: "A quiet coffee shop in Saigon, a rainy afternoon, and a conversation that never really ended. We spoke about music, travels, and small hopes, losing track of hours.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=86",
    tag: "First Encounter",
  },
  {
    year: "2023",
    title: "Our first sunrise together",
    detail: "Waking up at 4:30 AM in Da Lat, hands freezing around cups of warm tea, watching the heavy silver fog lift off the pine forests. In that quiet, we knew.",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=86",
    tag: "The Journey",
  },
  {
    year: "2025",
    title: "The promise of forever",
    detail: "On the shore of Phu Quoc, with the sound of the ocean washing away our footprints, Minh asked and Linh said yes. A simple wooden ring and stars above.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=86",
    tag: "The Proposal",
  },
  {
    year: "2026",
    title: "The next chapter",
    detail: "A gathering of all the souls who have held our hands along the way. We return to the ocean in Da Nang to build a house out of promises.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=86",
    tag: "Our Wedding",
  },
];

// Gallery Images
const gallery = [
  {
    title: "Morning by the golden sea",
    caption: "The calm before every storm, and the shore we always return to.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=86",
  },
  {
    title: "Garden promises",
    caption: "Sunlight weaving through wild roses, smelling of rain and fresh dirt.",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=86",
  },
  {
    title: "Dinner under lanterns",
    caption: "Long tables packed with laughter, old stories, and steam rising from plates.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=86",
  },
  {
    title: "Under the midnight sky",
    caption: "The sweet exhaustion of feet that danced for four hours straight.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=86",
  },
];

// Initial mock wishes
const INITIAL_WISHES = [
  {
    name: "Sister Mai & Phong",
    wish: "Wishing you a lifetime of mornings that smell of coffee, kitchen dances, and deep joy. We love you both so much!",
    date: "May 20, 2026",
  },
  {
    name: "Uncle Tuan & Aunt Huong",
    wish: "Congratulations to our beautiful niece and nephew! May your home be filled with patience, good food, and children's laughter.",
    date: "May 19, 2026",
  },
  {
    name: "Minh's High School Crew",
    wish: "To the absolute best duo! Still can't believe Minh pulled this off. Get ready for the wildest seaside dance off in Da Nang!",
    date: "May 18, 2026",
  },
];

export default function Home() {
  // State for Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  // State for Audio Player
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // State for Interactive Story Milestones
  const [activeMilestone, setActiveMilestone] = useState(0);

  // State for Lightbox Modal
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // State for RSVP submission
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpData, setRsvpData] = useState({
    name: "",
    attendance: "",
    guests: "1",
    diet: "",
    song: "",
    note: "",
  });

  // State for Guestbook Wishes
  const [wishes, setWishes] = useState<Array<{ name: string; wish: string; date: string }>>([]);
  const [newWish, setNewWish] = useState({ name: "", wish: "" });
  const [wishStatus, setWishStatus] = useState("");

  // Target date for countdown (22 August 2026 15:30)
  const targetDate = "2026-08-22T15:30:00";

  // Initialize data and audio
  useEffect(() => {
    // Sync wishes with local storage
    const storedWishes = localStorage.getItem("wedding_wishes");
    if (storedWishes) {
      setWishes(JSON.parse(storedWishes));
    } else {
      setWishes(INITIAL_WISHES);
      localStorage.setItem("wedding_wishes", JSON.stringify(INITIAL_WISHES));
    }

    // Check if user has already RSVP'd
    const storedRsvp = localStorage.getItem("wedding_rsvp");
    if (storedRsvp) {
      setRsvpData(JSON.parse(storedRsvp));
      setRsvpSubmitted(true);
    }

    // Set up Countdown Timer
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft(prev => ({ ...prev, isOver: true }));
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Audio play/pause handler
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.log("Audio autoplay blocked or failed:", err);
        });
    }
  };

  // RSVP Form submit handler
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpData.name || !rsvpData.attendance) {
      alert("Please fill in your name and let us know if you can attend!");
      return;
    }
    // Simulate minor delay for premium feel
    localStorage.setItem("wedding_rsvp", JSON.stringify(rsvpData));
    setRsvpSubmitted(true);
  };

  // Handle clearing RSVP to edit
  const handleEditRsvp = () => {
    localStorage.removeItem("wedding_rsvp");
    setRsvpSubmitted(false);
  };

  // Guestbook Wish submit handler
  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.name.trim() || !newWish.wish.trim()) {
      setWishStatus("Please enter your name and a sweet message.");
      return;
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const updatedWishes = [
      {
        name: newWish.name.trim(),
        wish: newWish.wish.trim(),
        date: formattedDate,
      },
      ...wishes,
    ];

    setWishes(updatedWishes);
    localStorage.setItem("wedding_wishes", JSON.stringify(updatedWishes));
    setNewWish({ name: "", wish: "" });
    setWishStatus("Thank you for your beautiful message!");
    setTimeout(() => setWishStatus(""), 4000);
  };

  // Lightbox navigation
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? gallery.length - 1 : lightboxIndex - 1);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === gallery.length - 1 ? 0 : lightboxIndex + 1);
  };

  return (
    <main>
      {/* Background Audio Element */}
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/music/preview/mixkit-delicate-piano-1718.mp3"
        loop
      />

      {/* Elegant Floating Music Pill */}
      <div className={`audioPill ${isPlaying ? "isPlaying" : ""}`} onClick={toggleAudio} title={isPlaying ? "Mute soundtrack" : "Play romantic soundtrack"}>
        <div className="audioIconBox">
          {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </div>
        <div className="audioDetails">
          <span>{isPlaying ? "Soundtrack Active" : "Play Music"}</span>
          <small>Acoustic Romance Piano</small>
        </div>
        {isPlaying && (
          <div className="musicVisualizer">
            <span className="bar bar1"></span>
            <span className="bar bar2"></span>
            <span className="bar bar3"></span>
            <span className="bar bar4"></span>
          </div>
        )}
      </div>

      {/* HERO SECTION */}
      <section className="hero" aria-label="Wedding invitation">
        <div className="heroBackdrop" aria-hidden="true" />
        <nav className="nav" aria-label="Primary navigation">
          <a href="#story">Our Story</a>
          <a href="#details">Details</a>
          <a href="#gallery">Gallery</a>
          <a href="#rsvp">RSVP</a>
          <a href="#guestbook">Wishes</a>
        </nav>

        <div className="heroShell">
          <div className="heroContent">
            <p className="kicker">Together with their families</p>
            <h1>
              Linh
              <span>&</span>
              Minh
            </h1>
            <p className="heroText">
              Invite you to an evening of vows, dinner, and dancing beside the sea at our glass garden chapel.
            </p>

            {/* Countdown Clock (Highly Styled Floating Glass Cards) */}
            <div className="countdownContainer" aria-label="Countdown to wedding day">
              {timeLeft.isOver ? (
                <div className="celebrationKicker">
                  <Sparkle className="twinkle" size={16} />
                  <span>The adventure has begun!</span>
                </div>
              ) : (
                <>
                  <div className="countdownUnit">
                    <span className="countdownVal">{timeLeft.days}</span>
                    <span className="countdownLabel">days</span>
                  </div>
                  <div className="countdownDivider">:</div>
                  <div className="countdownUnit">
                    <span className="countdownVal">{String(timeLeft.hours).padStart(2, "0")}</span>
                    <span className="countdownLabel">hours</span>
                  </div>
                  <div className="countdownDivider">:</div>
                  <div className="countdownUnit">
                    <span className="countdownVal">{String(timeLeft.minutes).padStart(2, "0")}</span>
                    <span className="countdownLabel">mins</span>
                  </div>
                  <div className="countdownDivider">:</div>
                  <div className="countdownUnit">
                    <span className="countdownVal">{String(timeLeft.seconds).padStart(2, "0")}</span>
                    <span className="countdownLabel">secs</span>
                  </div>
                </>
              )}
            </div>

            <div className="heroActions">
              <a className="primaryButton" href="#rsvp">
                RSVP Now
              </a>
              <a className="secondaryButton" href="#details">
                View Details
              </a>
            </div>
          </div>

          <aside className="heroCard" aria-label="Wedding highlight">
            <div className="portraitFrame" />
            <div className="heroCardCopy">
              <p>Da Nang, Vietnam</p>
              <strong>Ocean garden ceremony</strong>
            </div>
          </aside>
        </div>

        <div className="heroFooter">
          <div className="dateRibbon" aria-label="Wedding date">
            <span>22</span>
            <small>August 2026</small>
          </div>

          <a className="venuePill" href="#details">
            <Navigation aria-hidden="true" />
            The Glass Garden
          </a>
        </div>
      </section>

      {/* INTRO SECTION */}
      <section className="intro" id="story">
        <div className="reveal">
          <p className="eyebrow">The Promise</p>
          <h2>A quiet promise, a bright celebration.</h2>
          <p className="storySub">
            From coffee after long workdays in Saigon to sunrise walks by the water, our story
            has grown in small, steady, beautiful moments.
          </p>
        </div>
        <div className="reveal delayOne storyImageContainer">
          <div className="storyAestheticBorder"></div>
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=86"
            alt="Seaside landscape"
            className="introGraphic"
          />
        </div>
      </section>

      {/* INTERACTIVE STORY MILESTONES (ASYNCHRONOUS TABS & PHOTO SLIDER) */}
      <section className="milestonesSection">
        <div className="sectionHeader reveal">
          <div>
            <p className="eyebrow">Our Milestones</p>
            <h2>Chapters of Us</h2>
          </div>
          <Heart className="heartThrob" aria-hidden="true" />
        </div>

        <div className="milestonesTabs reveal">
          {milestones.map((m, idx) => (
            <button
              key={m.year}
              className={`milestoneTabBtn ${activeMilestone === idx ? "active" : ""}`}
              onClick={() => setActiveMilestone(idx)}
            >
              <span>{m.year}</span>
              <small>{m.tag}</small>
            </button>
          ))}
        </div>

        <div className="milestoneShowcase reveal">
          <div className="milestoneImageFrame">
            <img src={milestones[activeMilestone].image} alt={milestones[activeMilestone].title} />
            <div className="milestoneYearTag">{milestones[activeMilestone].year}</div>
          </div>
          <div className="milestoneDetailsCard">
            <span className="milestoneKicker">{milestones[activeMilestone].tag}</span>
            <h3>{milestones[activeMilestone].title}</h3>
            <p>{milestones[activeMilestone].detail}</p>
            <div className="milestoneControls">
              <button
                disabled={activeMilestone === 0}
                onClick={() => setActiveMilestone(prev => Math.max(0, prev - 1))}
                aria-label="Previous chapter"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="milestoneProgress">
                {activeMilestone + 1} of {milestones.length}
              </span>
              <button
                disabled={activeMilestone === milestones.length - 1}
                onClick={() => setActiveMilestone(prev => Math.min(milestones.length - 1, prev + 1))}
                aria-label="Next chapter"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS CARD BAND */}
      <section className="detailsBand" id="details">
        <div className="detailGrid">
          {details.map(({ icon: Icon, label, value, sub }) => (
            <article className="detailCard reveal" key={label}>
              <div className="detailIconFrame">
                <Icon aria-hidden="true" />
              </div>
              <p>{label}</p>
              <strong>{value}</strong>
              <small>{sub}</small>
            </article>
          ))}
        </div>
      </section>

      {/* WEDDING DAY SCHEDULE */}
      <section className="scheduleSection">
        <div className="sectionTitle reveal">
          <Sparkles className="twinkle" aria-hidden="true" />
          <div>
            <p className="eyebrow">The Program</p>
            <h2>Wedding Day</h2>
          </div>
        </div>

        <div className="timeline">
          {schedule.map((item, idx) => (
            <article className="timelineItem reveal" key={item.time}>
              <div className="timelineMarker">
                <span className="timelineHour">{item.time}</span>
                <span className="timelineDot"></span>
              </div>
              <div className="timelineContent">
                <span className="timelineLoc">{item.location}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* DYNAMIC GALLERY WITH INTERACTIVE LIGHTBOX */}
      <section className="gallerySection" id="gallery">
        <div className="galleryHeader reveal">
          <div>
            <p className="eyebrow">The Gallery</p>
            <h2>Moments We Cherish</h2>
          </div>
          <Camera aria-hidden="true" />
        </div>

        <div className="galleryGrid">
          {gallery.map((item, index) => (
            <article
              className={`galleryItem reveal ${index === 0 ? "galleryFeature" : ""}`}
              key={item.title}
              onClick={() => setLightboxIndex(index)}
              role="button"
              tabIndex={0}
              aria-label={`Open photo lightbox for ${item.title}`}
              onKeyDown={(e) => e.key === "Enter" && setLightboxIndex(index)}
            >
              <img alt={item.title} src={item.image} />
              <div className="galleryCaption">
                <h3>{item.title}</h3>
                <p>{item.caption}</p>
                <span className="zoomAffordance">
                  <Camera size={14} /> Click to view
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* LIGHTBOX MODAL */}
        {lightboxIndex !== null && (
          <div className="lightboxOverlay" onClick={() => setLightboxIndex(null)} role="dialog" aria-modal="true">
            <button className="lightboxClose" onClick={() => setLightboxIndex(null)} aria-label="Close gallery lightbox">
              <X size={24} />
            </button>
            <button className="lightboxNav prev" onClick={handlePrevImage} aria-label="Previous image">
              <ChevronLeft size={28} />
            </button>
            <div className="lightboxContent" onClick={(e) => e.stopPropagation()}>
              <img src={gallery[lightboxIndex].image} alt={gallery[lightboxIndex].title} />
              <div className="lightboxCaption">
                <h3>{gallery[lightboxIndex].title}</h3>
                <p>{gallery[lightboxIndex].caption}</p>
              </div>
            </div>
            <button className="lightboxNav next" onClick={handleNextImage} aria-label="Next image">
              <ChevronRight size={28} />
            </button>
          </div>
        )}
      </section>

      {/* RSVP SECTION (WITH STATEFUL INTERACTIVITY AND SUCCESS CARDS) */}
      <section className="rsvp" id="rsvp">
        <div className="rsvpCopy reveal">
          <Heart className="pulseHeart" aria-hidden="true" />
          <p className="eyebrow">Join Us</p>
          <h2>Save your seat at the table.</h2>
          <p>
            Please reply by <strong>15 July 2026</strong> so we can prepare a beautiful, memorable seaside evening for everyone.
          </p>
          <div className="rsvpAestheticNote">
            <Gift size={20} />
            <div>
              <strong>Dress Code</strong>
              <p>Beachside elegant: Ocean blues, emerald greens, sand, and cream tones.</p>
            </div>
          </div>
        </div>

        <div className="rsvpFormContainer reveal delayOne">
          {rsvpSubmitted ? (
            <div className="rsvpSuccessCard">
              <div className="successCircle">
                <Check size={28} />
              </div>
              <h3>Thank you, {rsvpData.name}!</h3>
              <p className="rsvpStatusCopy">
                {rsvpData.attendance === "Joyfully attending"
                  ? `We've saved your seat! We are thrilled to celebrate with you and ${rsvpData.guests} guest(s) on our big day in Da Nang.`
                  : "We will miss you dearly! Thank you for sending your love and warm wishes from afar. You will be in our hearts."}
              </p>
              {rsvpData.song && rsvpData.attendance === "Joyfully attending" && (
                <div className="songReservedBadge">
                  <Music size={14} />
                  <span>Reserved Song Request: <strong>&ldquo;{rsvpData.song}&rdquo;</strong></span>
                </div>
              )}
              {rsvpData.diet && (
                <p className="dietNote">
                  <strong>Dietary noted:</strong> &ldquo;{rsvpData.diet}&rdquo;
                </p>
              )}
              <div className="rsvpSuccessActions">
                <button className="secondaryButton editRsvpBtn" onClick={handleEditRsvp}>
                  Change RSVP Details
                </button>
              </div>
            </div>
          ) : (
            <form className="rsvpForm" onSubmit={handleRsvpSubmit}>
              <label>
                Full Name
                <input
                  name="name"
                  placeholder="Your name"
                  type="text"
                  required
                  value={rsvpData.name}
                  onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                />
              </label>

              <label>
                Will You Attend?
                <select
                  name="attendance"
                  required
                  value={rsvpData.attendance}
                  onChange={(e) => setRsvpData({ ...rsvpData, attendance: e.target.value })}
                >
                  <option value="" disabled>Select one</option>
                  <option value="Joyfully attending">Joyfully attending</option>
                  <option value="Sending love from afar">Sending love from afar</option>
                </select>
              </label>

              {rsvpData.attendance === "Joyfully attending" && (
                <div className="rsvpConditionalFields">
                  <label className="halfField">
                    Total Party Size
                    <select
                      value={rsvpData.guests}
                      onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                    >
                      <option value="1">Just Me (1)</option>
                      <option value="2">Me & Guest (2)</option>
                      <option value="3">Three of us (3)</option>
                      <option value="4">Four of us (4)</option>
                    </select>
                  </label>

                  <label>
                    Dietary Requirements (Optional)
                    <input
                      name="diet"
                      placeholder="e.g. Vegetarian, Nut allergies, none"
                      type="text"
                      value={rsvpData.diet}
                      onChange={(e) => setRsvpData({ ...rsvpData, diet: e.target.value })}
                    />
                  </label>

                  <label>
                    Song Request for the Dance Floor (Optional)
                    <input
                      name="song"
                      placeholder="Which song will get you dancing?"
                      type="text"
                      value={rsvpData.song}
                      onChange={(e) => setRsvpData({ ...rsvpData, song: e.target.value })}
                    />
                  </label>
                </div>
              )}

              <label>
                Message for the Couple
                <textarea
                  name="note"
                  placeholder="Leave a sweet note or message..."
                  rows={3}
                  value={rsvpData.note}
                  onChange={(e) => setRsvpData({ ...rsvpData, note: e.target.value })}
                />
              </label>

              <button type="submit" className="primaryButton rsvpSubmitBtn">
                <Send size={16} />
                Send RSVP
              </button>
            </form>
          )}
        </div>
      </section>

      {/* GUESTBOOK WISHES WALL (Synced with LocalStorage) */}
      <section className="guestbook" id="guestbook">
        <div className="sectionTitle reveal">
          <MessageSquare className="twinkle" aria-hidden="true" />
          <div>
            <p className="eyebrow">Well Wishes</p>
            <h2>Guestbook Wall</h2>
          </div>
        </div>

        <div className="guestbookLayout">
          {/* Guestbook input form */}
          <form className="guestbookForm reveal" onSubmit={handleWishSubmit}>
            <h3>Leave a Loving Wish</h3>
            <p>Your blessings and well wishes will be displayed on our memory wall.</p>

            <label>
              Your Name
              <input
                type="text"
                placeholder="e.g. Cousin Lam or The Lis"
                required
                value={newWish.name}
                onChange={(e) => setNewWish({ ...newWish, name: e.target.value })}
              />
            </label>

            <label>
              Your Blessing
              <textarea
                placeholder="Write a sweet message, word of advice, or love note..."
                rows={4}
                required
                value={newWish.wish}
                onChange={(e) => setNewWish({ ...newWish, wish: e.target.value })}
              />
            </label>

            <button type="submit" className="secondaryButton wishSubmitBtn">
              <Plus size={16} />
              Add to Wall
            </button>

            {wishStatus && <p className="wishStatusMsg">{wishStatus}</p>}
          </form>

          {/* Guestbook masonry list */}
          <div className="wishesWall reveal">
            {wishes.map((w, idx) => (
              <article key={idx} className="wishCard">
                <div className="wishCardHeart">
                  <Heart size={14} />
                </div>
                <p className="wishMessage">&ldquo;{w.wish}&rdquo;</p>
                <div className="wishMeta">
                  <strong>{w.name}</strong>
                  <span>{w.date}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="weddingFooter">
        <p className="footerKicker">Linh & Minh</p>
        <p className="footerDate">22.08.2026 &bull; Da Nang</p>
        <div className="footerIcon">
          <Heart size={20} />
        </div>
        <p className="footerCopyright">&copy; 2026 Linh & Minh. Built with love.</p>
      </footer>
    </main>
  );
}
