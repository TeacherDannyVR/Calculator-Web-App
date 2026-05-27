/* ===================================
   META RAY-BAN DISPLAY WEB APP TEMPLATE v2
   - State-based rendering system
   - D-pad navigation (Arrow keys + Enter)
   - localStorage support
   - Sensor permission boilerplate
   =================================== */

// ============ DOM ELEMENTS ============
const calcExpression = document.getElementById('calcExpression');
const calcResult = document.getElementById('calcResult');

const btn0 = document.getElementById('btn0');
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const btn4 = document.getElementById('btn4');
const btn5 = document.getElementById('btn5');
const btn6 = document.getElementById('btn6');
const btn7 = document.getElementById('btn7');
const btn8 = document.getElementById('btn8');
const btn9 = document.getElementById('btn9');

const btnAdd = document.getElementById('btnAdd');
const btnSubtract = document.getElementById('btnSubtract');
const btnMultiply = document.getElementById('btnMultiply');
const btnDivide = document.getElementById('btnDivide');
const btnEquals = document.getElementById('btnEquals');
const btnClear = document.getElementById('btnClear');
const btnDelete = document.getElementById('btnDelete');
const btnDecimal = document.getElementById('btnDecimal');

// ============ D-PAD INPUT CONSTANTS ============
const DPAD = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  SELECT: 'Enter',
  BACK: 'Escape'
};

// ============ CALCULATOR STATE ============
let calcState = {
  currentValue: '0',
  previousValue: '',
  operation: null,
  shouldResetDisplay: false
};

// ============ CALCULATOR DISPLAY UPDATE ============
function updateCalcDisplay() {
  calcResult.textContent = calcState.currentValue;
  
  if (calcState.previousValue && calcState.operation) {
    const opSymbol = calcState.operation === '/' ? '÷' : 
                     calcState.operation === '*' ? '×' : 
                     calcState.operation === '-' ? '−' : '+';
    calcExpression.textContent = `${calcState.previousValue} ${opSymbol}`;
  } else {
    calcExpression.textContent = '0';
  }
  
  saveToStorage('calcState', calcState);
}

// ============ LOCALSTORAGE HELPERS ============
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

function loadFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
    return defaultValue;
  }
}

// ============ SENSOR PERMISSION BOILERPLATE ============
/**
 * HOW TO USE SENSORS ON META RAY-BAN DISPLAY GLASSES
 * 
 * STEP 1: Uncomment the sensor functions below (remove the surrounding comment markers)
 * 
 * STEP 2: Add sensor activation to a button click handler
 *         Example - Add this to handleButton1():
 *         
 *         async function handleButton1() {
 *           const granted = await requestSensorPermission();
 *           if (granted) {
 *             // Start listening to orientation (compass, tilt, roll)
 *             window.addEventListener('deviceorientation', handleOrientation);
 *             
 *             // OR start listening to motion (accelerometer, gyroscope)
 *             // window.addEventListener('devicemotion', handleMotion);
 *             
 *             updateDisplay('Sensors Active', 'Tracking head movement');
 *           }
 *         }
 * 
 * STEP 3: To stop listening to sensors, remove the event listener:
 *         window.removeEventListener('deviceorientation', handleOrientation);
 * 
 * IMPORTANT NOTES:
 * - Sensors MUST be activated by a user gesture (button press) - this is a browser security requirement
 * - On iOS 13+, permission is required. On Android, no permission needed.
 * - DeviceOrientation = compass heading, tilt, roll (good for head tracking)
 * - DeviceMotion = accelerometer, gyroscope (good for movement detection)
 * - You can listen to both events simultaneously if needed
 * 
 * AVAILABLE SENSOR DATA:
 * DeviceOrientationEvent:
 *   - event.alpha: Compass heading (0-360°, 0=North)
 *   - event.beta: Forward/backward tilt (-180° to 180°)
 *   - event.gamma: Left/right tilt (-90° to 90°)
 * 
 * DeviceMotionEvent:
 *   - event.accelerationIncludingGravity.x/y/z: Acceleration in m/s²
 *   - event.rotationRate.alpha/beta/gamma: Rotation speed in degrees/second
 */

