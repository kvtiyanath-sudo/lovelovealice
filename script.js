// Variable States
let pinInput = "";
const correctPin = "2109";
let litCandlesCount = 0;
let currentSlide = 0;

// Element References
const stepEnvelope = document.getElementById('step-envelope');
const stepPin = document.getElementById('step-pin');
const stepReady = document.getElementById('step-ready');
const stepCake = document.getElementById('step-cake');
const stepWish = document.getElementById('step-wish');
const stepSky = document.getElementById('step-sky');
const stepCard = document.getElementById('step-card');
const bgMusic = document.getElementById('bg-music');

// 💌 1. Envelope Open
document.getElementById('envelope-btn').addEventListener('click', function () {
    const envelope = this.querySelector('.envelope');
    envelope.classList.add('open');
    setTimeout(() => {
        switchStep(stepEnvelope, stepPin);
    }, 800);
});

// 🔐 2. PIN System
function pressPin(num) {
    if (pinInput.length < 4) {
        pinInput += num;
        updatePinDisplay();
    }

    if (pinInput.length === 4) {
        checkPin();
    }
}

function deletePin() {
    pinInput = pinInput.slice(0, -1);
    updatePinDisplay();
}

function clearPin() {
    pinInput = "";
    updatePinDisplay();
}

function updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, index) => {
        if (index < pinInput.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function checkPin() {
    const status = document.getElementById('pin-status');
    if (pinInput === correctPin) {
        status.innerText = "✓ เจ้าของวันเกิดตัวจริงมาแล้ว!";
        createBurst(['⭐', '✨', '💗', '💖']);
        setTimeout(() => {
            switchStep(stepPin, stepReady);
        }, 1200);
    } else {
        status.innerText = "รหัสไม่ถูกต้อง ลองใหม่อีกทีน้า 🥺";
        setTimeout(() => {
            clearPin();
            status.innerText = "";
        }, 1000);
    }
}

// 💖 3. Moving No Button
function moveNoButton() {
    const btnNo = document.getElementById('btn-no');
    const x = Math.random() * 120 - 60;
    const y = Math.random() * 80 - 40;
    btnNo.style.transform = `translate(${x}px, ${y}px)`;
}

function goToCandles() {
    switchStep(stepReady, stepCake);
}

// 🎂 4. Candle System
function lightCandle(index) {
    const flame = document.getElementById(`flame-${index}`);
    const msg = document.getElementById(`msg-${index}`);

    if (flame.classList.contains('hidden')) {
        flame.classList.remove('hidden');
        msg.classList.remove('hidden');
        playAudioTone();
        litCandlesCount++;

        if (litCandlesCount === 3) {
            document.getElementById('audio-announcement').classList.remove('hidden');
            document.getElementById('btn-blow').classList.remove('hidden');
            document.getElementById('cake-instruction').innerText = "ปักเทียนครบแล้ว! มาเป่าเค้กกันน้า 🎂";

            // เริ่มเล่นเพลงอวยพร/เสียงพูด
            if (bgMusic) {
                bgMusic.play().catch(e => console.log("Audio play deferred:", e));
            }
        }
    }
}

// เสียง ติ๊ง ✨ เมื่อจุดเทียน (Web Audio API)
function playAudioTone() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.log("Audio error:", e);
    }
}

// 💨 5. Blow Candles Out
function blowCandles() {
    const flames = document.querySelectorAll('.flame');
    flames.forEach(f => f.classList.add('shake'));

    setTimeout(() => {
        flames.forEach(f => f.classList.add('hidden'));
        setTimeout(() => {
            switchStep(stepCake, stepWish);
            setTimeout(() => {
                switchStep(stepWish, stepSky);
                generateStars();
            }, 3000);
        }, 1000);
    }, 800);
}

// 🌌 6. Generate Stars & Gift
function generateStars() {
    const container = document.getElementById('stars-container');
    const symbols = ['⭐', '✨', '🌙', '💗'];
    container.innerHTML = '';

    for (let i = 0; i < 40; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.fontSize = `${Math.random() * 14 + 10}px`;
        star.style.setProperty('--duration', `${Math.random() * 2 + 1}s`);
        container.appendChild(star);
    }
}

