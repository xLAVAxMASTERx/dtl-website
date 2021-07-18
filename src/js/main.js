// import javascript
import { calendar } from "./cal.js";
import {
	goToBooking,
	hideContact,
	openDropdown,
	openGoogleMap,
	openSelector,
	scaleGrids,
	showContact,
	toggleSmallMenu,
	updateListSelection,
} from "./utils-project";
import { foreach } from "./utils-standard.js";
import { openImgFullscreen, openBookingModal, closeModalManually } from "./overlays.js";
import { toggleAccordion } from "./accordion.js";
import InjectWarning from "./inject-warning.js";
import { tns } from "../../node_modules/tiny-slider/src/tiny-slider";

// import styles
import "../css/main.css";
import "../../node_modules/tiny-slider/src/tiny-slider.scss";
import { Fade } from "./animations.js";

const sliderDefaultOpts = {
	autoplay: false,
	autoplayButton: false,
	autoplayButtonOutput: false,
	autoplayHoverPause: true,
	autoplayTimeout: 15000,
	controls: true,
	items: 1,
	lazyload: true,
	lazyloadSelector: ".tns-lazy",
	mode: "gallery",
	mouseDrag: false,
	nav: true,
	navAsThumbnails: true,
	navPosition: "bottom",
	rewind: true,
	slideBy: "page",
	speed: 500,
	swipeAngle: 15,
	touch: false,
};

const setEventListeners = () => {
	// enlarge images in sliders
	foreach(document.querySelectorAll(".main .slider"), (slider) =>
		slider.addEventListener("click", openImgFullscreen)
	);

	// accordion
	document.querySelectorAll(".accordion").forEach((el) => {
		el.addEventListener("click", toggleAccordion);
	});

	// dropdowns in booking modal
	document.querySelector("#select-house").addEventListener("click", openDropdown);
	document.querySelector("#select-guests").addEventListener("click", openDropdown);
	document.querySelector("#select-extras").addEventListener("click", openSelector);

	// autoscroll in horizontal image thumbnails
	foreach(document.querySelectorAll(".customize-tools ul.controls li"), (btn) => {
		btn.addEventListener("click", updateListSelection);
	});
	foreach(document.querySelectorAll(".customize-tools ul.thumbnails"), (btn) => {
		btn.addEventListener("click", (e) => updateListSelection(e, false));
	});

	// jump to booking through buttons in price cards
	foreach(document.querySelectorAll("[data-target='booking']"), (btn) =>
		btn.addEventListener("click", goToBooking)
	);

	// open booking modal
	document.querySelector("#contact").addEventListener("click", openBookingModal);

	// closing button in all modals (currently only one in use)
	foreach(document.querySelectorAll(".modal .close-button"), (el) => {
		el.addEventListener("click", closeModalManually);
	});

	// animation for contact bar in booking modal
	foreach(document.querySelectorAll(".contact-panel--item"), (el) => {
		el.addEventListener("mouseenter", showContact);
		el.addEventListener("mouseleave", hideContact);
	});

	// show google maps
	document.querySelector(".map .note").addEventListener("click", openGoogleMap);

	// toggle side nav with button on small screens
	document.querySelector("header.s").addEventListener("click", toggleSmallMenu);

	window.addEventListener("resize", handleWindowResize);
	window.addEventListener("scroll", handleWindowScroll);
};

const removeLoadingMask = () => {
	Fade.out(document.querySelector(".mask"), 1500, true);
};

let prevScrollPos = window.pageYOffset;
const toggleNavOnScroll = () => {
	const currentScrollPos = window.pageYOffset;
	const headerL = document.querySelector("header.l");
	const headerS = document.querySelector("header.s");
	const landing = document.querySelector("section.landing");

	// avoid equal case -> do nothing on init
	if (prevScrollPos > currentScrollPos) {
		if (window.innerWidth >= 768) {
			headerL.style.top = 0;
			landing.style.marginTop = "var(--header-height)";
		} else {
			headerS.style.right = "20px";
		}
	} else if (prevScrollPos < currentScrollPos) {
		if (window.innerWidth >= 768) {
			headerL.style.top = "calc(-1 * var(--header-height))";
			landing.style.marginTop = 0;
		} else {
			headerS.style.right = "-60px";
		}
	}
	prevScrollPos = currentScrollPos;
};

const handleWindowScroll = () => {
	toggleNavOnScroll();
};

const handleWindowResize = () => {
	scaleGrids();
};

// ---------------------------------------------------
// init
// ---------------------------------------------------

const init = async () => {
	setEventListeners();
	calendar.init({ disablePastDays: true, markToday: true });

	tns(
		Object.assign(sliderDefaultOpts, {
			container: "#slider-duene",
			controlsContainer: "#slider-duene-controls",
			navContainer: "#slider-duene-thumbnails",
		})
	);
	tns(
		Object.assign(sliderDefaultOpts, {
			container: "#slider-moewe",
			controlsContainer: "#slider-moewe-controls",
			navContainer: "#slider-moewe-thumbnails",
		})
	);
	tns(
		Object.assign(sliderDefaultOpts, {
			autoplay: true,
			container: "#slider-landing",
			controls: false,
			navContainer: "#slider-landing-nav",
			preventScrollOnTouch: false,
			speed: 1000,
		})
	);
};

document.addEventListener("DOMContentLoaded", () => {
	init();
	removeLoadingMask();
});
window.addEventListener("load", () => {
	handleWindowResize();

	// inject "under construction" warning
	const warning = new InjectWarning();
	warning.setParent(document.querySelector("main section.landing"));
	warning.setMessage(
		"Buchungskalender nicht aktuell. Seite wird noch minimal überarbeitet. Buchung/Nachfragen trotzdem möglich."
	);
	warning.addClass("warning");
	warning.inject();
});
