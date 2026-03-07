// Services data (capabilities with short descriptions)
const services = [
    {
        title: "SLA (Stereolithography)",
        description: "High-accuracy resin 3D printing for fine-feature prototypes and smooth surface finishes — ideal for visual and functional prototypes.",
        image: "images/Stereolithography2.png"
    },
    {
        title: "SLS (Selective Laser Sintering)",
        description: "Powder-based 3D printing producing strong, functional parts with complex geometries — suitable for end-use prototypes and small runs.",
        image: "images/Selective%20Laser%20Sintering1.png"
    },
    {
        title: "FDM (Fused Deposition Modeling)",
        description: "Cost-effective thermoplastic extrusion for fast prototypes and functional parts — good for form/fit testing and low-volume production.",
        image: "images/fdm.jpg"
    },
    {
        title: "Vacuum Casting",
        description: "Silicone mold casting to create production-like small batches with accurate details and material options for validation and short runs.",
        image: "images/Vacuum%20Casting.jpg"
    },
    {
        title: "Injection Molding",
        description: "Precision high-volume plastic production using engineered tooling for repeatable, cost-effective parts and tight tolerances.",
        image: "images/Injection%20Molding.jpg"
    },
    {
        title: "Rubber Molding",
        description: "Compression and transfer molding for seals, gaskets and soft-touch parts with elastomeric materials and controlled durometers.",
        image: "images/Rubber%20Molding.jpg"
    },
    {
        title: "Rubber Extrusion",
        description: "Continuous extrusion of rubber profiles and seals to tight tolerances — suitable for weather seals, channels and custom profiles.",
        image: "images/rubber%20extrusion.png"
    },
    {
        title: "Casting (Metal)",
        description: "Aluminium and zinc casting services for structural housings and components, with finishing and machining to spec.",
        image: "images/Casting%20(Metal).avif"
    },
    {
        title: "Sheet Metal",
        description: "Laser cutting, bending, stamping and welding for chassis, brackets and enclosures — finished parts ready for assembly or coating.",
        image: "images/Sheet%20Metal.png"
    },
    {
        title: "CNC & VMC",
        description: "Precision machining on CNC lathes and vertical machining centers (VMC) for tight-tolerance metal and plastic components.",
        image: "images/machined.jpeg"
    }
];

