-- =========================
-- SEED: REAL UNIVERSITY EVENTS
-- =========================
-- Categories: HACKATHON, GUEST_LECTURE, WORKSHOP, CLUB_FAIR, NETWORKING, CULTURAL
-- Dates are set for late 2026 / early 2027.

INSERT INTO events (event_id, title, description, date, time, location, capacity, category, featured, created_at)
VALUES

-- ── HACKATHONS ────────────────────────────────────────────────────────────────
(uuid_generate_v4()::text,
 'CodeStorm 2026',
 'A 24-hour hackathon where teams of up to four students tackle real-world problems in AI, sustainability, and fintech. Mentors from leading tech companies will be on-site. Cash prizes and internship fast-tracks await the top three teams.',
 '2026-10-18', '09:00:00', 'Engineering Block A – Innovation Lab', 300,
 'HACKATHON', TRUE, CURRENT_TIMESTAMP),

(uuid_generate_v4()::text,
 'HealthTech Hack',
 'Build technology solutions that improve healthcare access and patient outcomes. Open to students from all disciplines — no prior coding experience required for the design and research tracks. Partnered with City General Hospital.',
 '2026-11-08', '10:00:00', 'Medical Sciences Building, Level 3', 200,
 'HACKATHON', FALSE, CURRENT_TIMESTAMP),

(uuid_generate_v4()::text,
 'GreenByte Hackathon',
 'Collaborate with environmental science and engineering students to prototype digital tools tackling climate change, food waste, and renewable energy. Supported by the UN Sustainable Development Goals initiative.',
 '2027-01-17', '08:30:00', 'Sustainability Hub – Room GH2', 150,
 'HACKATHON', TRUE, CURRENT_TIMESTAMP),

-- ── GUEST LECTURES ────────────────────────────────────────────────────────────
(uuid_generate_v4()::text,
 'The Future of Generative AI – Industry Perspectives',
 'Dr. Aisha Mehta, Principal Scientist at DeepMind, shares insights on large language models, safety alignment, and what the next decade of AI research looks like. Followed by a live Q&A session.',
 '2026-10-07', '14:00:00', 'Auditorium Hall 1', 500,
 'GUEST_LECTURE', TRUE, CURRENT_TIMESTAMP),

(uuid_generate_v4()::text,
 'From Campus to C-Suite: Entrepreneurship Lessons',
 'Serial entrepreneur and alumni Marcus Chen walks through building three startups from a dorm room. Topics include fundraising, product-market fit, and navigating failure. Light refreshments provided.',
 '2026-10-22', '11:00:00', 'Business School Seminar Room B4', 120,
 'GUEST_LECTURE', FALSE, CURRENT_TIMESTAMP),

(uuid_generate_v4()::text,
 'Cybersecurity in the Age of Quantum Computing',
 'Prof. Lena Fischer (TU Berlin) presents emerging threats to classical cryptography and how quantum-resistant algorithms are being standardised by NIST. Suitable for CS and IT students.',
 '2026-11-19', '15:30:00', 'Computer Science Lecture Hall C2', 180,
 'GUEST_LECTURE', FALSE, CURRENT_TIMESTAMP),

(uuid_generate_v4()::text,
 'Mental Health in Tech Workplaces',
 'Clinical psychologist Dr. Priya Nair and engineering lead Sam Torres discuss burnout, imposter syndrome, and building psychological safety in agile teams. Anonymous live poll during the session.',
 '2026-12-03', '13:00:00', 'Student Wellness Centre – Conference Room', 100,
 'GUEST_LECTURE', FALSE, CURRENT_TIMESTAMP),

-- ── WORKSHOPS ─────────────────────────────────────────────────────────────────
(uuid_generate_v4()::text,
 'Machine Learning with Python – Hands-On Bootcamp',
 'A full-day practical workshop covering NumPy, pandas, scikit-learn, and a capstone mini-project predicting student performance. Laptops required. Intermediate Python knowledge assumed.',
 '2026-10-10', '09:00:00', 'IT Lab 204', 40,
 'WORKSHOP', TRUE, CURRENT_TIMESTAMP),

(uuid_generate_v4()::text,
 'UI/UX Design Sprint',
 'Learn the end-to-end design process: user research, wireframing in Figma, usability testing, and handoff to developers. Participants leave with a portfolio-ready case study.',
 '2026-10-25', '10:00:00', 'Design Studio – Creative Hub', 30,
 'WORKSHOP', FALSE, CURRENT_TIMESTAMP),