/*
// STEP 1: Request permission (iOS 13+ requirement)
async function requestSensorPermission() {
  // Check if permission API exists (iOS 13+)
  if (typeof DeviceOrientationEvent !== 'undefined' && 
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        updateDisplay(null, 'Sensor access granted!');
        return true;
      } else {
        updateDisplay(null, 'Sensor access denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting sensor permission:', error);
      updateDisplay(null, 'Permission error');
      return false;
    }
  } else {
    // No permission needed (Android, older iOS)
    updateDisplay(null, 'Sensors available');
    return true;
  }
}

// STEP 2A: Handle DeviceOrientation events (compass, tilt, roll)
function handleOrientation(event) {
  const heading = event.alpha;  // Compass: 0-360° (0=North, 90=East, 180=South, 270=West)
  const tilt = event.beta;      // Forward/back tilt: -180° to 180° (positive=tilting forward)
  const roll = event.gamma;     // Left/right tilt: -90° to 90° (positive=tilting right)
  
  // Example: Display compass heading
  updateDisplay(null, `Heading: ${Math.round(heading)}°`);
  
  // Example: Detect if user is looking down
  // if (tilt > 45) {
  //   updateDisplay(null, 'Looking down');
  // }
  
  // Example: Detect head tilt left/right
  // if (roll < -20) {
  //   updateDisplay(null, 'Head tilted left');
  // } else if (roll > 20) {
  //   updateDisplay(null, 'Head tilted right');
  // }
}

// STEP 2B: Handle DeviceMotion events (accelerometer, gyroscope)
function handleMotion(event) {
  // Accelerometer data (includes gravity)
  const ax = event.accelerationIncludingGravity.x;
  const ay = event.accelerationIncludingGravity.y;
  const az = event.accelerationIncludingGravity.z;
  
  // Calculate total G-force
  const g = Math.sqrt(ax * ax + ay * ay + az * az) / 9.81;
  updateDisplay(null, `G-force: ${g.toFixed(2)}g`);
  
  // Gyroscope data (rotation rate in degrees/second)
  // const yawRate = event.rotationRate.alpha;    // Spinning around (like shaking head "no")
  // const pitchRate = event.rotationRate.beta;   // Nodding (like nodding head "yes")
  // const rollRate = event.rotationRate.gamma;   // Tilting side to side
  
  // Example: Detect shake gesture
  // if (g > 2.0) {
  //   updateDisplay(null, 'Shake detected!');
  // }
  
  // Example: Detect if glasses are stationary
  // if (g < 1.1 && g > 0.9) {
  //   updateDisplay(null, 'Stationary');
  // }
}

// STEP 3: Optional - Throttle sensor updates to improve performance
// Sensors fire very frequently (60+ times per second). Use throttling to reduce updates.
let lastSensorUpdate = 0;
const SENSOR_THROTTLE_MS = 100; // Update every 100ms (10 times per second)

function handleOrientationThrottled(event) {
  const now = Date.now();
  if (now - lastSensorUpdate < SENSOR_THROTTLE_MS) return;
  lastSensorUpdate = now;
  
  handleOrientation(event);
}

// Use throttled version:
// window.addEventListener('deviceorientation', handleOrientationThrottled);
*/

// ============ CALCULATOR FUNCTIONS ============
function inputNumber(num) {
  if (calcState.shouldResetDisplay) {
    calcState.currentValue = num;
    calcState.shouldResetDisplay = false;
  } else {
    if (calcState.currentValue === '0') {
      calcState.currentValue = num;
    } else {
      calcState.currentValue += num;
    }
  }
  updateCalcDisplay();
}

function inputDecimal() {
  if (calcState.shouldResetDisplay) {
    calcState.currentValue = '0.';
    calcState.shouldResetDisplay = false;
  } else if (!calcState.currentValue.includes('.')) {
    calcState.currentValue += '.';
  }
  updateCalcDisplay();
}

function inputOperation(op) {
  if (calcState.operation && !calcState.shouldResetDisplay) {
    calculate();
  }
  
  calcState.previousValue = calcState.currentValue;
  calcState.operation = op;
  calcState.shouldResetDisplay = true;
  updateCalcDisplay();
}

