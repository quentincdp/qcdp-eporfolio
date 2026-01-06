/*
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$head = $('head'),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ],
			'xlarge-to-max':    '(min-width: 1681px)',
			'small-to-xlarge':  '(min-width: 481px) and (max-width: 1680px)'
		});

	// Stops animations/transitions until the page has ...

		// ... loaded.
			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-preload');
				}, 100);
			});

		// ... stopped resizing.
			var resizeTimeout;

			$window.on('resize', function() {

				// Mark as resizing.
					$body.addClass('is-resizing');

				// Unmark after delay.
					clearTimeout(resizeTimeout);

					resizeTimeout = setTimeout(function() {
						$body.removeClass('is-resizing');
					}, 100);

			});

	// Fixes.

		// Object fit images.
			if (!browser.canUse('object-fit')
			||	browser.name == 'safari')
				$('.image.object').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Hide original image.
						$img.css('opacity', '0');

					// Set background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-size', $img.css('object-fit') ? $img.css('object-fit') : 'cover')
							.css('background-position', $img.css('object-position') ? $img.css('object-position') : 'center');

				});

	// Sidebar.
		var $sidebar = $('#sidebar'),
			$sidebar_inner = $sidebar.children('.inner');

		// Inactive by default on <= large.
			breakpoints.on('<=large', function() {
				$sidebar.addClass('inactive');
			});

			breakpoints.on('>large', function() {
				$sidebar.removeClass('inactive');
			});

		// Hack: Workaround for Chrome/Android scrollbar position bug.
			if (browser.os == 'android'
			&&	browser.name == 'chrome')
				$('<style>#sidebar .inner::-webkit-scrollbar { display: none; }</style>')
					.appendTo($head);

		// Toggle.
			$('<a href="#sidebar" class="toggle">Toggle</a>')
				.appendTo($sidebar)
				.on('click', function(event) {

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Toggle.
						$sidebar.toggleClass('inactive');

				});

		// Events.

			// Link clicks.
				$sidebar.on('click', 'a', function(event) {

					// >large? Bail.
						if (breakpoints.active('>large'))
							return;

					// Vars.
						var $a = $(this),
							href = $a.attr('href'),
							target = $a.attr('target');

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Check URL.
						if (!href || href == '#' || href == '')
							return;

					// Hide sidebar.
						$sidebar.addClass('inactive');

					// Redirect to href.
						setTimeout(function() {

							if (target == '_blank')
								window.open(href);
							else
								window.location.href = href;

						}, 500);

				});

			// Prevent certain events inside the panel from bubbling.
				$sidebar.on('click touchend touchstart touchmove', function(event) {

					// >large? Bail.
						if (breakpoints.active('>large'))
							return;

					// Prevent propagation.
						event.stopPropagation();

				});

			// Hide panel on body click/tap.
				$body.on('click touchend', function(event) {

					// >large? Bail.
						if (breakpoints.active('>large'))
							return;

					// Deactivate.
						$sidebar.addClass('inactive');

				});

		// Scroll lock.
		// Note: If you do anything to change the height of the sidebar's content, be sure to
		// trigger 'resize.sidebar-lock' on $window so stuff doesn't get out of sync.

			$window.on('load.sidebar-lock', function() {

				var sh, wh, st;

				// Reset scroll position to 0 if it's 1.
					if ($window.scrollTop() == 1)
						$window.scrollTop(0);

				$window
					.on('scroll.sidebar-lock', function() {

						var x, y;

						// <=large? Bail.
							if (breakpoints.active('<=large')) {

								$sidebar_inner
									.data('locked', 0)
									.css('position', '')
									.css('top', '');

								return;

							}

						// Calculate positions.
							x = Math.max(sh - wh, 0);
							y = Math.max(0, $window.scrollTop() - x);

						// Lock/unlock.
							if ($sidebar_inner.data('locked') == 1) {

								if (y <= 0)
									$sidebar_inner
										.data('locked', 0)
										.css('position', '')
										.css('top', '');
								else
									$sidebar_inner
										.css('top', -1 * x);

							}
							else {

								if (y > 0)
									$sidebar_inner
										.data('locked', 1)
										.css('position', 'fixed')
										.css('top', -1 * x);

							}

					})
					.on('resize.sidebar-lock', function() {

						// Calculate heights.
							wh = $window.height();
							sh = $sidebar_inner.outerHeight() + 30;

						// Trigger scroll.
							$window.trigger('scroll.sidebar-lock');

					})
					.trigger('resize.sidebar-lock');

				});

	// Menu.
		var $menu = $('#menu'),
			$menu_openers = $menu.children('ul').find('.opener');

		// Openers.
			$menu_openers.each(function() {

				var $this = $(this);

				$this.on('click', function(event) {

					// Prevent default.
						event.preventDefault();

					// Toggle.
						$menu_openers.not($this).removeClass('active');
						$this.toggleClass('active');

					// Trigger resize (sidebar lock).
						$window.triggerHandler('resize.sidebar-lock');

				});

			});
			
	// Helper function to check if the languages section is in the viewport
		function isInViewport(el) {
			const rect = el.getBoundingClientRect();
			return (
				rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
				rect.bottom >= 0
			);
		}

		// Function to trigger all progress bars at the same time
		function animateAllProgressBars() {
			var progressBars = document.querySelectorAll('.small-progress');
			progressBars.forEach(function (bar) {
				// Check if the bar has already been animated
				if (!bar.classList.contains('animated')) {
					var skillLevel = bar.getAttribute('data-skill');
					setTimeout(() => {
						bar.style.width = skillLevel; // Set the width according to data-skill
						bar.style.transition = 'width 1.5s ease-in-out'; // Smooth transition effect
					}, 150); // Slight delay to ensure smoothness across all bars
					bar.classList.add('animated'); // Mark this bar as animated to prevent reanimation
				}
			});
		}

		// Function to check if the languages section is in view, and trigger progress bars
		// Corrected version
		function checkAndAnimateBars() {
			var skillsSection = document.getElementById('languages');
			// Add this check: only run the code if skillsSection was found.
			if (skillsSection && isInViewport(skillsSection)) {
				animateAllProgressBars();
			}
		}

		// Attach scroll and load events
		window.addEventListener('scroll', checkAndAnimateBars);
		window.addEventListener('load', checkAndAnimateBars);

		/* ---------------------------------------- */
		/* INTERNATIONAL MOBILITY FUNCTIONALITY   */
		/* ---------------------------------------- */

		function initializeMapInteractivity() {
			const mapObject = document.getElementById("world-map");

			if (!mapObject) {
				return;
			}

			if (mapObject.dataset.mapReady === 'true') {
				return;
			}

			// --- Flag System to solve the race condition ---
			let isSvgLoaded = false;
			let isDomReady = false;

			const setupMap = () => {
				// This function will only run when both flags are true.
				if (!isSvgLoaded || !isDomReady || mapObject.dataset.mapReady === 'true') {
					return;
				}
				mapObject.dataset.mapReady = 'true'; // Mark as initialized
				console.log("DOM and SVG are ready. Setting up interactivity...");

				// Now it's 100% safe to query for all elements
				const popover = document.getElementById("country-popover");
				const popoverTitle = document.getElementById("popover-title");
				const popoverDescription = document.getElementById("popover-description");
				const closeButton = document.querySelector(".close-popover");
				const popoverLink = document.getElementById("popover-link");
				const svgDoc = mapObject.contentDocument;

				if (!svgDoc || !popover || !closeButton) {
					console.error("Essential map or popover elements could not be found on final check.");
					return;
				}

				const countryLinks = {
					np: { text: 'See the Nepal Project', href: 'projects-&-productions.html' },
				};
				const interactiveCountries = ["frx", "np", "ca"];
				let isPopoverVisible = false;

				interactiveCountries.forEach(countryCode => {
					const countryElement = svgDoc.getElementById(countryCode);
					if (countryElement) {
						countryElement.classList.add("clickable-country");
						countryElement.addEventListener("click", (event) => {
							event.stopPropagation();
							const title = countryElement.dataset.title || "Details";
							const description = countryElement.dataset.description || "No description provided.";
							showPopover(title, description, countryElement, countryCode);
						});
					}
				});

				function showPopover(title, description, countryElement, countryCode) {
					popoverTitle.textContent = title;
					popoverDescription.innerHTML = description;
					const linkData = countryLinks[countryCode];

					if (linkData) {
						popoverLink.style.display = 'block';
						popoverLink.textContent = linkData.text;
						popoverLink.href = linkData.href;
					} else {
						popoverLink.style.display = 'none';
					}

					popover.style.display = 'block';
					popover.classList.remove('visible');

					const mapRect = mapObject.getBoundingClientRect();
					const countryRect = countryElement.getBoundingClientRect();
					const popoverWidth = popover.offsetWidth;
					const popoverHeight = popover.offsetHeight;
					const margin = 15;

					let left = mapRect.left + countryRect.right + window.scrollX + margin;
					if (left + popoverWidth > window.scrollX + window.innerWidth) {
						left = mapRect.left + countryRect.left + window.scrollX - popoverWidth - margin;
					}
					let top = mapRect.top + countryRect.top + window.scrollY + (countryRect.height / 2) - (popoverHeight / 2);
					if (top < window.scrollY + margin) { top = window.scrollY + margin; }
					if (top + popoverHeight > window.scrollY + window.innerHeight - margin) {
						top = window.scrollY + window.innerHeight - popoverHeight - margin;
					}

					popover.style.left = `${left}px`;
					popover.style.top = `${top}px`;
					
					setTimeout(() => { popover.classList.add('visible'); }, 10);
					isPopoverVisible = true;
				}

				function hidePopover() {
					if (!isPopoverVisible) return;
					popover.classList.remove('visible');
					setTimeout(() => { popover.style.display = 'none'; }, 300);
					isPopoverVisible = false;
				}

				closeButton.addEventListener("click", (event) => {
					event.stopPropagation();
					hidePopover();
				});
				document.addEventListener('click', () => { if (isPopoverVisible) hidePopover(); });
				popover.addEventListener('click', (event) => { event.stopPropagation(); });
				document.addEventListener('keydown', (event) => {
					if (event.key === 'Escape' && isPopoverVisible) hidePopover();
				});
			};

			// --- Trigger 1: Wait for the SVG to load ---
			const handleSvgLoad = () => {
				isSvgLoaded = true;
				setupMap(); // Try to run the setup
			};

			if (mapObject.contentDocument && mapObject.contentDocument.readyState === 'complete') {
				handleSvgLoad();
			} else {
				mapObject.addEventListener('load', handleSvgLoad);
			}

			// --- Trigger 2: Wait for the main document to be ready ---
			const handleDomReady = () => {
				isDomReady = true;
				setupMap(); // Try to run the setup
			};

			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', handleDomReady);
			} else {
				handleDomReady();
			}
		}

		window.addEventListener('pageshow', initializeMapInteractivity);
	/* ---------------------------------------- */
	/* TIMELINE ANIMATION          */
	/* ---------------------------------------- */

			// Function to check if timeline items are in view
			function checkTimeline() {
				$('.timeline-item').each(function() {
					// Use the existing isInViewport function
					if (isInViewport(this)) {
						$(this).addClass('in-view');
					}
				});
			}

			// Attach scroll and load events for the timeline
			window.addEventListener('scroll', checkTimeline);
			window.addEventListener('load', checkTimeline);
})(jQuery);