// Portfolio data
const portfolio = [
    {
        title: "Plastic Parts - Exterior",
        category: "Completed Project",
        gradient: "gradient-purple-pink",
        image: "images/exterior.jpeg"
    },
    {
        title: "Plastic Parts - Interior",
        category: "Completed Project",
        gradient: "gradient-blue-cyan",
        image: "images/interior.jpeg"
    },
    {
        title: "Rubber Parts & Seals",
        category: "Completed Project",
        gradient: "gradient-green-emerald",
        image: "images/rubber.jpeg"
    },
    {
        title: "Machined Components",
        category: "Completed Project",
        gradient: "gradient-orange-red",
        image: "images/machined.jpeg"
    },
    {
        title: "Plastic Canopy Tooling",
        category: "Tooling & Production",
        gradient: "gradient-yellow-amber",
        image: "images/canopy.jpeg"
    },
    {
        title: "Dashboard & Console",
        category: "Proto Parts",
        gradient: "gradient-indigo-purple",
        image: "images/dashboard.jpeg"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading
    setTimeout(function() {
        const loadingOverlay = document.getElementById('loading');
        const mainContent = document.getElementById('main-content');
        
        loadingOverlay.classList.add('hidden');
        mainContent.classList.add('visible');
    }, 800);

    // Render services
    renderServices();

    // Handle form submission for any quote form on the page
    document.querySelectorAll('.quote-form').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Render services
function renderServices() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;

    // Prevent double-rendering if this function is accidentally called more than once
    if (servicesGrid.dataset.rendered === 'true') return;

    // Limit to the first 9 services so the section forms a 3x3 grid visually
    const items = services.slice(0, 9);
    servicesGrid.innerHTML = items.map((service, index) => `
        <div class="service-card" style="animation-delay: ${index * 50}ms">
            ${service.image ? `<img class="service-icon" src="${service.image}" alt="${service.title}" loading="lazy">` : ''}
            <h3 class="service-title">${service.title}</h3>
            <p class="service-description">${service.description}</p>
        </div>
    `).join('');

    servicesGrid.dataset.rendered = 'true';
}

// Portfolio removed from HTML; renderPortfolio intentionally omitted.

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    // Map your page fields to Google Form `entry.*` IDs (from your curl)
    // entry.462231578 = Company
    // entry.543450690 = Contact
    // entry.1994935088 = Email
    // entry.1820724580 = Phone
    // entry.912507633 = Project Description / Enquiry

    const form = e.target;
    // Collect inputs by their position in the form structure
    const inputs = form.querySelectorAll('input.form-input');
    const textarea = form.querySelector('textarea.form-textarea');
    const select = form.querySelector('select.form-input');

    const company = inputs[0] ? inputs[0].value.trim() : '';
    const contact = inputs[1] ? inputs[1].value.trim() : '';
    const email = inputs[2] ? inputs[2].value.trim() : '';
    const phone = inputs[3] ? inputs[3].value.trim() : '';
    let description = textarea ? textarea.value.trim() : '';
    if (select && select.value) {
        description = (description ? description + '\n\n' : '') + 'Service Type: ' + select.options[select.selectedIndex].text;
    }

    const values = {
        'entry.462231578': company,
        'entry.543450690': contact,
        'entry.1994935088': email,
        'entry.1820724580': phone,
        'entry.912507633': description
    };

    // Prefer a serverless proxy when available so we can submit silently
    // and keep the user on your site. Set window.GFORM_PROXY_URL to the
    // deployed proxy URL (Apps Script, Cloudflare Worker, Netlify Function).
    if (window.GFORM_PROXY_URL) {
        setFormLoading(form, true);
        postToProxy(values).then(ok => {
            setFormLoading(form, false);
            if (ok) showFormSuccess(form, 'Thank you.');
            else showFormSuccess(form, 'Submission failed — please try again.');
        }).catch(() => {
            setFormLoading(form, false);
            showFormSuccess(form, 'Submission failed — please try again.');
        }).finally(() => form.reset());
        return;
    }

    // Fallback: submit via hidden iframe (may be blocked by Google CSP).
    setFormLoading(form, true);
    submitGoogleForm(values, false, () => {
        setFormLoading(form, false);
        showFormSuccess(form, 'Thank you.');
    });
    form.reset();
}

// Create a hidden iframe for safe POST-targeting
function ensureHiddenIframe() {
    let iframe = document.querySelector('iframe[name="gform-hidden-iframe"]');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.name = 'gform-hidden-iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    return iframe;
}

// Build and submit a hidden form to Google Forms `formResponse`
function submitGoogleForm(values, openInNewTab = false, onLoadCallback) {
    const iframe = ensureHiddenIframe();
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://docs.google.com/forms/u/1/d/e/1FAIpQLScrx5bK0vSZTlQ4AZ0GpaL6eleKbIPjcxw_biYuEsAIQDz6Rg/formResponse';
    form.style.display = 'none';
    form.target = openInNewTab ? '_blank' : iframe.name;

    Object.entries(values).forEach(([name, val]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = val || '';
        form.appendChild(input);
    });

    if (typeof onLoadCallback === 'function') {
        // Attach a one-time load handler
        const handler = function() {
            iframe.removeEventListener('load', handler);
            // small delay to allow Google's redirect to settle
            setTimeout(onLoadCallback, 250);
        };
        iframe.addEventListener('load', handler);
    }

    document.body.appendChild(form);
    form.submit();
    form.remove();
}