function calculate() {
  if (!calcState.operation || !calcState.previousValue) return;
  
  const prev = parseFloat(calcState.previousValue);
  const current = parseFloat(calcState.currentValue);
  let result;
  
  switch (calcState.operation) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      result = current !== 0 ? prev / current : 'Error';
      break;
    default:
      return;
  }
  
  if (result === 'Error') {
    calcState.currentValue = 'Error';
  } else {
    calcState.currentValue = String(Math.round(result * 100000000) / 100000000);
  }
  
  calcState.operation = null;
  calcState.previousValue = '';
  calcState.shouldResetDisplay = true;
  updateCalcDisplay();
}

function clearCalculator() {
  calcState.currentValue = '0';
  calcState.previousValue = '';
  calcState.operation = null;
  calcState.shouldResetDisplay = false;
  updateCalcDisplay();
}

function deleteLastDigit() {
  if (calcState.currentValue.length > 1) {
    calcState.currentValue = calcState.currentValue.slice(0, -1);
  } else {
    calcState.currentValue = '0';
  }
  updateCalcDisplay();
}

// ============ FOCUS MANAGEMENT ============
function moveFocus(direction) {
  const focusables = Array.from(
    document.querySelectorAll('.focusable:not([disabled]):not(.hidden)')
  );
  if (!focusables.length) return;

  const current = document.activeElement;
  if (!current || !current.classList.contains('focusable')) {
    focusables[0].focus();
    return;
  }

  // Get current button's position in the grid
  const currentRect = current.getBoundingClientRect();
  const currentX = currentRect.left + currentRect.width / 2;
  const currentY = currentRect.top + currentRect.height / 2;

  let candidates = [];

  // Filter buttons based on direction
  focusables.forEach(btn => {
    if (btn === current) return;
    
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const dx = x - currentX;
    const dy = y - currentY;
    
    // Check if button is in the correct direction
    let isInDirection = false;
    if (direction === 'up' && dy < -10) isInDirection = true;
    if (direction === 'down' && dy > 10) isInDirection = true;
    if (direction === 'left' && dx < -10) isInDirection = true;
    if (direction === 'right' && dx > 10) isInDirection = true;
    
    if (isInDirection) {
      const distance = Math.sqrt(dx * dx + dy * dy);
      candidates.push({ btn, distance, dx, dy });
    }
  });

  if (candidates.length === 0) return;

  // Sort by distance and pick the closest
  candidates.sort((a, b) => a.distance - b.distance);
  const next = candidates[0].btn;
  
  next.focus();
  next.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// ============ D-PAD LISTENER ============
document.addEventListener('keydown', function(e) {
  switch (e.key) {
    case DPAD.UP:
      moveFocus('up');
      break;
    case DPAD.DOWN:
      moveFocus('down');
      break;
    case DPAD.LEFT:
      moveFocus('left');
      break;
    case DPAD.RIGHT:
      moveFocus('right');
      break;
    case DPAD.SELECT:
      if (document.activeElement.classList.contains('focusable')) {
        document.activeElement.click();
      }
      break;
    default:
      return;
  }
  e.preventDefault();
});

// ============ BUTTON CLICK HANDLERS ============
btn0.addEventListener('click', () => inputNumber('0'));
btn1.addEventListener('click', () => inputNumber('1'));
btn2.addEventListener('click', () => inputNumber('2'));
btn3.addEventListener('click', () => inputNumber('3'));
btn4.addEventListener('click', () => inputNumber('4'));
btn5.addEventListener('click', () => inputNumber('5'));
btn6.addEventListener('click', () => inputNumber('6'));
btn7.addEventListener('click', () => inputNumber('7'));
btn8.addEventListener('click', () => inputNumber('8'));
btn9.addEventListener('click', () => inputNumber('9'));

btnAdd.addEventListener('click', () => inputOperation('+'));
btnSubtract.addEventListener('click', () => inputOperation('-'));
btnMultiply.addEventListener('click', () => inputOperation('*'));
btnDivide.addEventListener('click', () => inputOperation('/'));
btnEquals.addEventListener('click', calculate);
btnClear.addEventListener('click', clearCalculator);
btnDelete.addEventListener('click', deleteLastDigit);
btnDecimal.addEventListener('click', inputDecimal);

// ============ INITIALIZATION ============
function init() {
  // Load saved state from localStorage
  const savedState = loadFromStorage('calcState', null);
  if (savedState) {
    calcState = savedState;
  }
  
  // Set initial display
  updateCalcDisplay();
  
  // Set initial focus
  btnClear.focus();
  
  console.log('Calculator initialized for Meta Ray-Ban Display');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
