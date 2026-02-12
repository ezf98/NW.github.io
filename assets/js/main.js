/*
	Story by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Browser fixes.

		// IE: Flexbox min-height bug.
			if (browser.name == 'ie')
				(function() {

					var flexboxFixTimeoutId;

					$window.on('resize.flexbox-fix', function() {

						var $x = $('.fullscreen');

						clearTimeout(flexboxFixTimeoutId);

						flexboxFixTimeoutId = setTimeout(function() {

							if ($x.prop('scrollHeight') > $window.height())
								$x.css('height', 'auto');
							else
								$x.css('height', '100vh');

						}, 250);

					}).triggerHandler('resize.flexbox-fix');

				})();

		// Object fit workaround.
			if (!browser.canUse('object-fit'))
				(function() {

					$('.banner .image, .spotlight .image').each(function() {

						var $this = $(this),
							$img = $this.children('img'),
							positionClass = $this.parent().attr('class').match(/image-position-([a-z]+)/);

						// Set image.
							$this
								.css('background-image', 'url("' + $img.attr('src') + '")')
								.css('background-repeat', 'no-repeat')
								.css('background-size', 'cover');

						// Set position.
							switch (positionClass.length > 1 ? positionClass[1] : '') {

								case 'left':
									$this.css('background-position', 'left');
									break;

								case 'right':
									$this.css('background-position', 'right');
									break;

								default:
								case 'center':
									$this.css('background-position', 'center');
									break;

							}

						// Hide original.
							$img.css('opacity', '0');

					});

				})();

	// Smooth scroll.
		$('.smooth-scroll').scrolly();
		$('.smooth-scroll-middle').scrolly({ anchor: 'middle' });

	// Wrapper.
		$wrapper.children()
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			});

	// Items.
		$('.items')
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				delay:		50,
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			})
			.children()
				.wrapInner('<div class="inner"></div>');

	// Gallery.
		$('.gallery')
			.wrapInner('<div class="inner"></div>')
			.prepend(browser.mobile ? '' : '<div class="forward"></div><div class="backward"></div>')
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				delay:		50,
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			})
			.children('.inner')
				//.css('overflow', 'hidden')
				.css('overflow-y', browser.mobile ? 'visible' : 'hidden')
				.css('overflow-x', browser.mobile ? 'scroll' : 'hidden')
				.scrollLeft(0);

		// Style #1.
			// ...

		// Style #2.
			$('.gallery')
				.on('wheel', '.inner', function(event) {

					var	$this = $(this),
						delta = (event.originalEvent.deltaX * 10);

					// Cap delta.
						if (delta > 0)
							delta = Math.min(25, delta);
						else if (delta < 0)
							delta = Math.max(-25, delta);

					// Scroll.
						$this.scrollLeft( $this.scrollLeft() + delta );

				})
				.on('mouseenter', '.forward, .backward', function(event) {

					var $this = $(this),
						$inner = $this.siblings('.inner'),
						direction = ($this.hasClass('forward') ? 1 : -1);

					// Clear move interval.
						clearInterval(this._gallery_moveIntervalId);

					// Start interval.
						this._gallery_moveIntervalId = setInterval(function() {
							$inner.scrollLeft( $inner.scrollLeft() + (5 * direction) );
						}, 10);

				})
				.on('mouseleave', '.forward, .backward', function(event) {

					// Clear move interval.
						clearInterval(this._gallery_moveIntervalId);

				});

		// Lightbox.
			$('.gallery.lightbox')
				.on('click', 'a', function(event) {

					var $a = $(this),
						$gallery = $a.parents('.gallery'),
						$modal = $gallery.children('.modal'),
						$modalImg = $modal.find('img'),
						href = $a.attr('href');

					// Not an image? Bail.
						if (!href.match(/\.(jpg|gif|png|mp4)$/))
							return;

					// Prevent default.
						event.preventDefault();
						event.stopPropagation();

					// Locked? Bail.
						if ($modal[0]._locked)
							return;

					// Lock.
						$modal[0]._locked = true;

					// Set src.
						$modalImg.attr('src', href);

					// Set visible.
						$modal.addClass('visible');

					// Focus.
						$modal.focus();

					// Delay.
						setTimeout(function() {

							// Unlock.
								$modal[0]._locked = false;

						}, 600);

				})
				.on('click', '.modal', function(event) {

					var $modal = $(this),
						$modalImg = $modal.find('img');

					// Locked? Bail.
						if ($modal[0]._locked)
							return;

					// Already hidden? Bail.
						if (!$modal.hasClass('visible'))
							return;

					// Lock.
						$modal[0]._locked = true;

					// Clear visible, loaded.
						$modal
							.removeClass('loaded')

					// Delay.
						setTimeout(function() {

							$modal
								.removeClass('visible')

							setTimeout(function() {

								// Clear src.
									$modalImg.attr('src', '');

								// Unlock.
									$modal[0]._locked = false;

								// Focus.
									$body.focus();

							}, 475);

						}, 125);

				})
				.on('keypress', '.modal', function(event) {

					var $modal = $(this);

					// Escape? Hide modal.
						if (event.keyCode == 27)
							$modal.trigger('click');

				})
				.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
					.find('img')
						.on('load', function(event) {

							var $modalImg = $(this),
								$modal = $modalImg.parents('.modal');

							setTimeout(function() {

								// No longer visible? Bail.
									if (!$modal.hasClass('visible'))
										return;

								// Set loaded.
									$modal.addClass('loaded');

							}, 275);

						});
						document.addEventListener("DOMContentLoaded", function () {
							let timelineEvents = document.querySelectorAll(".timeline-event");
						
							function revealEvents() {
								let windowHeight = window.innerHeight;
						
								timelineEvents.forEach(event => {
									let positionFromTop = event.getBoundingClientRect().top;
									if (positionFromTop - windowHeight <= -50) {
										event.style.opacity = 1;
										event.style.transform = "translateX(0)";
									}
								});
							}
						
							window.addEventListener("scroll", revealEvents);
							revealEvents();
						});

// Get references to elements
const complimentButton = document.getElementById("complimentButton");
const complimentPopup = document.getElementById("complimentPopup");
const closeBtn = document.querySelector("#complimentPopup .close-btn");
const complimentText = document.getElementById("complimentText");
const generateComplimentButton = document.querySelector("#complimentPopup button"); // "Generate Compliment" button



// List of compliments (add as many as you'd like)
const compliments = [
   "You light up my whole life! ✨",
	"Your kindness melts my heart! 💖",
	"I'm always happy to see your cute smile! 😊",
	"You're the most amazing person I know! 🥰",
	"Every moment with you is the best! 🌟",
	"You're smart, prrrrretty, and absolutely wonderful! 😍",
	"I love to hear you laugh! 🤭",
	"Being with you makes me the happiest person! 💜",
	"I'm so lucky to have you! 🍀",
	"Everything about you is perfect to me! 😘",
	"I love your banana bread! 😍",
	"Your hair is just perfect!",
	"Your popa is epic, no, legendary! 😍",
	"I love you and I choose you every single day 💜",
	"I care about you morning, noon and night 😘",
	"Your sense of humor is the best! 🤭",
	"I love your art, specially the crying umbrella 🥰",
	"Your eyes have a spark that I could get lost in 😍",
	"Being yourself is very attractive 😊",
	"Your presence alone is enough to make my life brighter! 💖",
];

// Function to show the compliment pop-up
function showComplimentPopup() {
    // Generate and show a random compliment when the pop-up is opened
    generateNewCompliment();
    
    // Display the pop-up
    complimentPopup.classList.add("show");
}

// Function to generate a new random compliment
function generateNewCompliment() {
    // Randomly select a compliment
    const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];

    // Insert the new compliment into the pop-up content
    complimentText.innerHTML = randomCompliment;
}

// Function to close the compliment pop-up
function closeComplimentPopup() {
    complimentPopup.classList.remove("show");
}

// Add event listener to the compliment button to trigger the pop-up
complimentButton.addEventListener("click", showComplimentPopup);

// Add event listener to the close button inside the pop-up to close it
closeBtn.addEventListener("click", closeComplimentPopup);

// Ensure the "Generate Compliment" button works
if (generateComplimentButton) {
    generateComplimentButton.addEventListener("click", generateNewCompliment);
}

// Close pop-up when clicking outside the pop-up content area
window.addEventListener("click", function (event) {
    if (event.target === complimentPopup) {
        closeComplimentPopup();
    }


});

	window.addEventListener("load", () => {
  const canvas = document.getElementById("heartsCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const hearts = [];

  function createHeart() {
    hearts.push({
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      size: Math.random() * 10 + 5, // smaller hearts
      speed: Math.random() * 1 + 0.3,
      opacity: Math.random() * 0.5 + 0.5,
      drift: Math.random() * 0.5 - 0.25,
      color: `rgba(170, 85, 255, ${Math.random() * 0.4 + 0.4})` // soft purple tones 💜
    });
  }

  function drawHeart(h) {
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.scale(h.size / 20, h.size / 20);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(0, -3, -5, -15, -15, -15);
    ctx.bezierCurveTo(-35, -15, -35, 10, -35, 10);
    ctx.bezierCurveTo(-35, 25, -15, 40, 0, 55);
    ctx.bezierCurveTo(15, 40, 35, 25, 35, 10);
    ctx.bezierCurveTo(35, 10, 35, -15, 15, -15);
    ctx.bezierCurveTo(5, -15, 0, -3, 0, 0);
    ctx.fillStyle = h.color;
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(h => {
      h.y -= h.speed;
      h.x += h.drift;
      drawHeart(h);
    });
    for (let i = hearts.length - 1; i >= 0; i--) {
      if (hearts[i].y < -50) hearts.splice(i, 1);
    }
    requestAnimationFrame(animate);
  }

  // Delay hearts animation by 10 seconds
  setTimeout(() => {
    setInterval(createHeart, 400);
    animate();
  }, 10000);
});






})(jQuery);