// Post to a configured serverless proxy that forwards to Google Forms.
// The proxy should accept JSON with entry.* keys and return 2xx on success.
async function postToProxy(values) {
    if (!window.GFORM_PROXY_URL) throw new Error('GFORM_PROXY_URL not set');
    try {
        const resp = await fetch(window.GFORM_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        });
        if (resp.ok) return true;
        try { const t = await resp.text(); console.warn('Proxy error', resp.status, t.slice(0,200)); } catch(e){}
        return false;
    } catch (err) {
        console.error('postToProxy error', err);
        return false;
    }
}

// UI helpers: show loading state and success message inside the form
function setFormLoading(form, isLoading) {
    let status = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!status) {
        status = document.createElement('div');
        status.className = 'form-status';
        status.style.marginTop = '0.75rem';
        status.style.fontSize = '0.95rem';
        form.appendChild(status);
    }

    if (isLoading) {
        submitBtn && (submitBtn.disabled = true);
        status.innerHTML = '<span class="form-loading">Submitting </span>';
    } else {
        submitBtn && (submitBtn.disabled = false);
        status.innerHTML = '';
    }
}

function showFormSuccess(form, message) {
    // Show a centered popup instead of an inline message
    showPopup(message || 'Request submitted — thank you!', false);
}

// Global popup/toast helper shown in the center of the viewport
function showPopup(message, isError = false, autoHideMs = 4000) {
    // Prevent multiple popups stacking
    if (document.querySelector('.gform-popup-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'gform-popup-overlay';
    Object.assign(overlay.style, {
        position: 'fixed', left: '0', top: '0', right: '0', bottom: '0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(11,35,64,0.35)', zIndex: 9999
    });

    const box = document.createElement('div');
    box.className = 'gform-popup-box';
    Object.assign(box.style, {
        background: '#fff', padding: '20px 22px', borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(11,35,64,0.18)', maxWidth: '420px',
        width: '90%', textAlign: 'center', fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Segoe UI", Arial'
    });

    const title = document.createElement('div');
    title.textContent = isError ? 'Error' : 'Enquiry submitted successfully';
    Object.assign(title.style, { fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: isError ? '#C0392B' : '#0b8f4a' });

    const msg = document.createElement('div');
    msg.innerText = message;
    Object.assign(msg.style, { fontSize: '14px', color: '#0b2340', marginBottom: '12px' });

    const btn = document.createElement('button');
    btn.textContent = 'Close';
    Object.assign(btn.style, {
        padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
        background: isError ? '#C0392B' : '#0b8f4a', color: '#fff', fontWeight: 600
    });
    btn.addEventListener('click', () => { overlay.remove(); });

    box.appendChild(title);
    box.appendChild(msg);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    if (autoHideMs && autoHideMs > 0) {
        setTimeout(() => { overlay.remove(); }, autoHideMs);
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
window.addEventListener('load', function() {
    const animatedElements = document.querySelectorAll('.service-card');
    animatedElements.forEach(el => observer.observe(el));
});

// Counter animation helper
function animateValue(el, start, end, duration, suffix) {
    let startTime = null;
    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        el.textContent = value + (suffix || '');
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}

// Observe stats grid and animate counters once visible
window.addEventListener('load', function() {
    const statsGrid = document.querySelector('.stats-grid');
    if (!statsGrid) return;

    // initialize counts to 0 (in case HTML wasn't set)
    statsGrid.querySelectorAll('.count').forEach(c => c.textContent = '0');

    const statsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statsGrid.querySelectorAll('.count').forEach(c => {
                    if (c.dataset.animated) return;
                    const target = parseInt(c.dataset.target, 10) || 0;
                    const suffix = c.dataset.suffix || '';
                    animateValue(c, 0, target, 500, suffix);
                    c.dataset.animated = 'true';
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    statsObserver.observe(statsGrid);
});
