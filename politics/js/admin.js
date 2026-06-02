/**
 * TVK Tambaram MLA - Admin Dashboard Script (admin.js)
 * Manages admin view states, CRUD data submissions, canvas base64 image compression,
 * settings updating, and citizen grievance petition review flows.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Active Sidebar panel state
  let currentPanel = "settings";
  let editingNewsId = null;
  let editingProjectId = null;
  let editingVideoId = null;

  // Active Base64 Upload Buffers
  let newsImageBase64 = "";
  let galleryImageBase64 = "";

  const elements = {
    sidebarBtns: document.querySelectorAll(".sidebar-btn"),
    panels: document.querySelectorAll(".admin-panel"),
    
    // Config form elements
    configForm: document.getElementById("config-form"),
    resetDbBtn: document.getElementById("reset-db-btn"),
    
    // News elements
    newsForm: document.getElementById("news-form"),
    newsTableBody: document.getElementById("news-table-body"),
    newsFileInput: document.getElementById("news-file"),
    newsImgPreview: document.getElementById("news-img-preview"),
    cancelNewsEditBtn: document.getElementById("cancel-news-edit"),
    newsFormTitle: document.getElementById("news-form-title"),
    
    // Project elements
    projectForm: document.getElementById("project-form"),
    projectsTableBody: document.getElementById("projects-table-body"),
    cancelProjEditBtn: document.getElementById("cancel-proj-edit"),
    projFormTitle: document.getElementById("proj-form-title"),
    
    // Gallery & Video elements
    galleryForm: document.getElementById("gallery-form"),
    galleryFileInput: document.getElementById("gallery-file"),
    galleryTableBody: document.getElementById("gallery-table-body"),
    videoForm: document.getElementById("video-form"),
    videosTableBody: document.getElementById("videos-table-body"),
    
    // Grievance inbox
    grievancesTableBody: document.getElementById("grievances-table-body"),
    
    // Alert banners
    adminAlert: document.getElementById("admin-alert")
  };

  // ---------------- SIDEBAR PANEL CONTROLLER ----------------
  elements.sidebarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      elements.sidebarBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      currentPanel = btn.getAttribute("data-panel");
      
      elements.panels.forEach(p => {
        if (p.id === `${currentPanel}-panel`) {
          p.classList.add("active");
        } else {
          p.classList.remove("active");
        }
      });
      
      // Load panel specific data on activation
      loadPanelData();
    });
  });

  const loadPanelData = () => {
    showAdminAlert("", "hidden");
    if (currentPanel === "settings") {
      loadSettingsForm();
    } else if (currentPanel === "news") {
      loadNewsTable();
    } else if (currentPanel === "projects") {
      loadProjectsTable();
    } else if (currentPanel === "gallery") {
      loadGalleryTable();
      loadVideosTable();
    } else if (currentPanel === "grievances") {
      loadGrievanceInbox();
    }
    updateDashboardStats();
  };

  // ---------------- GENERAL STATS LOGGER ----------------
  const updateDashboardStats = () => {
    document.getElementById("stat-count-news").textContent = TVKDb.getNews().length;
    document.getElementById("stat-count-projects").textContent = TVKDb.getProjects().length;
    document.getElementById("stat-count-photos").textContent = TVKDb.getGallery().length;
    document.getElementById("stat-count-grievances").textContent = TVKDb.getGrievances().filter(g => g.status === 'pending').length;
  };

  // ---------------- CANVAS IMAGE COMPRESSOR (CRITICAL) ----------------
  /**
   * Reads a local file, draws it onto a canvas, compresses it to standard size
   * and JPEG format, and yields a base64 Data URL. Keeps LocalStorage within quotas.
   */
  const processImageUpload = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        
        // Scale down to max width 800px
        const MAX_WIDTH = 800;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        // Output compressed JPEG at 0.75 quality
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
        callback(compressedBase64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // ---------------- 1. SETTINGS PANEL ----------------
  const loadSettingsForm = () => {
    const config = TVKDb.getConfig();
    
    document.getElementById("cfg-site-title-en").value = config.site_title_en || "";
    document.getElementById("cfg-site-title-ta").value = config.site_title_ta || "";
    document.getElementById("cfg-mla-name-en").value = config.mla_name_en || "";
    document.getElementById("cfg-mla-name-ta").value = config.mla_name_ta || "";
    document.getElementById("cfg-mla-title-en").value = config.mla_title_en || "";
    document.getElementById("cfg-mla-title-ta").value = config.mla_title_ta || "";
    document.getElementById("cfg-marquee-en").value = config.marquee_news_en || "";
    document.getElementById("cfg-marquee-ta").value = config.marquee_news_ta || "";
    document.getElementById("cfg-phone").value = config.phone || "";
    document.getElementById("cfg-email").value = config.email || "";
    document.getElementById("cfg-address-en").value = config.office_address_en || "";
    document.getElementById("cfg-address-ta").value = config.office_address_ta || "";
    document.getElementById("cfg-fb").value = config.facebook || "";
    document.getElementById("cfg-tw").value = config.twitter || "";
    document.getElementById("cfg-ig").value = config.instagram || "";
    document.getElementById("cfg-yt").value = config.youtube || "";
    document.getElementById("cfg-mla-img").value = config.mla_image_url || "";
    
    const mlaAvatarPreview = document.getElementById("cfg-mla-img-preview");
    if (mlaAvatarPreview && config.mla_image_url) {
      mlaAvatarPreview.src = config.mla_image_url;
      mlaAvatarPreview.style.display = "block";
    }
    const dashboardMlaAvatar = document.getElementById("dashboard-mla-avatar");
    if (dashboardMlaAvatar && config.mla_image_url) {
      dashboardMlaAvatar.src = config.mla_image_url;
    }
  };

  elements.configForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newConfig = {
      site_title_en: document.getElementById("cfg-site-title-en").value.trim(),
      site_title_ta: document.getElementById("cfg-site-title-ta").value.trim(),
      mla_name_en: document.getElementById("cfg-mla-name-en").value.trim(),
      mla_name_ta: document.getElementById("cfg-mla-name-ta").value.trim(),
      mla_title_en: document.getElementById("cfg-mla-title-en").value.trim(),
      mla_title_ta: document.getElementById("cfg-mla-title-ta").value.trim(),
      marquee_news_en: document.getElementById("cfg-marquee-en").value.trim(),
      marquee_news_ta: document.getElementById("cfg-marquee-ta").value.trim(),
      phone: document.getElementById("cfg-phone").value.trim(),
      email: document.getElementById("cfg-email").value.trim(),
      office_address_en: document.getElementById("cfg-address-en").value.trim(),
      office_address_ta: document.getElementById("cfg-address-ta").value.trim(),
      facebook: document.getElementById("cfg-fb").value.trim(),
      twitter: document.getElementById("cfg-tw").value.trim(),
      instagram: document.getElementById("cfg-ig").value.trim(),
      youtube: document.getElementById("cfg-yt").value.trim(),
      mla_image_url: document.getElementById("cfg-mla-img").value.trim()
    };

    // If an MLA image file was uploaded
    const mlaFileSelect = document.getElementById("cfg-mla-file");
    if (mlaFileSelect.files.length > 0) {
      processImageUpload(mlaFileSelect.files[0], (base64) => {
        newConfig.mla_image_url = base64;
        TVKDb.updateConfig(newConfig);
        showAdminAlert("Global Configuration Settings updated successfully!", "success");
        loadPanelData();
      });
    } else {
      TVKDb.updateConfig(newConfig);
      showAdminAlert("Global Configuration Settings updated successfully!", "success");
      loadPanelData();
    }
  });

  // Settings File Input Listener
  document.getElementById("cfg-mla-file").addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      processImageUpload(e.target.files[0], (base64) => {
        document.getElementById("cfg-mla-img-preview").src = base64;
        document.getElementById("cfg-mla-img-preview").style.display = "block";
      });
    }
  });

  elements.resetDbBtn.addEventListener("click", () => {
    if (confirm("WARNING: This will completely reset the database to initial TVK default seeds. All custom news, projects, uploaded pictures, and grievances will be erased. Proceed?")) {
      TVKDb.resetDb();
      showAdminAlert("Database reset to factory seeds completed successfully!", "success");
      loadPanelData();
    }
  });

  // Auto-Fetch News Click Handler
  const autoFetchBtn = document.getElementById("auto-fetch-news-btn");
  if (autoFetchBtn) {
    autoFetchBtn.addEventListener("click", async () => {
      const originalHtml = autoFetchBtn.innerHTML;
      autoFetchBtn.disabled = true;
      autoFetchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching News...';
      autoFetchBtn.style.backgroundColor = "#7F8C8D";
      autoFetchBtn.style.borderColor = "#7F8C8D";
      
      try {
        const res = await fetch('/api/db/news/fetch', { method: 'POST' });
        const result = await res.json();
        
        if (result.success) {
          // Re-sync client database from backend server state
          await TVKDb.init();
          
          if (result.addedCount > 0) {
            showAdminAlert(`Success! Aggregated and added ${result.addedCount} new real news articles from trusted sources.`, "success");
            loadNewsTable();
            updateDashboardStats();
          } else {
            showAdminAlert("News is already up to date. No new articles found.", "success");
          }
        } else {
          showAdminAlert(`News fetch failed: ${result.error || 'Unknown error'}`, "error");
        }
      } catch (err) {
        console.error("Auto-fetch error:", err);
        showAdminAlert("Network error occurred while fetching news.", "error");
      } finally {
        autoFetchBtn.disabled = false;
        autoFetchBtn.innerHTML = originalHtml;
        autoFetchBtn.style.backgroundColor = "#27AE60";
        autoFetchBtn.style.borderColor = "#27AE60";
      }
    });
  }

  // ---------------- 2. NEWS PANEL ----------------
  elements.newsFileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      processImageUpload(e.target.files[0], (base64) => {
        newsImageBase64 = base64;
        elements.newsImgPreview.src = base64;
        elements.newsImgPreview.style.display = "block";
      });
    }
  });

  const loadNewsTable = () => {
    const news = TVKDb.getNews();
    elements.newsTableBody.innerHTML = "";
    
    if (news.length === 0) {
      elements.newsTableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: var(--text-muted);">No news posts found.</td></tr>`;
      return;
    }

    news.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img class="table-thumb" src="${item.image_url}" alt="News"></td>
        <td>
          <div style="font-weight: 700; color: var(--primary);">${item.title_ta}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">EN: ${item.title_en}</div>
        </td>
        <td><span class="badge badge-primary" style="font-size: 0.65rem;">${item.category}</span></td>
        <td>
          <div style="font-size: 0.85rem; font-weight: 600;">${item.date}</div>
          ${item.is_featured ? '<span class="status-pill" style="background-color:#E8F8F0; color:#27AE60; font-size:0.65rem; padding: 0.1rem 0.3rem;">Featured</span>' : ''}
        </td>
        <td>
          <div class="action-btn-group">
            <button class="action-btn action-btn-edit" onclick="window.editNewsItem('${item.id}')"><i class="fas fa-edit"></i> Edit</button>
            <button class="action-btn action-btn-delete" onclick="window.deleteNewsItem('${item.id}')"><i class="fas fa-trash-alt"></i> Delete</button>
          </div>
        </td>
      `;
      elements.newsTableBody.appendChild(tr);
    });
  };

  elements.newsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const title_en = document.getElementById("news-title-en").value.trim();
    const title_ta = document.getElementById("news-title-ta").value.trim();
    const category = document.getElementById("news-category").value;
    const date = document.getElementById("news-date").value;
    const is_featured = document.getElementById("news-featured").checked;
    const content_en = document.getElementById("news-content-en").value.trim();
    const content_ta = document.getElementById("news-content-ta").value.trim();
    const textImageUrl = document.getElementById("news-img-url").value.trim();

    let image_url = newsImageBase64 || textImageUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop";

    if (!title_en || !title_ta || !content_en || !content_ta || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    const newsItem = {
      title_en,
      title_ta,
      category,
      date: date || new Date().toISOString().split("T")[0],
      is_featured,
      content_en,
      content_ta,
      image_url
    };

    if (editingNewsId) {
      newsItem.id = editingNewsId;
    }

    TVKDb.saveNewsItem(newsItem);
    showAdminAlert(editingNewsId ? "News article updated successfully!" : "New News article created successfully!", "success");
    
    resetNewsForm();
    loadPanelData();
  });

  window.editNewsItem = (id) => {
    const item = TVKDb.getNewsItem(id);
    if (!item) return;

    editingNewsId = id;
    elements.newsFormTitle.textContent = "Edit News Article";
    
    document.getElementById("news-title-en").value = item.title_en;
    document.getElementById("news-title-ta").value = item.title_ta;
    document.getElementById("news-category").value = item.category;
    document.getElementById("news-date").value = item.date;
    document.getElementById("news-featured").checked = item.is_featured;
    document.getElementById("news-content-en").value = item.content_en;
    document.getElementById("news-content-ta").value = item.content_ta;
    document.getElementById("news-img-url").value = item.image_url.startsWith("data:") ? "" : item.image_url;
    
    newsImageBase64 = item.image_url.startsWith("data:") ? item.image_url : "";
    elements.newsImgPreview.src = item.image_url;
    elements.newsImgPreview.style.display = "block";
    
    elements.cancelNewsEditBtn.style.display = "block";
    elements.newsForm.scrollIntoView({ behavior: "smooth" });
  };

  window.deleteNewsItem = (id) => {
    if (confirm("Are you sure you want to delete this news article? This cannot be undone.")) {
      TVKDb.deleteNewsItem(id);
      showAdminAlert("News article deleted successfully.", "success");
      loadNewsTable();
      updateDashboardStats();
    }
  };

  elements.cancelNewsEditBtn.addEventListener("click", () => {
    resetNewsForm();
  });

  const resetNewsForm = () => {
    editingNewsId = null;
    elements.newsFormTitle.textContent = "Create News Article";
    elements.newsForm.reset();
    newsImageBase64 = "";
    elements.newsImgPreview.style.display = "none";
    elements.newsImgPreview.src = "";
    elements.cancelNewsEditBtn.style.display = "none";
  };

  // ---------------- 3. PROJECTS PANEL ----------------
  const loadProjectsTable = () => {
    const projs = TVKDb.getProjects();
    elements.projectsTableBody.innerHTML = "";
    
    if (projs.length === 0) {
      elements.projectsTableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: var(--text-muted);">No constituency projects added yet.</td></tr>`;
      return;
    }

    projs.forEach(item => {
      const tr = document.createElement("tr");
      
      let statusColor = "#3498DB";
      if (item.status === 'completed') statusColor = '#2ECC71';
      else if (item.status === 'ongoing') statusColor = '#E67E22';

      tr.innerHTML = `
        <td><div style="font-weight:700; color:var(--text-dark);">${item.title_en}</div><div style="font-size:0.75rem; color:var(--text-muted);">TA: ${item.title_ta}</div></td>
        <td>${item.location_en}</td>
        <td><span class="status-pill" style="background-color: ${statusColor}15; color: ${statusColor}; font-size: 0.75rem;">${item.status.toUpperCase()}</span></td>
        <td><div style="font-size:0.8rem; font-weight:600; color:var(--primary);">${item.impact_en}</div></td>
        <td>
          <div class="action-btn-group">
            <button class="action-btn action-btn-edit" onclick="window.editProjectItem('${item.id}')"><i class="fas fa-edit"></i> Edit</button>
            <button class="action-btn action-btn-delete" onclick="window.deleteProjectItem('${item.id}')"><i class="fas fa-trash-alt"></i> Delete</button>
          </div>
        </td>
      `;
      elements.projectsTableBody.appendChild(tr);
    });
  };

  elements.projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const title_en = document.getElementById("proj-title-en").value.trim();
    const title_ta = document.getElementById("proj-title-ta").value.trim();
    const description_en = document.getElementById("proj-desc-en").value.trim();
    const description_ta = document.getElementById("proj-desc-ta").value.trim();
    const status = document.getElementById("proj-status").value;
    const location_en = document.getElementById("proj-loc-en").value.trim();
    const location_ta = document.getElementById("proj-loc-ta").value.trim();
    const impact_en = document.getElementById("proj-impact-en").value.trim();
    const impact_ta = document.getElementById("proj-impact-ta").value.trim();

    if (!title_en || !title_ta || !description_en || !description_ta || !status) {
      alert("Please fill in all required fields.");
      return;
    }

    const proj = {
      title_en,
      title_ta,
      description_en,
      description_ta,
      status,
      location_en,
      location_ta,
      impact_en,
      impact_ta
    };

    if (editingProjectId) {
      proj.id = editingProjectId;
    }

    TVKDb.saveProject(proj);
    showAdminAlert(editingProjectId ? "Constituency Project details updated!" : "New Constituency Project registered!", "success");
    
    resetProjectForm();
    loadPanelData();
  });

  window.editProjectItem = (id) => {
    const projs = TVKDb.getProjects();
    const item = projs.find(p => p.id === id);
    if (!item) return;

    editingProjectId = id;
    elements.projFormTitle.textContent = "Edit Constituency Project";
    
    document.getElementById("proj-title-en").value = item.title_en;
    document.getElementById("proj-title-ta").value = item.title_ta;
    document.getElementById("proj-desc-en").value = item.description_en;
    document.getElementById("proj-desc-ta").value = item.description_ta;
    document.getElementById("proj-status").value = item.status;
    document.getElementById("proj-loc-en").value = item.location_en;
    document.getElementById("proj-loc-ta").value = item.location_ta;
    document.getElementById("proj-impact-en").value = item.impact_en;
    document.getElementById("proj-impact-ta").value = item.impact_ta;
    
    elements.cancelProjEditBtn.style.display = "block";
    elements.projectForm.scrollIntoView({ behavior: "smooth" });
  };

  window.deleteProjectItem = (id) => {
    if (confirm("Delete this constituency project record?")) {
      TVKDb.deleteProject(id);
      showAdminAlert("Project record deleted.", "success");
      loadProjectsTable();
      updateDashboardStats();
    }
  };

  elements.cancelProjEditBtn.addEventListener("click", () => {
    resetProjectForm();
  });

  const resetProjectForm = () => {
    editingProjectId = null;
    elements.projFormTitle.textContent = "Register Constituency Project";
    elements.projectForm.reset();
    elements.cancelProjEditBtn.style.display = "none";
  };

  // ---------------- 4. GALLERY & VIDEO PANEL ----------------
  elements.galleryFileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      processImageUpload(e.target.files[0], (base64) => {
        galleryImageBase64 = base64;
        const uploadLabel = document.getElementById("gallery-file-label");
        if (uploadLabel) uploadLabel.textContent = "Image loaded successfully!";
      });
    }
  });

  const loadGalleryTable = () => {
    const gallery = TVKDb.getGallery();
    elements.galleryTableBody.innerHTML = "";
    
    if (gallery.length === 0) {
      elements.galleryTableBody.innerHTML = `<tr><td colspan="4" class="text-center" style="color: var(--text-muted);">No gallery items.</td></tr>`;
      return;
    }

    gallery.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img class="table-thumb" src="${item.image_url}" alt="Gallery"></td>
        <td>
          <div style="font-weight:600; font-size:0.85rem;">${item.caption_ta}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">EN: ${item.caption_en}</div>
        </td>
        <td>${item.date}</td>
        <td>
          <button class="action-btn action-btn-delete" onclick="window.deleteGalleryItem('${item.id}')"><i class="fas fa-trash-alt"></i> Delete</button>
        </td>
      `;
      elements.galleryTableBody.appendChild(tr);
    });
  };

  elements.galleryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const caption_en = document.getElementById("gal-caption-en").value.trim();
    const caption_ta = document.getElementById("gal-caption-ta").value.trim();
    const textUrl = document.getElementById("gal-img-url").value.trim();

    let image_url = galleryImageBase64 || textUrl;

    if (!image_url || !caption_en || !caption_ta) {
      alert("Please provide captions and select/enter an image.");
      return;
    }

    const item = {
      caption_en,
      caption_ta,
      image_url,
      date: new Date().toISOString().split("T")[0]
    };

    TVKDb.saveGalleryItem(item);
    showAdminAlert("Photo added to the Gallery successfully!", "success");
    
    elements.galleryForm.reset();
    galleryImageBase64 = "";
    const uploadLabel = document.getElementById("gallery-file-label");
    if (uploadLabel) uploadLabel.textContent = "Select photo from local device";
    loadPanelData();
  });

  window.deleteGalleryItem = (id) => {
    if (confirm("Delete this photo from the gallery?")) {
      TVKDb.deleteGalleryItem(id);
      showAdminAlert("Photo deleted from the gallery.", "success");
      loadGalleryTable();
      updateDashboardStats();
    }
  };

  // Video management
  const loadVideosTable = () => {
    const vids = TVKDb.getVideos();
    elements.videosTableBody.innerHTML = "";
    
    if (vids.length === 0) {
      elements.videosTableBody.innerHTML = `<tr><td colspan="4" class="text-center" style="color: var(--text-muted);">No videos listed.</td></tr>`;
      return;
    }

    vids.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img class="table-thumb" src="${item.thumbnail_url}" alt="Video thumb"></td>
        <td>
          <div style="font-weight:700;">${item.title_en}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); overflow:hidden; text-overflow:ellipsis; max-width: 300px;">URL: ${item.video_url}</div>
        </td>
        <td>
          <button class="action-btn action-btn-delete" onclick="window.deleteVideoItem('${item.id}')"><i class="fas fa-trash-alt"></i> Delete</button>
        </td>
      `;
      elements.videosTableBody.appendChild(tr);
    });
  };

  elements.videoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title_en = document.getElementById("vid-title-en").value.trim();
    const title_ta = document.getElementById("vid-title-ta").value.trim();
    const video_url = document.getElementById("vid-url").value.trim();
    const thumbnail_url = document.getElementById("vid-thumb-url").value.trim() || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop";

    if (!title_en || !title_ta || !video_url) {
      alert("Please fill in video details.");
      return;
    }

    const vid = {
      title_en,
      title_ta,
      video_url,
      thumbnail_url
    };

    TVKDb.saveVideo(vid);
    showAdminAlert("YouTube video link registered successfully!", "success");
    
    elements.videoForm.reset();
    loadPanelData();
  });

  window.deleteVideoItem = (id) => {
    if (confirm("Delete this video registry?")) {
      TVKDb.deleteVideo(id);
      showAdminAlert("Video registry removed.", "success");
      loadVideosTable();
    }
  };

  // ---------------- 5. CITIZEN GRIEVANCE PETITIONS INBOX ----------------
  const loadGrievanceInbox = () => {
    const grievances = TVKDb.getGrievances();
    elements.grievancesTableBody.innerHTML = "";
    
    if (grievances.length === 0) {
      elements.grievancesTableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color: var(--text-muted); padding: 3rem;">
        <i class="far fa-envelope-open" style="font-size:2.5rem; opacity:0.3; margin-bottom: 0.5rem; display:block;"></i>
        No citizen petitions received yet.
      </td></tr>`;
      return;
    }

    grievances.forEach(item => {
      const tr = document.createElement("tr");
      
      let statusHtml = '<span class="status-pill" style="background-color:#FDEDE0; color:#D35400; font-size:0.7rem;">PENDING</span>';
      if (item.status === 'reviewed') {
        statusHtml = '<span class="status-pill" style="background-color:#E8F8F0; color:#27AE60; font-size:0.7rem;">REVIEWED</span>';
      }

      tr.innerHTML = `
        <td>
          <div style="font-weight: 700; color: var(--primary);">${item.id}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${item.date}</div>
        </td>
        <td>
          <div style="font-weight:700;">${item.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);"><i class="fas fa-phone-alt" style="font-size:0.65rem;"></i> ${item.phone}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);"><i class="far fa-envelope" style="font-size:0.65rem;"></i> ${item.email || "N/A"}</div>
        </td>
        <td>
          <div style="font-size:0.8rem; font-weight:700;">${item.ward_no}</div>
          <span class="badge badge-primary" style="font-size: 0.6rem; padding: 0.15rem 0.4rem; margin-top:0.2rem;">${item.grievance_type}</span>
        </td>
        <td>
          <div style="font-size:0.85rem; max-width: 250px; white-space: normal; line-height: 1.4;">${item.description}</div>
        </td>
        <td>${statusHtml}</td>
        <td>
          <div class="action-btn-group" style="flex-direction: column; gap:0.4rem;">
            ${item.status === 'pending' ? `<button class="action-btn action-btn-edit" style="background-color:#27AE60; color:#FFF;" onclick="window.markGrievanceReviewed('${item.id}')"><i class="fas fa-check"></i> Mark Reviewed</button>` : ''}
            <button class="action-btn action-btn-delete" onclick="window.deleteGrievanceItem('${item.id}')"><i class="fas fa-trash-alt"></i> Delete</button>
          </div>
        </td>
      `;
      elements.grievancesTableBody.appendChild(tr);
    });
  };

  window.markGrievanceReviewed = (id) => {
    TVKDb.updateGrievanceStatus(id, "reviewed");
    showAdminAlert(`Grievance petition ${id} marked as successfully reviewed.`, "success");
    loadGrievanceInbox();
    updateDashboardStats();
  };

  window.deleteGrievanceItem = (id) => {
    if (confirm(`Permanently delete grievance petition ${id} from files?`)) {
      TVKDb.deleteGrievance(id);
      showAdminAlert(`Petition ${id} deleted from databases.`, "success");
      loadGrievanceInbox();
      updateDashboardStats();
    }
  };

  // ---------------- ACTION BANNER NOTIFICATIONS ----------------
  const showAdminAlert = (msg, status) => {
    if (status === "hidden" || !msg) {
      elements.adminAlert.style.display = "none";
      return;
    }
    
    elements.adminAlert.className = `custom-alert custom-alert-${status === 'success' ? 'success' : 'error'}`;
    elements.adminAlert.innerHTML = `
      <i class="${status === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
      <span>${msg}</span>
    `;
    elements.adminAlert.style.display = "flex";
    
    // Auto-dismiss alert after 4 seconds
    setTimeout(() => {
      elements.adminAlert.style.display = "none";
    }, 4500);
  };

  // ---------------- INITIALIZE ADMIN DASHBOARD ----------------
  const initAdmin = async () => {
    await TVKDb.init();
    loadPanelData();
  };

  initAdmin();
});