/* ---------------------------------------- */
/*          CAREER DEVELOPMENT FUNCTIONALITY     */
/* ---------------------------------------- */

function toggleDetails(id) {
    var details = document.getElementById(id);
    var moreText = details.previousElementSibling; // Get the 'More' text

    // Toggle the class 'show' to hide/display content
    if (details.classList.contains("show")) {
        details.classList.remove("show");
        moreText.textContent = ">> More"; // Change the text back to "More"
    } else {
        details.classList.add("show");
        moreText.textContent = "<< Less"; // Change the text to "Less" when expanded
    }
}

/* ---------------------------------------- */
/* PPP CAROUSEL LOGIC               */
/* ---------------------------------------- */

document.addEventListener('DOMContentLoaded', function() {
    // Select elements
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const indicator = document.getElementById('slide-indicator');
    const container = document.getElementById('ppt-carousel-container');
    
    // Guard clause if carousel doesn't exist on page
    if (!container) return;

    let currentSlide = 0;
    const totalSlides = slides.length;

    function updateSlide(index) {
        // Hide all
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Show current
        slides[index].classList.add('active');
        
        // Update text
        indicator.innerText = (index + 1) + " / " + totalSlides;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlide(currentSlide);
    }

    function toggleFullscreen() {
        container.classList.toggle('fullscreen');
        
        // Change icon based on state
        if (container.classList.contains('fullscreen')) {
            fullscreenBtn.classList.remove('fa-expand');
            fullscreenBtn.classList.add('fa-compress');
            fullscreenBtn.innerText = " Exit";
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        } else {
            fullscreenBtn.classList.remove('fa-compress');
            fullscreenBtn.classList.add('fa-expand');
            fullscreenBtn.innerText = " Fullscreen";
            document.body.style.overflow = '';
        }
    }

    // Event Listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Optional: Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (container.classList.contains('fullscreen')) {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'Escape') toggleFullscreen();
        }
    });
});


