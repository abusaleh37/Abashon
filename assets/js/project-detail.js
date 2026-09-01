(function () {
  const projects = window.ABASHON_PROJECTS || [];
  const slug = document.body.dataset.projectSlug;
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  if (projectIndex === -1) return;

  const project = projects[projectIndex];
  const prev = projects[(projectIndex - 1 + projects.length) % projects.length];
  const next = projects[(projectIndex + 1) % projects.length];

  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };

  const setList = (selector, items) => {
    const list = document.querySelector(selector);
    if (!list) return;
    list.innerHTML = items
      .map((item) => `<li class="rounded-lg border border-white/10 bg-slate-900/60 px-4 py-3 text-sm leading-relaxed text-white/75">${item}</li>`)
      .join('');
  };

  setText('[data-project="name"]', project.name);
  setText('[data-project="location"]', project.location);
  setText('[data-project="category"]', project.category);
  setText('[data-project="status"]', project.status);
  setText('[data-project="client"]', project.client);
  setText('[data-project="description"]', project.description);

  const statusBn = document.querySelector('[data-project="status-bn"]');
  if (statusBn) statusBn.textContent = project.statusLabelBn;

  const heroImage = document.getElementById('project-hero-image');
  if (heroImage) {
    heroImage.src = project.heroImage;
    heroImage.alt = `${project.name} project image`;
  }

  setList('[data-project="scope"]', project.scope);
  setList('[data-project="engineering"]', project.engineering);
  setList('[data-project="structural"]', project.structural);
  setList('[data-project="challenges"]', project.challenges);
  setList('[data-project="solutions"]', project.solutions);

  const gallery = document.querySelector('[data-project="gallery"]');
  if (gallery) {
    gallery.innerHTML = project.gallery
      .map(
        (src, idx) => `<figure class="overflow-hidden rounded-xl border border-white/10 bg-slate-900"><img src="${src}" alt="${project.name} gallery image ${idx + 1}" class="h-52 w-full object-cover" loading="lazy" /></figure>`
      )
      .join('');
  }

  const brochure = document.getElementById('project-brochure-link');
  if (brochure) {
    brochure.href = project.brochure;
    brochure.setAttribute('download', `${project.slug}-brochure.pdf`);
  }

  const prevLink = document.getElementById('project-prev-link');
  const nextLink = document.getElementById('project-next-link');
  if (prevLink) {
    prevLink.href = `./${prev.slug}.html`;
    prevLink.textContent = `← Previous Project: ${prev.name}`;
  }
  if (nextLink) {
    nextLink.href = `./${next.slug}.html`;
    nextLink.textContent = `Next Project: ${next.name} →`;
  }

  const meta = document.querySelector('meta[name="description"]');
  if (meta && project.seoDescription) meta.setAttribute('content', project.seoDescription);
})();