(uuid_generate_v4()::text,
 'Git & GitHub for Team Projects',
 'Stop losing work and resolve merge conflicts with confidence. This workshop covers branching strategies, pull requests, CI basics, and project board management — perfect for final-year project teams.',
 '2026-11-01', '14:00:00', 'IT Lab 101', 50,
 'WORKSHOP', FALSE, CURRENT_TIMESTAMP),

(uuid_generate_v4()::text,
 'Public Speaking & Presentation Skills',
 'Sharpen your verbal communication for interviews, academic defences, and conference talks. Includes structured speech exercises, peer feedback rounds, and video analysis.',
 '2026-11-15', '10:00:00', 'Communication Arts Room 3', 25,
 'WORKSHOP', FALSE, CURRENT_TIMESTAMP),

(uuid_generate_v4()::text,
 'Academic Research & Writing Workshop',
 'A two-part series helping postgraduate students craft strong literature reviews, understand citation management with Zotero, and navigate publication submission processes.',
 '2026-12-06', '09:30:00', 'Library Learning Commons – Room LL5', 35,
 'WORKSHOP', FALSE, CURRENT_TIMESTAMP),

-- ── NETWORKING ────────────────────────────────────────────────────────────────
(uuid_generate_v4()::text,
 'Tech Career Fair 2026',
 'Over 40 companies from software, finance, and consulting sectors on campus for a day of recruitment, internship offers, and networking. Bring printed copies of your CV. Business casual dress code.',
 '2026-10-30', '10:00:00', 'University Sports Hall – Ground Floor', 1000,
 'NETWORKING', TRUE, CURRENT_TIMESTAMP),

(uuid_generate_v4()::text,
 'Alumni Speed Networking Night',
 'Fifteen-minute rotating conversations with alumni across 20+ industries. Structured to maximise connections in a short time. Dinner and drinks included. Registration capped at 80 students.',
 '2026-11-12', '18:00:00', 'Faculty Club Dining Room', 80,
 'NETWORKING', FALSE, CURRENT_TIMESTAMP),

(uuid_generate_v4()::text,
 'Women in STEM Mixer',
 'An informal evening bringing together female-identifying students, faculty, and industry guests from STEM fields. Hosted by the Women in Engineering Society with sponsorship from Accenture.',
 '2026-11-26', '17:30:00', 'Engineering Atrium', 150,
 'NETWORKING', FALSE, CURRENT_TIMESTAMP),

-- ── CLUB FAIRS ────────────────────────────────────────────────────────────────
(uuid_generate_v4()::text,
 'Societies & Clubs Freshers Fair',
 'The biggest society fair of the academic year. Over 60 clubs spanning robotics, debate, photography, gaming, volunteering, and more set up stalls. Free merchandise and sign-up bonuses for new members.',
 '2026-10-03', '11:00:00', 'Main Campus Quad', 2000,
 'CLUB_FAIR', TRUE, CURRENT_TIMESTAMP),

(uuid_generate_v4()::text,
 'Sports Club Open Day',
 'Try out any of the university''s 25 sports clubs for free. Taster sessions, coach meet-and-greets, and scholarship information for talented athletes. All fitness levels welcome.',
 '2026-10-17', '09:00:00', 'University Sports Complex', 800,
 'CLUB_FAIR', FALSE, CURRENT_TIMESTAMP),

-- ── CULTURAL ─────────────────────────────────────────────────────────────────
(uuid_generate_v4()::text,
 'International Culture Festival',
 'A vibrant celebration featuring food stalls, traditional performances, and exhibitions from 30 countries represented on campus. Organised by the International Students Society. All proceeds go to the student hardship fund.',
 '2026-11-22', '12:00:00', 'Central Campus Square', 3000,
 'CULTURAL', TRUE, CURRENT_TIMESTAMP),

(uuid_generate_v4()::text,
 'Annual Drama Society Production: Echoes',
 'The Drama Society presents Echoes, an original play exploring memory, identity, and belonging. Four performances over two evenings. Tickets free for students; donations encouraged.',
 '2026-12-11', '19:00:00', 'Performing Arts Theatre', 250,
 'CULTURAL', FALSE, CURRENT_TIMESTAMP),

(uuid_generate_v4()::text,
 'Winter Music Gala',
 'An evening of live performances from the University Orchestra, Jazz Ensemble, and student solo acts. Festive themed repertoire and hot drinks served during the interval.',
 '2026-12-18', '18:30:00', 'Great Hall', 400,
 'CULTURAL', TRUE, CURRENT_TIMESTAMP);
