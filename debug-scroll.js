// Debug script to test scroll behavior
// Run this in the browser console when the page is stuck

console.log('=== SCROLL DEBUG UTILITY ===');

// 1. Check body and html overflow
console.log('Body overflow:', getComputedStyle(document.body).overflow);
console.log('HTML overflow:', getComputedStyle(document.documentElement).overflow);

// 2. Check if Lenis is running
if (window.lenis) {
  console.log('Lenis status:', window.lenis);
  console.log('Trying to start Lenis...');
  window.lenis.start();
  console.log('Lenis started');
} else {
  console.log('Lenis not found');
}

// 3. Force unlock scrolling
function forceUnlockScroll() {
  console.log('Force unlocking scroll...');
  
  // Reset body/html styles
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
  document.body.style.position = 'static';
  document.body.style.height = 'auto';
  
  // Reset any fixed elements
  const allElements = document.querySelectorAll('*');
  allElements.forEach(el => {
    if (getComputedStyle(el).position === 'fixed' && el.style.position) {
      console.log('Found fixed element:', el);
    }
  });
  
  console.log('Scroll unlocked');
}

// 4. Check benefits section
const benefitsSection = document.getElementById('benefits-section');
if (benefitsSection) {
  const rect = benefitsSection.getBoundingClientRect();
  console.log('Benefits section position:', {
    top: rect.top,
    bottom: rect.bottom,
    height: rect.height,
    viewportHeight: window.innerHeight,
    isInView: rect.top <= 0 && rect.bottom >= window.innerHeight
  });
}

// 5. Monitor wheel events
let wheelEventCount = 0;
const originalWheel = window.addEventListener;
window.addEventListener('wheel', function(e) {
  wheelEventCount++;
  console.log(`Wheel event #${wheelEventCount}:`, {
    deltaY: e.deltaY,
    defaultPrevented: e.defaultPrevented,
    target: e.target.className || e.target.tagName
  });
}, { passive: false, capture: true });

// 6. Emergency escape function
window.emergencyEscape = function() {
  console.log('EMERGENCY ESCAPE ACTIVATED');
  
  // Force unlock everything
  forceUnlockScroll();
  
  // Start Lenis if available
  if (window.lenis) {
    window.lenis.start();
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
  
  console.log('Emergency escape complete - try scrolling now');
};

console.log('Debug utility loaded. Functions available:');
console.log('- forceUnlockScroll() : Unlock all scroll restrictions');
console.log('- emergencyEscape() : Full reset and scroll to top');
console.log('Monitoring wheel events...');