function openGift() {
    createBurst(['💗', '🌸', '✨', '🎁', '💖']);
    setTimeout(() => {
        switchStep(stepSky, stepCard);
        startGallery();
        startTypingText();
    }, 600);
}

// 📸 7. Mini Gallery Slider
function startGallery() {
    setInterval(() => {
        currentSlide = (currentSlide + 1) % 3;
        const slides = document.getElementById('slides');
        if (slides) {
            slides.style.transform = `translateX(-${currentSlide * 33.333}%)`;
        }
    }, 3000);
}

// 💬 Typing Text Effect
const fullText = `Happy Birthday นะยู 🎂💗

ขอให้ปีนี้เป็นปีที่น่ารักกับยูมาก ๆ เลยน้า ขอให้ยูเจอแต่เรื่องดี ๆ มีความสุขในทุก ๆ วัน อยากทำอะไรก็ขอให้สมหวัง มีคนรักยูเยอะ ๆ และที่สำคัญ อย่าลืมว่าไอจะคอยอยู่ข้าง ๆ ยูเสมอน้าา 🫶🏻

ขอบคุณที่เข้ามาเป็นความสุข เป็นรอยยิ้ม และเป็นคนพิเศษของไอ ขอบคุณสำหรับทุกช่วงเวลาที่เราได้คุยกันนะ ถึงบางทีไออาจจะงอแง ดื้อ หรือทำตัวไม่น่ารักไปบ้าง แต่ไอรักยูมาก ๆ เลยน้าา 🥺💞

วันเกิดปีนี้ ไอขอให้ยูมีความสุขมากที่สุดเลย ขอให้รอยยิ้มของยูอยู่กับยูไปนาน ๆ และถ้าเป็นไปได้ ไอก็อยากอยู่เห็นรอยยิ้มนั้นในทุก ๆ ปีเลยนะ

ดีใจที่วันนี้เมื่อ 16 ปีที่แล้ว ได้มีเธอเกิดมา ทำให้โลกใบนี้มีคนน่ารักเพิ่มขึ้นมาอีกตั้งหนึ่งคนแน่ะ 🥺🎀

รักยูนะ เจ้าคนน่ารักของไอ 💐💗
ขอให้วันนี้เป็นวันที่น่ารักที่สุดของยูเลยยย 🎂✨`;

function startTypingText() {
    const el = document.getElementById('typed-text');
    let index = 0;
    el.innerText = "";

    function typeChar() {
        if (index < fullText.length) {
            el.innerText += fullText.charAt(index);
            index++;
            setTimeout(typeChar, 45);
        } else {
            document.getElementById('rating-section').classList.remove('hidden');
        }
    }
    typeChar();
}

// 🥰 8. Rating Interactivity
function giveRating(type) {
    const res = document.getElementById('rating-result');
    if (type === 'cute') {
        res.innerText = "🥺 (เขินนนน ขอบคุณนะยู!)";
        createBurst(['🥺', '🌸', '💖']);
    } else if (type === 'love') {
        res.innerText = "💗 (ไอก็ชอบยูที่สุดเลย!)";
        createBurst(['💗', '💓', '💕', '❤️']);
    } else if (type === 'impressed') {
        res.innerText = "🎀 (ดีใจที่ยูชอบน้าาา)";
        createBurst(['🎀', '✨', '🌸']);
    } else if (type === 'best') {
        res.innerText = "✨ (เย้! มีความสุขที่สุดเลยยย)";
        createBurst(['🎉', '✨', '🎆', '🌟', '💖']);
    }
}

// Helper Functions
function switchStep(fromStep, toStep) {
    fromStep.classList.add('hidden');
    toStep.classList.remove('hidden');
}

function createBurst(symbols) {
    for (let i = 0; i < 20; i++) {
        const item = document.createElement('div');
        item.className = 'burst-item';
        item.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        item.style.left = '50vw';
        item.style.top = '50vh';
        item.style.fontSize = `${Math.random() * 20 + 20}px`;

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 180 + 50;
        const dx = `${Math.cos(angle) * dist}px`;
        const dy = `${Math.sin(angle) * dist}px`;

        item.style.setProperty('--dx', dx);
        item.style.setProperty('--dy', dy);

        document.body.appendChild(item);
        setTimeout(() => item.remove(), 1200);
    }
      }
          
