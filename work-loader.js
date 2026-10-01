(async () => {
    const workGrid = document.getElementById('dynamicWorkGrid');
    if (!workGrid) return;

    try {
        const response = await fetch('http://localhost:3000/api/work');
        if (!response.ok) throw new Error('Failed to fetch');
        const works = await response.json();
        
        workGrid.innerHTML = '';
        
        if (works.length === 0) {
            workGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #666; padding: 40px;">No work cards available. Add them in the admin dashboard.</div>';
            return;
        }

        works.forEach(work => {
            const layoutClass = work.layout ? ` ${work.layout}` : '';
            const cardHTML = `
                <a href="explore.html#our-work" class="work-card${layoutClass} gsap-fade-up-scroll">
                    <img src="${work.image}" alt="${(work.title || '').replace(/<[^>]*>?/gm, '')}">
                    <div class="card-overlay"></div>
                    <div class="card-number">${work.number}</div>
                    
                    <div class="card-content">
                        <h3 class="card-title">${work.title}</h3>
                    </div>
                </a>
            `;
            workGrid.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Attach GSAP animations to the newly created cards
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.utils.toArray(workGrid.querySelectorAll('.gsap-fade-up-scroll')).forEach(element => {
                gsap.fromTo(element,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
            setTimeout(() => ScrollTrigger.refresh(), 500);
        }

    } catch (err) {
        console.error('Error loading work cards:', err);
        workGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #ff5a5a; padding: 40px;">Unable to load work cards.</div>';
    }
})();