/* ---------------------------------------- */
/* EXPERIENCE TOGGLE FUNCTIONALITY      */
/* ---------------------------------------- */

/**
 * Toggles the visibility of an experience detail box and updates the button text.
 * @param {HTMLElement} btn - The button element that was clicked (passed as 'this').
 * @param {string} id - The ID of the details div to toggle.
 */
function toggleDetails(btn, id) {
    var details = document.getElementById(id);
    
    // Toggle the class for visibility
    details.classList.toggle("show");

    // Check visibility to update text
    if (details.classList.contains("show")) {
        btn.innerHTML = "Hide Key Achievements";
        btn.classList.add("primary"); // Optional: Highlight button when active
    } else {
        btn.innerHTML = "View Key Achievements";
        btn.classList.remove("primary");
    }
}


/* ---------------------------------------- */
/* WEB-NATIVE DECK LOGIC           */
/* ---------------------------------------- */

document.addEventListener('DOMContentLoaded', function() {
    const deck = document.getElementById('deck-container');
    
    // Safety check: Exit if deck doesn't exist
    if (!deck) return;

    const slides = deck.querySelectorAll('.ppt-slide');
    const prevBtn = document.getElementById('d-prev');
    const nextBtn = document.getElementById('d-next');
    const fullBtn = document.getElementById('d-full');
    const indicator = document.getElementById('d-indicator');
	const downloadBtn = document.getElementById('d-download');

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateDeck(index) {
        // Remove active class from all
        slides.forEach(s => s.classList.remove('active'));
        
        // Add active to current
        slides[index].classList.add('active');
        
        // Update Indicator (01 / 07)
        indicator.innerText = "0" + (index + 1) + " / 0" + totalSlides;
    }

    // Navigation functions
    function goNext() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateDeck(currentIndex);
    }

    function goPrev() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateDeck(currentIndex);
    }

    // Fullscreen Toggle
    function toggleDeckFullscreen() {
        deck.classList.toggle('fullscreen');
        
        if (deck.classList.contains('fullscreen')) {
            fullBtn.classList.remove('fa-expand');
            fullBtn.classList.add('fa-compress');
            fullBtn.innerHTML = " Exit";
            document.body.style.overflow = 'hidden'; // Stop page scroll
        } else {
            fullBtn.classList.remove('fa-compress');
            fullBtn.classList.add('fa-expand');
            fullBtn.innerHTML = " Fullscreen";
            document.body.style.overflow = ''; // Restore page scroll
        }
    }

	if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            window.print(); // Déclenche la fenêtre d'impression/sauvegarde PDF du navigateur
        });
    }

    // Event Listeners
    nextBtn.addEventListener('click', goNext);
    prevBtn.addEventListener('click', goPrev);
    fullBtn.addEventListener('click', toggleDeckFullscreen);

    // Keyboard support
    document.addEventListener('keydown', function(e) {
        // Only if deck is visible or focused, but good for UX generally
        // Check if deck is in fullscreen for stricter control
        if (deck.classList.contains('fullscreen')) {
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'Escape') toggleDeckFullscreen();
        }
    });
});


/* ---------------------------------------- */
/* PROJECT MODAL FUNCTIONALITY     */
/* ---------------------------------------- */

// Function to open modal
// Now accepts the clicked element 'el' directly
function openModal(el) {
    var modal = document.getElementById("projectModal");
    var title = document.getElementById("modalTitle");
    var image = document.getElementById("modalImage");
    var descContainer = document.getElementById("modalDescription");

    // Get data from attributes
    title.innerText = el.getAttribute("data-title");
    image.src = el.getAttribute("data-img");
    
    // Get the hidden HTML content from within the card
    var hiddenContent = el.querySelector(".full-description").innerHTML;
    descContainer.innerHTML = hiddenContent;

    // Show Modal
    modal.style.display = "flex";
    
    // Lock background scrolling
    document.body.classList.add("modal-open");
}

// Function to close modal
function closeModal() {
    document.getElementById("projectModal").style.display = "none";
    document.body.classList.remove("modal-open");
}

// Close modal when clicking outside of the content box
window.onclick = function(event) {
    let modal = document.getElementById("projectModal");
    if (event.target === modal) {
        closeModal();
    }
};

// Close on Escape Key
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});