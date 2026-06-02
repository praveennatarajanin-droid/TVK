/**
 * TVK Tambaram MLA - LocalStorage Database Engine (db.js)
 * Implements a unified client-side data layer to enable a fully dynamic website 
 * with a comprehensive administrative backend and local photo upload support.
 */

const TVKDb = (() => {
  const STORAGE_KEY = "tvk_tambaram_database";

  // Initial Seed Data to make the website look highly authentic and rich on first load
  const seedData = {
    config: {
      site_title_en: "Tamilaga Vettri Kazhagam | TVK Party Portal | Chief Minister of TN",
      site_title_ta: "தமிழக வெற்றி கழகம் | தவெக தலைமை இணையதளம் | தமிழக முதல்வர்",
      party_name_en: "Tamilaga Vettri Kazhagam (TVK)",
      party_name_ta: "தமிழக வெற்றி கழகம் (தவெக)",
      mla_name_en: "Thalapathy Vijay",
      mla_name_ta: "தளபதி விஜய்",
      mla_title_en: "TVK Founder-President & Hon'ble Chief Minister of Tamil Nadu",
      mla_title_ta: "தவெக நிறுவனத் தலைவர் & மாண்புமிகு தமிழக முதலமைச்சர்",
      marquee_news_en: "🏆 TVK President Thalapathy Vijay sworn in as Chief Minister of Tamil Nadu! • Historic thanksgiving rally held in Tiruchirappalli: Vijay declares TVK as the primary alternative in TN • Membership drive achieves record 1 crore registrations • Public helpline launched: 1800-425-4545",
      marquee_news_ta: "🏆 தவெக தலைவர் தளபதி விஜய் தமிழக முதலமைச்சராக பொறுப்பேற்பு! • திருச்சியில் நடந்த பிரம்மாண்ட நன்றி அறிவிப்பு கூட்டம்: தவெகவே தமிழகத்தின் முதன்மை மாற்று என விஜய் பிரகடனம் • தவெக உறுப்பினர் சேர்க்கை 1 கோடியை கடந்து சாதனை • மக்கள் உதவி எண்: 1800-425-4545",
      phone: "+91 44 2465 1234",
      email: "contact@tvk.org.in",
      office_address_en: "TVK Headquarters, No. 25, Bhaktiyar Street, Panneerselvam Nagar, Panaiyur, Chennai - 600119",
      office_address_ta: "தவெக தலைமை நிலையம், எண். 25, பக்தியார் தெரு, பன்னீர்செல்வம் நகர், பனையூர், சென்னை - 600119",
      facebook: "https://facebook.com/tvkofficial",
      twitter: "https://twitter.com/tvkofficial",
      instagram: "https://instagram.com/tvkofficial",
      youtube: "https://youtube.com/c/TVKOfficial",
      mla_image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Vijay_at_the_Nadigar_Sangam_Protest.jpg",
      leader_image_url: "images/tvklogo.png",
      admin_password: "tvk2026"
    },
    news: [
      {
        id: "news_1",
        title_en: "Chief Minister Vijay's first massive Thanksgiving Rally in Trichy: Declares political battlefield is only between TVK and DMK",
        title_ta: "திருச்சியில் முதல்வர் விஜய் பங்கேற்ற பிரம்மாண்ட தவெக நன்றி அறிவிப்பு விழா: தவெக vs திமுக இடையே தான் நேரடிப் போட்டி எனப் பிரகடனம்",
        content_en: "Tamilaga Vettri Kazhagam (TVK) President and newly sworn-in Chief Minister C. Joseph Vijay addressed a massive thanksgiving meeting in Tiruchirappalli today, marking his first major public appearance since assuming office. Addressing a crowd of lakhs of supporters, Vijay declared that the political battlefield in Tamil Nadu is now a binary contest only between TVK and the ruling DMK, dismissing the relevance of other political forces. He rejected all allegations of horse-trading in the post-election government formation, asserting that his administration would offer a secular, transparent, and corruption-free governance model based on social justice.",
        content_ta: "தமிழக வெற்றி கழகத்தின் (தவெக) நிறுவனத் தலைவரும் மாண்புமிகு தமிழக முதலமைச்சருமான தளபதி விஜய், பதவியேற்ற பிறகு தனது முதல் பிரம்மாண்ட மக்கள் நன்றி அறிவிப்பு கூட்டத்தில் திருச்சிராப்பள்ளியில் இன்று உரையாற்றினார். லட்சக்கணக்கான மக்கள் திரண்டிருந்த இந்தக் கூட்டத்தில் உரையாற்றிய முதல்வர் விஜய், தமிழகத்தில் இனி களம் என்பது தவெக மற்றும் திமுக ஆகிய இரு கட்சிகளுக்கு இடையே மட்டுமேயான நேரடிப் போட்டி என்று பிரகடனம் செய்தார். ஆட்சி அமைப்பது தொடர்பாக தன் மீது சுமத்தப்பட்ட அவதூறுகளை திட்டவட்டமாக மறுத்த அவர், சமூக நீதி, மதச்சார்பற்ற தன்மை மற்றும் வெளிப்படையான ஊழலற்ற நிர்வாகத்தை மக்கள் நலனுக்காக தவெக அரசு வழங்கும் என்றார்.",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Vijay_at_the_Nadigar_Sangam_Protest.jpg",
        category: "Press Releases",
        date: "2026-06-01",
        is_featured: true
      },
      {
        id: "news_2",
        title_en: "TVK Government passes Vote of Confidence in Legislative Assembly; CM Vijay outlines welfare plan",
        title_ta: "தமிழக சட்டப்பேரவையில் தவெக அரசு பெரும்பான்மையை நிரூபித்தது; புதிய மக்கள் நலத்திட்டங்களை அறிவித்தார் முதல்வர் விஜய்",
        content_en: "The newly formed TVK government under Chief Minister Vijay successfully passed the vote of confidence in the Tamil Nadu Legislative Assembly at Fort St. George today. Securing 144 votes in favor with support from alliance partners, the motion was carried smoothly. In his maiden assembly address, Chief Minister Vijay outlined his government's priority sectors, including youth employment reforms under the Human Resources Department, digital grievance cells, and accelerated restoration of water channels across Chennai and key municipal districts.",
        content_ta: "தலைமைச் செயலகமான கோட்டை செயின்ட் ஜார்ஜில் இன்று நடைபெற்ற சட்டமன்றக் கூட்டத்தொடரில், தவெக அரசு தனது பெரும்பான்மையை வெற்றிகரமாக நிரூபித்தது. கூட்டணி கட்சிகளின் ஆதரவுடன் 144 வாக்குகள் பெற்று நம்பிக்கை தீர்மானம் வெற்றி பெற்றது. தனது முதல் பேரவை உரையில் பேசிய முதலமைச்சர் விஜய், அரசுப் பணிகளில் வெளிப்படையான வேலைவாய்ப்பு சீர்திருத்தங்கள், டிஜிட்டல் முறையிலான மக்கள் குறைதீர்ப்பு மையங்கள் மற்றும் தமிழகத்தின் முக்கிய நீர்நிலைகளைப் பாதுகாக்கும் திட்டங்களுக்கு முன்னுரிமை அளிக்கப்படும் என்று உறுதியளித்தார்.",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Fort_St_George_Chennai.JPG",
        category: "Constituency Work",
        date: "2026-05-28",
        is_featured: false
      },
      {
        id: "news_3",
        title_en: "CM Vijay resigns from Tiruchirappalli East, retains Perambur Assembly Constituency",
        title_ta: "திருச்சி கிழக்கு தொகுதியை ராஜினாமா செய்து பெரம்பூர் தொகுதி சட்டமன்ற உறுப்பினராக நீடிக்கிறார் முதல்வர் விஜய்",
        content_en: "Following his victory in both Tiruchirappalli East and Perambur assembly constituencies in the 2026 elections, Chief Minister Vijay has formally resigned from the Tiruchirappalli East seat. He will continue to represent the Perambur constituency in the Legislative Assembly. The Election Commission will announce the by-election dates for the vacant Tiruchirappalli East seat shortly, which is expected to witness a high-profile electoral contest.",
        content_ta: "அண்மையில் நடைபெற்ற சட்டமன்றத் தேர்தல் முடிவுகளில் திருச்சி கிழக்கு மற்றும் பெரம்பூர் ஆகிய இரு தொகுதிகளிலும் வெற்றி பெற்ற மாண்புமிகு முதலமைச்சர் விஜய், தனது திருச்சி கிழக்கு தொகுதி சட்டமன்ற உறுப்பினர் பதவியை அதிகாரப்பூர்வமாக ராஜினாமா செய்தார். அவர் சென்னை பெரம்பூர் தொகுதி உறுப்பினராகத் தொடர்ந்து நீடிப்பார். காலியாக உள்ள திருச்சி கிழக்கு தொகுதிக்கு விரைவில் இடைத்தேர்தல் தேதியை தேர்தல் ஆணையம் அறிவிக்கும் என எதிர்பார்க்கப்படுகிறது.",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Srirangam_temple_gopuram.jpg",
        category: "Press Releases",
        date: "2026-05-25",
        is_featured: false
      },
      {
        id: "news_4",
        title_en: "TVK Headquarters launches statewide Membership Drive Campaign; targets 2 crore members",
        title_ta: "தமிழகம் முழுவதும் தவெகவின் புதிய உறுப்பினர் சேர்க்கை முகாம் துவக்கம்; 2 கோடி உறுப்பினர்களை சேர்க்க இலக்கு",
        content_en: "TVK General Secretary announced the launch of the second phase of the party's statewide membership drive. Following the party's ascension to power, there has been an unprecedented surge in youth registration. Using a state-of-the-art digital portal and mobile application, the party aims to register over 2 crore members by the end of 2026. Local party cadres have been instructed to conduct door-to-door enrollment camps in every village and municipal ward.",
        content_ta: "தமிழக வெற்றி கழகத்தின் மாநில அளவிலான புதிய உறுப்பினர் சேர்க்கை இயக்கத்தின் இரண்டாம் கட்டத்தை கட்சியின் பொதுச்செயலாளர் இன்று தொடங்கி வைத்தார். தவெக ஆட்சிப் பொறுப்பேற்றதைத் தொடர்ந்து, லட்சக்கணக்கான இளைஞர்கள் கட்சியில் இணைய ஆர்வம் காட்டி வருகின்றனர். புதிய இணையதளம் மற்றும் மொபைல் ஆப் மூலமாக 2026-க்குள் 2 கோடி உறுப்பினர்களைச் சேர்க்க கட்சி இலக்கு நிர்ணயித்துள்ளது. கிராமங்கள் மற்றும் வார்டுகள் தோறும் முகாம்கள் நடத்த தொண்டர்களுக்கு அறிவுறுத்தப்பட்டுள்ளது.",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Marina_Beach_Chennai.jpg",
        category: "Welfare Activities",
        date: "2026-05-20",
        is_featured: false
      }
    ],
    projects: [
      {
        id: "proj_1",
        title_en: "TVK Smart Employment Portal & Civil Services Study Centers",
        title_ta: "தவெக ஸ்மார்ட் வேலைவாய்ப்பு போர்ட்டல் & அரசுத் தேர்வு இலவச பயிலகம்",
        description_en: "Setting up 50 free digital study centers across key districts in Tamil Nadu to provide materials and coaching for civil service exams.",
        description_ta: "தமிழகம் முழுவதும் 50 நவீன இலவச டிஜிட்டல் பயிலகங்களைத் தொடங்கி, போட்டித் தேர்வுகளுக்குத் தயாராகும் மாணவர்களுக்கு இலவசப் பயிற்சிகளும் நூலக வசதிகளும் வழங்குதல்.",
        status: "ongoing",
        location_en: "All 38 Districts of Tamil Nadu",
        location_ta: "தமிழகத்தின் அனைத்து 38 மாவட்டங்கள்",
        impact_en: "Empowers 2,00,000+ government job aspirants",
        impact_ta: "2,00,000-க்கும் மேற்பட்ட அரசு வேலை தேடும் இளைஞர்கள் பயன்பெறுவர்"
      },
      {
        id: "proj_2",
        title_en: "Ecological Restoration of River Basins & Urban Water Bodies",
        title_ta: "ஆற்றுப் படுகைகள் மற்றும் நகர்ப்புற நீர்நிலைகள் சுற்றுச்சூழல் சீரமைப்புத் திட்டம்",
        description_en: "Desiltation and ecological restoration of major river channels including Cauvery, Adyar, and Cooum river basins to prevent water-logging and increase groundwater recharge.",
        description_ta: "வெள்ளநீர் தேங்குவதைத் தடுக்கவும் நிலத்தடி நீர்மட்டத்தை உயர்த்தவும் காவேரி, அடையாறு, கூவம் உள்ளிட்ட முக்கிய ஆற்றுப் படுகைகள் மற்றும் ஏரிகளைத் தூர்வாரி தூய்மைப்படுத்துதல்.",
        status: "ongoing",
        location_en: "Trichy, Chennai & Madurai Districts",
        location_ta: "திருச்சி, சென்னை & மதுரை மாவட்டங்கள்",
        impact_en: "Protects millions of citizens from monsoon floods",
        impact_ta: "மழைக்கால வெள்ளப் பாதிப்புகளில் இருந்து கோடிக்கணக்கான மக்களைப் பாதுகாக்கும்"
      },
      {
        id: "proj_3",
        title_en: "TVK Chief Minister's Grievance Redressal Digitization (CM-GRID)",
        title_ta: "முதல்வரின் டிஜிட்டல் குறைதீர்ப்பு மேலாண்மைத் திட்டம் (CM-GRID)",
        description_en: "Integrating block-level municipal public feedback systems directly with the CM desk via automated file-tracking and dashboard notifications.",
        description_ta: "வார்டு மற்றும் பஞ்சாயத்து அளவிலான பொதுமக்களின் குறைகளை நேரடியாக முதல்வர் அலுவலகத்துடன் இணைக்கும் அதிநவீன டிஜிட்டல் மனு கண்காணிப்புத் திட்டம்.",
        status: "completed",
        location_en: "Statewide roll-out in Secretariat",
        location_ta: "தலைமைச் செயலகம், மாநில அளவிலான வெளியீடு",
        impact_en: "Resolves public petitions within 15 working days",
        impact_ta: "பொதுமக்களின் மனுக்களுக்கு 15 வேலை நாட்களுக்குள் தீர்வு காணப்படும்"
      }
    ],
    gallery: [
      {
        id: "gal_1",
        caption_en: "Chief Minister Thalapathy Vijay taking the oath of office at the Fort St. George Secretariat",
        caption_ta: "தலைமைச் செயலகத்தில் தமிழக முதலமைச்சராக தளபதி விஜய் உறுதிமொழி எடுத்துப் பொறுப்பேற்ற நிகழ்வு",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Fort_St_George_Chennai.JPG",
        date: "2026-05-15"
      },
      {
        id: "gal_2",
        caption_en: "Lakhs of TVK cadres gathering at the historic Tiruchirappalli thanksgiving public meeting",
        caption_ta: "திருச்சியில் நடைபெற்ற பிரம்மாண்ட நன்றி அறிவிப்பு மாநாட்டில் திரண்ட தவெக தொண்டர்கள் மற்றும் பொதுமக்கள் வெள்ளம்",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Srirangam_temple_gopuram.jpg",
        date: "2026-06-01"
      },
      {
        id: "gal_3",
        caption_en: "CM Vijay inspecting ongoing canal clearance and ecological projects in Perambur",
        caption_ta: "பெரம்பூர் தொகுதியில் நடைபெற்று வரும் கால்வாய் தூர்வாரும் தூய்மைப் பணிகளை நேரில் பார்வையிட்டு ஆய்வு செய்த முதல்வர்",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Marina_Beach_Chennai.jpg",
        date: "2026-05-24"
      },
      {
        id: "gal_4",
        caption_en: "CM Vijay chairing the first State Cabinet meeting to clear student welfare and education schemes",
        caption_ta: "மாணவர்கள் நலன் மற்றும் அரசு வேலைவாய்ப்பு சீர்திருத்தக் கோப்புகளில் கையெழுத்திட முதலமைச்சரின் தலைமையில் நடைபெற்ற அமைச்சரவைக் கூட்டம்",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Kapaleeshwarar_Temple_Chennai.jpg",
        date: "2026-05-18"
      }
    ],
    videos: [
      {
        id: "vid_1",
        title_en: "CM Thalapathy Vijay Address at Trichy Thanksgiving Rally - Full Speech",
        title_ta: "திருச்சி தவெக நன்றி அறிவிப்பு மாநாட்டில் முதல்வர் விஜயின் முழு உரை",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Vijay_at_the_Nadigar_Sangam_Protest.jpg"
      },
      {
        id: "vid_2",
        title_en: "First Cabinet Meeting chaired by CM Vijay - Press Briefing",
        title_ta: "தமிழக முதல்வர் விஜய் தலைமையிலான முதல் அமைச்சரவைக் கூட்டத்தின் செய்தியாளர் சந்திப்பு",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Fort_St_George_Chennai.JPG"
      }
    ],
    grievances: [
      {
        id: "griev_1",
        name: "K. Ranganathan",
        email: "ranga.perambur@gmail.com",
        phone: "+91 98400 98765",
        ward_no: "Ward 12 (Perambur)",
        grievance_type: "Roads & Traffic",
        description: "The main approach road to Perambur subway has deep potholes that collect water. Please relay the road and clear storm water drains.",
        date: "2026-06-01",
        status: "reviewed"
      },
      {
        id: "griev_2",
        name: "Meenakshi Sundaram",
        email: "meena.trichy@yahoo.com",
        phone: "+91 97900 12345",
        ward_no: "Ward 5 (Trichy East)",
        grievance_type: "Water Supply",
        description: "Drinking water distribution is irregular. Kindly inspect and ensure regular supply.",
        date: "2026-05-30",
        status: "pending"
      }
    ]
  };

  /**
   * Safe retrieval of database from localStorage. If database is not found,
   * seeds the database with our premium sample content.
   */
  const getDb = () => {
    let db = localStorage.getItem(STORAGE_KEY);
    if (!db) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }
    try {
      const parsed = JSON.parse(db);
      
      // Force migration if old D. Sarathkumar data is found or if social links or logo filename are outdated
      const needsMigration = !parsed.config || 
                             (parsed.config.mla_name_en && parsed.config.mla_name_en.includes("Sarathkumar")) || 
                             !parsed.config.facebook || 
                             parsed.config.facebook === "#" || 
                             parsed.config.facebook.includes("tambaram") ||
                             !parsed.config.leader_image_url ||
                             parsed.config.leader_image_url.includes("tvk_logo.png");
                             
      if (needsMigration) {
        console.log("Forcing re-seed for TVK CM Vijay news portal");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
        return seedData;
      }
      
      // Auto-validate and repair any missing collections compared to seedData
      let repaired = false;
      
      if (!parsed.config) {
        parsed.config = { ...seedData.config };
        repaired = true;
      }
      if (!parsed.news || !Array.isArray(parsed.news)) {
        parsed.news = [ ...seedData.news ];
        repaired = true;
      }
      if (!parsed.projects || !Array.isArray(parsed.projects)) {
        parsed.projects = [ ...seedData.projects ];
        repaired = true;
      }
      if (!parsed.gallery || !Array.isArray(parsed.gallery)) {
        parsed.gallery = [ ...seedData.gallery ];
        repaired = true;
      }
      if (!parsed.videos || !Array.isArray(parsed.videos)) {
        parsed.videos = [ ...seedData.videos ];
        repaired = true;
      }
      if (!parsed.grievances || !Array.isArray(parsed.grievances)) {
        parsed.grievances = [ ...seedData.grievances ];
        repaired = true;
      }

      // Preserve Wikimedia Commons images - only replace if completely blank or invalid
      let updated = false;
      if (!parsed.config.mla_image_url || parsed.config.mla_image_url === "") {
        parsed.config.mla_image_url = seedData.config.mla_image_url;
        updated = true;
      }
      if (!parsed.config.leader_image_url || parsed.config.leader_image_url === "") {
        parsed.config.leader_image_url = seedData.config.leader_image_url;
        updated = true;
      }

      if (repaired || updated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      console.error("Database corruption detected. Re-seeding database.", e);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
      return seedData;
    }
  };

  const saveDb = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return {
    // ---------------- INITIALIZATION METHODS ----------------
    init: async () => {
      try {
        console.log("Syncing database with backend server...");
        const res = await fetch('/api/db');
        const data = await res.json();
        saveDb(data);
        return data;
      } catch (e) {
        console.warn("Could not sync with backend server. Using client cache.", e);
        return getDb();
      }
    },

    // ---------------- CONFIG / SETTINGS METHODS ----------------
    getConfig: () => {
      return getDb().config;
    },
    updateConfig: (newConfig) => {
      const db = getDb();
      db.config = { ...db.config, ...newConfig };
      saveDb(db);
      
      // Async backend sync
      fetch('/api/db/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      }).catch(err => console.error("Server sync failed:", err));
      
      return db.config;
    },

    // ---------------- NEWS METHODS ----------------
    getNews: () => {
      // Sort news by date descending, featured news always first
      return getDb().news.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return new Date(b.date) - new Date(a.date);
      });
    },
    getNewsItem: (id) => {
      return getDb().news.find(item => item.id === id);
    },
    saveNewsItem: (item) => {
      const db = getDb();
      let updatedItem = { ...item };
      
      if (updatedItem.id) {
        const idx = db.news.findIndex(n => n.id === updatedItem.id);
        if (idx !== -1) {
          if (updatedItem.is_featured) {
            db.news.forEach(n => n.is_featured = false);
          }
          db.news[idx] = { ...db.news[idx], ...updatedItem };
        }
      } else {
        updatedItem.id = "news_" + Date.now();
        updatedItem.date = updatedItem.date || new Date().toISOString().split("T")[0];
        if (updatedItem.is_featured) {
          db.news.forEach(n => n.is_featured = false);
        }
        db.news.push(updatedItem);
      }
      saveDb(db);
      
      // Async backend sync
      fetch('/api/db/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      }).catch(err => console.error("Server sync failed:", err));
      
      return updatedItem;
    },
    deleteNewsItem: (id) => {
      const db = getDb();
      db.news = db.news.filter(n => n.id !== id);
      saveDb(db);
      
      // Async backend sync
      fetch(`/api/db/news/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error("Server sync failed:", err));
      
      return true;
    },

    // ---------------- CONSTITUENCY PROJECTS METHODS ----------------
    getProjects: () => {
      return getDb().projects;
    },
    saveProject: (item) => {
      const db = getDb();
      let updatedItem = { ...item };
      
      if (updatedItem.id) {
        const idx = db.projects.findIndex(p => p.id === updatedItem.id);
        if (idx !== -1) {
          db.projects[idx] = { ...db.projects[idx], ...updatedItem };
        }
      } else {
        updatedItem.id = "proj_" + Date.now();
        db.projects.push(updatedItem);
      }
      saveDb(db);
      
      // Async backend sync
      fetch('/api/db/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      }).catch(err => console.error("Server sync failed:", err));
      
      return updatedItem;
    },
    deleteProject: (id) => {
      const db = getDb();
      db.projects = db.projects.filter(p => p.id !== id);
      saveDb(db);
      
      // Async backend sync
      fetch(`/api/db/projects/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error("Server sync failed:", err));
      
      return true;
    },

    // ---------------- GALLERY METHODS ----------------
    getGallery: () => {
      return getDb().gallery.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    saveGalleryItem: (item) => {
      const db = getDb();
      let updatedItem = { ...item };
      
      if (!updatedItem.id) {
        updatedItem.id = "gal_" + Date.now();
      }
      updatedItem.date = updatedItem.date || new Date().toISOString().split("T")[0];
      db.gallery.push(updatedItem);
      saveDb(db);
      
      // Async backend sync
      fetch('/api/db/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      }).catch(err => console.error("Server sync failed:", err));
      
      return updatedItem;
    },
    deleteGalleryItem: (id) => {
      const db = getDb();
      db.gallery = db.gallery.filter(g => g.id !== id);
      saveDb(db);
      
      // Async backend sync
      fetch(`/api/db/gallery/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error("Server sync failed:", err));
      
      return true;
    },

    // ---------------- VIDEO GALLERY METHODS ----------------
    getVideos: () => {
      return getDb().videos;
    },
    saveVideo: (item) => {
      const db = getDb();
      let updatedItem = { ...item };
      
      if (updatedItem.id) {
        const idx = db.videos.findIndex(v => v.id === updatedItem.id);
        if (idx !== -1) {
          db.videos[idx] = { ...db.videos[idx], ...updatedItem };
        }
      } else {
        updatedItem.id = "vid_" + Date.now();
        // Convert watch youtube urls into embed compatible format if needed
        if (updatedItem.video_url.includes("youtube.com/watch?v=")) {
          const videoId = updatedItem.video_url.split("v=")[1].split("&")[0];
          updatedItem.video_url = `https://www.youtube.com/embed/${videoId}`;
        } else if (updatedItem.video_url.includes("youtu.be/")) {
          const videoId = updatedItem.video_url.split("youtu.be/")[1].split("?")[0];
          updatedItem.video_url = `https://www.youtube.com/embed/${videoId}`;
        }
        db.videos.push(updatedItem);
      }
      saveDb(db);
      
      // Async backend sync
      fetch('/api/db/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      }).catch(err => console.error("Server sync failed:", err));
      
      return updatedItem;
    },
    deleteVideo: (id) => {
      const db = getDb();
      db.videos = db.videos.filter(v => v.id !== id);
      saveDb(db);
      
      // Async backend sync
      fetch(`/api/db/videos/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error("Server sync failed:", err));
      
      return true;
    },

    // ---------------- GRIEVANCE METHODS ----------------
    getGrievances: () => {
      return getDb().grievances.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    addGrievance: async (grievance) => {
      try {
        const res = await fetch('/api/db/grievances', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(grievance)
        });
        const result = await res.json();
        
        // Also update local cache
        const db = getDb();
        const fullGrievance = {
          ...grievance,
          id: result.trackingId,
          date: new Date().toISOString().split('T')[0],
          status: 'pending'
        };
        db.grievances.push(fullGrievance);
        saveDb(db);
        
        return fullGrievance;
      } catch (err) {
        console.error("Grievance submission to server failed, using local offline mode:", err);
        // Offline fallback
        const db = getDb();
        grievance.id = "griev_" + Date.now();
        grievance.date = new Date().toISOString().split("T")[0];
        grievance.status = "pending";
        db.grievances.push(grievance);
        saveDb(db);
        return grievance;
      }
    },
    updateGrievanceStatus: (id, status) => {
      const db = getDb();
      const idx = db.grievances.findIndex(g => g.id === id);
      if (idx !== -1) {
        db.grievances[idx].status = status;
        saveDb(db);
        
        // Sync to backend via POST
        fetch('/api/db/grievances', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(db.grievances[idx])
        }).catch(err => console.error("Server sync failed:", err));
        
        return db.grievances[idx];
      }
      return null;
    },
    deleteGrievance: (id) => {
      const db = getDb();
      db.grievances = db.grievances.filter(g => g.id !== id);
      saveDb(db);
      return true;
    },
    
    // Helper to completely reset database to initial seed data
    resetDb: async () => {
      try {
        await fetch('/api/db/reset', { method: 'POST' });
        const res = await fetch('/api/db');
        const data = await res.json();
        saveDb(data);
        return data;
      } catch (e) {
        console.error("Server reset failed, reverting local only", e);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
        return seedData;
      }
    }
  };
})();
