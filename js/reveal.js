// Photo reveal (birthday trick, hold ×): the performer's own photo with a blank sheet of paper,
// the spectator's birthday text is laid onto the sheet in perspective (4 corners marked in the settings)
// and the picture gets the original photo's camera details with a "date taken" N hours ago.
// Used by settings.html (photo, corners, text, hours) and index.html (thumbnail to long-press → Add to Photos).
//
// Storage: the photo (upright JPEG bytes) in IndexedDB "reveal"/"photo"/"main", together with the original EXIF (TIFF bytes);
// localStorage "revealPhoto" {width, height, corners: [[x, y] × 4] in 0..1, fontScale, opacity, font: "unbounded" | "times"},
// "revealTemplate", "revealHours".

const reveal = (_ => {
    const maxPixels = 12500000;       // iPhone canvas limit is ~16.7 MP; 48 MP photos are scaled down
    const ink = [24, 24, 26];
    const fonts = {
        unbounded: '"RevealUnbounded", "Unbounded", sans-serif',
        times: '"Times New Roman", Times, Georgia, serif'
    };

    // the calculator page has no Unbounded: load it from the cached file before drawing (canvas needs a loaded font)
    let fontReady = null;
    function loadFonts() {
        if (!fontReady) {
            let face = new FontFace("RevealUnbounded", "url(" + new URL("fonts/unbounded-semibold.woff2", document.baseURI) + ")", { weight: "600" });
            fontReady = face.load().then(loaded => document.fonts.add(loaded)).catch(_ => { });
        }
        return fontReady;
    }

    // size × fontScale, ink opacity, font; older saved photos have no opacity and font yet
    function getStyle(meta) {
        meta = meta || {};
        return {
            fontScale: meta.fontScale || 1,
            opacity: meta.opacity >= 0.1 && meta.opacity <= 1 ? meta.opacity : 0.9,
            font: fonts[meta.font] ? meta.font : "unbounded"
        };
    }

    // ---------- storage ----------

    function openDB() {
        return new Promise((resolve, reject) => {
            let request = indexedDB.open("reveal", 1);
            request.onupgradeneeded = _ => request.result.createObjectStore("photo");
            request.onsuccess = _ => resolve(request.result);
            request.onerror = _ => reject(request.error);
        });
    }

    function dbRun(mode, action) {
        return openDB().then(db => new Promise((resolve, reject) => {
            let tx = db.transaction("photo", mode);
            let request = action(tx.objectStore("photo"));
            tx.oncomplete = _ => resolve(request.result);
            tx.onerror = _ => reject(tx.error);
        }));
    }

    function readJSON(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? fallback;
        } catch (e) {
            return fallback;
        }
    }

    function writeJSON(key, value) {
        try {
            value === null ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(value));
        } catch (e) { }
    }

    function getMeta() {
        return readJSON("revealPhoto", null);
    }

    function setMeta(meta) {
        writeJSON("revealPhoto", meta);
        cache = null;
    }

    function hasPhoto() {
        let meta = getMeta();
        return !!(meta && meta.corners);
    }

    function getHours() {
        let hours = Number(localStorage.getItem("revealHours"));
        return hours >= 1 && hours <= 48 ? hours : 20;
    }

    function getTemplate() {
        let template = localStorage.getItem("revealTemplate");
        return template === null ? i18next.t("revealTemplateDefault") : template;
    }

    // stored as bytes, not as a Blob: some WebKit builds cannot put a Blob into IndexedDB
    function loadPhoto() {
        return dbRun("readonly", store => store.get("main")).then(stored => stored && {
            blob: new Blob([stored.bytes], { type: "image/jpeg" }), exif: stored.exif
        });
    }

    // the photo is stored upright (the browser applies the EXIF rotation while decoding) and at most 12.5 MP
    function savePhoto(file) {
        return file.arrayBuffer().then(buffer => {
            let exif = findExif(new Uint8Array(buffer));
            return decode(file).then(image => {
                let scale = Math.min(1, Math.sqrt(maxPixels / (image.width * image.height)));
                let canvas = document.createElement("canvas");
                canvas.width = Math.round(image.width * scale);
                canvas.height = Math.round(image.height * scale);
                canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
                return toBlob(canvas, 0.95).then(blob => blob.arrayBuffer()).then(bytes => dbRun("readwrite", store => store.put({ bytes, exif }, "main")).then(_ => {
                    let old = getMeta();
                    setMeta({
                        width: canvas.width, height: canvas.height, fontScale: old ? old.fontScale : 1,
                        opacity: old ? old.opacity : 0.9, font: old ? old.font : "unbounded",
                        corners: [[0.2, 0.25], [0.8, 0.25], [0.8, 0.75], [0.2, 0.75]]
                    });
                }));
            });
        });
    }

    function removePhoto() {
        setMeta(null);
        return dbRun("readwrite", store => store.delete("main"));
    }

    function decode(blob) {
        return new Promise((resolve, reject) => {
            let image = new Image();
            let url = URL.createObjectURL(blob);
            image.onload = _ => {
                URL.revokeObjectURL(url);
                resolve(image);
            };
            image.onerror = _ => {
                URL.revokeObjectURL(url);
                reject(new Error("decode"));
            };
            image.src = url;
        });
    }

    function toBlob(canvas, quality) {
        return new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
    }

    // ---------- text: template → lines that fill the sheet ----------

    function plural(n, forms) {
        let a = n % 100, b = n % 10;
        return forms[a > 10 && a < 20 ? 2 : b === 1 ? 0 : b >= 2 && b <= 4 ? 1 : 2];
    }

    // date = [day, month, year]; same numbers as the grey-line peek (getBirthdayInfo in magicios26.js)
    function birthdayValues(date) {
        let [day, month, year] = date;
        const starts = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
        let sign = i18next.t("zodiac", { returnObjects: true })[(day >= starts[month - 1] ? month : month - 1) % 12];
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let next = new Date(today.getFullYear(), month - 1, day);
        if (next < today) {
            next = new Date(today.getFullYear() + 1, month - 1, day);
        }
        let days = Math.round((next - today) / 86400000);
        let age = today.getFullYear() - year - (new Date(today.getFullYear(), month - 1, day) > today ? 1 : 0);
        let isRu = i18next.language.startsWith("ru");
        let p = n => String(n).padStart(2, "0");
        return {
            sign,
            day: i18next.t("weekdayOn", { returnObjects: true })[new Date(year, month - 1, day).getDay()],
            date: p(day) + "." + p(month) + "." + year,
            days: days + " " + (isRu ? plural(days, ["день", "дня", "дней"]) : days === 1 ? "day" : "days"),
            age: String(age)
        };
    }

    // both Russian and English tags work whatever the language
    const tags = { "знак": "sign", "день": "day", "дата": "date", "дней": "days", "возраст": "age" };

    function fillTemplate(template, date) {
        let values = birthdayValues(date);
        return template.replace(/\{([^}]+)\}/g, (all, tag) => {
            tag = tag.trim().toLowerCase();
            let key = tags[tag] || tag;
            return values[key] !== undefined ? values[key] : all;
        });
    }

    function wrapLines(g, text, width) {
        let lines = [];
        text.split("\n").forEach(paragraph => {
            let line = "";
            paragraph.split(/\s+/).filter(Boolean).forEach(word => {
                let test = line ? line + " " + word : word;
                if (line && g.measureText(test).width > width) {
                    lines.push(line);
                    line = word;
                } else {
                    line = test;
                }
            });
            lines.push(line);
        });
        return lines;
    }

    // black printed text, centred on a sheet of width × height; the size is the largest that fits, times fontScale
    function textCanvas(text, width, height, fontScale, fontFamily) {
        let canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(width));
        canvas.height = Math.max(1, Math.round(height));
        let g = canvas.getContext("2d");
        let boxW = canvas.width * 0.84, boxH = canvas.height * 0.84;
        let fit = size => {
            g.font = size + "px " + fontFamily;
            let lines = wrapLines(g, text, boxW);
            return { lines, isFit: lines.length * size * 1.3 <= boxH && lines.every(l => g.measureText(l).width <= boxW) };
        };
        let low = 4, high = Math.max(8, canvas.height);
        while (high - low > 1) {
            let mid = (low + high) / 2;
            fit(mid).isFit ? low = mid : high = mid;
        }
        let size = low * fontScale;
        let { lines } = fit(size);
        g.fillStyle = "#000";
        g.textAlign = "center";
        g.textBaseline = "middle";
        let top = canvas.height / 2 - (lines.length - 1) * size * 1.3 / 2;
        lines.forEach((line, i) => g.fillText(line, canvas.width / 2, top + i * size * 1.3));
        return canvas;
    }

    // ---------- perspective ----------

    // corners in any order → top-left, top-right, bottom-right, bottom-left (clockwise from the one nearest the top-left)
    function orderCorners(points) {
        let cx = points.reduce((s, p) => s + p[0], 0) / 4;
        let cy = points.reduce((s, p) => s + p[1], 0) / 4;
        let sorted = points.slice().sort((a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx));
        let first = sorted.reduce((best, p, i) => p[0] + p[1] < sorted[best][0] + sorted[best][1] ? i : best, 0);
        return sorted.slice(first).concat(sorted.slice(0, first));
    }

    // homography that maps the 4 points "from" onto the 4 points "to"
    function homography(from, to) {
        let a = [], b = [];
        for (let i = 0; i < 4; i++) {
            let [x, y] = from[i], [u, v] = to[i];
            a.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
            b.push(u);
            a.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
            b.push(v);
        }
        for (let c = 0; c < 8; c++) {
            let pivot = c;
            for (let r = c + 1; r < 8; r++) {
                if (Math.abs(a[r][c]) > Math.abs(a[pivot][c])) {
                    pivot = r;
                }
            }
            [a[c], a[pivot]] = [a[pivot], a[c]];
            [b[c], b[pivot]] = [b[pivot], b[c]];
            for (let r = 0; r < 8; r++) {
                if (r !== c && a[c][c] !== 0) {
                    let f = a[r][c] / a[c][c];
                    for (let k = c; k < 8; k++) {
                        a[r][k] -= f * a[c][k];
                    }
                    b[r] -= f * b[c];
                }
            }
        }
        let h = b.map((value, i) => value / a[i][i]);
        h.push(1);
        return h;
    }

    // draws the sheet text onto g in perspective; corners in pixels of g's canvas
    function drawOnSheet(g, text, corners, style) {
        style = getStyle(style);
        let [tl, tr, br, bl] = corners;
        let dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
        let width = (dist(tl, tr) + dist(bl, br)) / 2;
        let height = (dist(tl, bl) + dist(tr, br)) / 2;
        // the text is drawn at most ~1.5× the sheet's size on screen and sampled from there
        let k = Math.min(1.5, 2400 / Math.max(width, height));
        let source = textCanvas(text, width * k, height * k, style.fontScale, fonts[style.font]);
        let opacity = style.opacity;
        let sw = source.width, sh = source.height;
        let alpha = source.getContext("2d").getImageData(0, 0, sw, sh).data;
        let h = homography(corners, [[0, 0], [sw, 0], [sw, sh], [0, sh]]);
        let x0 = Math.max(0, Math.floor(Math.min(tl[0], tr[0], br[0], bl[0])));
        let y0 = Math.max(0, Math.floor(Math.min(tl[1], tr[1], br[1], bl[1])));
        let x1 = Math.min(g.canvas.width, Math.ceil(Math.max(tl[0], tr[0], br[0], bl[0])));
        let y1 = Math.min(g.canvas.height, Math.ceil(Math.max(tl[1], tr[1], br[1], bl[1])));
        if (x1 <= x0 || y1 <= y0) {
            return;
        }
        let out = g.createImageData(x1 - x0, y1 - y0);
        let data = out.data;
        let i = 0;
        for (let y = y0; y < y1; y++) {
            let py = y + 0.5;
            for (let x = x0; x < x1; x++, i += 4) {
                let px = x + 0.5;
                let w = h[6] * px + h[7] * py + 1;
                let u = (h[0] * px + h[1] * py + h[2]) / w - 0.5;
                let v = (h[3] * px + h[4] * py + h[5]) / w - 0.5;
                if (u < 0 || v < 0 || u >= sw - 1 || v >= sh - 1) {
                    continue;
                }
                // bilinear sample of the text's alpha
                let ux = u | 0, vy = v | 0, fx = u - ux, fy = v - vy;
                let s = (vy * sw + ux) * 4 + 3;
                let a = (alpha[s] * (1 - fx) + alpha[s + 4] * fx) * (1 - fy)
                    + (alpha[s + sw * 4] * (1 - fx) + alpha[s + sw * 4 + 4] * fx) * fy;
                if (a > 0) {
                    data[i] = ink[0];
                    data[i + 1] = ink[1];
                    data[i + 2] = ink[2];
                    data[i + 3] = a * opacity;
                }
            }
        }
        let layer = document.createElement("canvas");
        layer.width = out.width;
        layer.height = out.height;
        layer.getContext("2d").putImageData(out, 0, 0);
        g.drawImage(layer, x0, y0);
    }

    function cornersInPixels(meta, width, height) {
        return orderCorners(meta.corners).map(([x, y]) => [x * width, y * height]);
    }

    // ---------- EXIF ----------

    // TIFF bytes of the "Exif" APP1 segment of a JPEG, or null
    function findExif(bytes) {
        if (bytes[0] !== 0xFF || bytes[1] !== 0xD8) {
            return null;
        }
        let at = 2;
        while (at + 4 < bytes.length && bytes[at] === 0xFF) {
            let marker = bytes[at + 1];
            let length = bytes[at + 2] << 8 | bytes[at + 3];
            if (marker === 0xDA) {
                break;
            }
            if (marker === 0xE1 && String.fromCharCode(...bytes.slice(at + 4, at + 8)) === "Exif") {
                return bytes.slice(at + 10, at + 2 + length);
            }
            at += 2 + length;
        }
        return null;
    }

    const typeSize = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8 };

    function readIFD(view, offset, le) {
        let entries = [];
        if (!offset || offset + 2 > view.byteLength) {
            return entries;
        }
        let count = view.getUint16(offset, le);
        for (let n = 0; n < count; n++) {
            let at = offset + 2 + n * 12;
            if (at + 12 > view.byteLength) {
                break;
            }
            let tag = view.getUint16(at, le), type = view.getUint16(at + 2, le), number = view.getUint32(at + 4, le);
            let size = (typeSize[type] || 0) * number;
            if (!typeSize[type]) {
                continue;
            }
            let start = size <= 4 ? at + 8 : view.getUint32(at + 8, le);
            if (start + size > view.byteLength) {
                continue;
            }
            entries.push({ tag, type, count: number, data: new Uint8Array(view.buffer, view.byteOffset + start, size).slice() });
        }
        return entries;
    }

    // the original camera details with new dates, upright orientation, new size, no thumbnail and no maker note
    function buildExif(tiff, date, width, height) {
        let le = true, ifd0 = [], exifIFD = [], gps = [];
        if (tiff && tiff.length > 8) {
            let view = new DataView(tiff.buffer, tiff.byteOffset, tiff.byteLength);
            le = view.getUint16(0) === 0x4949;
            let first = view.getUint32(4, le);
            ifd0 = readIFD(view, first, le);
            let pointer = tag => {
                let e = ifd0.find(e => e.tag === tag);
                return e ? new DataView(e.data.buffer).getUint32(0, le) : 0;
            };
            exifIFD = readIFD(view, pointer(0x8769), le);
            gps = readIFD(view, pointer(0x8825), le);
        }
        let ascii = text => Uint8Array.from((text + "\0").split("").map(c => c.charCodeAt(0)));
        let long = value => {
            let data = new Uint8Array(4);
            new DataView(data.buffer).setUint32(0, value, le);
            return data;
        };
        let short = value => {
            let data = new Uint8Array(2);
            new DataView(data.buffer).setUint16(0, value, le);
            return data;
        };
        let p = n => String(n).padStart(2, "0");
        let stamp = date.getFullYear() + ":" + p(date.getMonth() + 1) + ":" + p(date.getDate()) + " "
            + p(date.getHours()) + ":" + p(date.getMinutes()) + ":" + p(date.getSeconds());
        let shift = -date.getTimezoneOffset();
        let zone = (shift < 0 ? "-" : "+") + p(Math.floor(Math.abs(shift) / 60)) + ":" + p(Math.abs(shift) % 60);
        let set = (list, tag, type, data) => {
            list = list.filter(e => e.tag !== tag);
            list.push({ tag, type, count: type === 2 ? data.length : data.length / typeSize[type], data });
            return list;
        };
        ifd0 = ifd0.filter(e => ![0x8769, 0x8825, 0x0201, 0x0202].includes(e.tag));
        ifd0 = set(ifd0, 0x0112, 3, short(1));
        ifd0 = set(ifd0, 0x0132, 2, ascii(stamp));
        exifIFD = exifIFD.filter(e => ![0x927C, 0xA005].includes(e.tag));
        exifIFD = set(exifIFD, 0x9003, 2, ascii(stamp));
        exifIFD = set(exifIFD, 0x9004, 2, ascii(stamp));
        exifIFD = set(exifIFD, 0x9010, 2, ascii(zone));
        exifIFD = set(exifIFD, 0x9011, 2, ascii(zone));
        exifIFD = set(exifIFD, 0x9012, 2, ascii(zone));
        exifIFD = set(exifIFD, 0xA002, 4, long(width));
        exifIFD = set(exifIFD, 0xA003, 4, long(height));
        // GPS date stamp would give the real day away: drop it, keep the place
        gps = gps.filter(e => ![0x0007, 0x001D].includes(e.tag));
        ifd0.push({ tag: 0x8769, type: 4, count: 1, data: long(0) });
        if (gps.length) {
            ifd0.push({ tag: 0x8825, type: 4, count: 1, data: long(0) });
        }
        let blocks = [ifd0, exifIFD].concat(gps.length ? [gps] : []);
        blocks.forEach(list => list.sort((a, b) => a.tag - b.tag));
        let blockSize = list => 2 + list.length * 12 + 4 + list.reduce((s, e) => s + (e.data.length > 4 ? e.data.length + e.data.length % 2 : 0), 0);
        let offsets = [8];
        blocks.forEach((list, i) => offsets.push(offsets[i] + blockSize(list)));
        ifd0.find(e => e.tag === 0x8769).data = long(offsets[1]);
        if (gps.length) {
            ifd0.find(e => e.tag === 0x8825).data = long(offsets[2]);
        }
        let total = offsets[blocks.length];
        let out = new Uint8Array(total);
        let view = new DataView(out.buffer);
        view.setUint16(0, le ? 0x4949 : 0x4D4D);
        view.setUint16(2, 42, le);
        view.setUint32(4, 8, le);
        blocks.forEach((list, b) => {
            let at = offsets[b];
            let dataAt = at + 2 + list.length * 12 + 4;
            view.setUint16(at, list.length, le);
            list.forEach((e, n) => {
                let entry = at + 2 + n * 12;
                view.setUint16(entry, e.tag, le);
                view.setUint16(entry + 2, e.type, le);
                view.setUint32(entry + 4, e.count, le);
                if (e.data.length <= 4) {
                    out.set(e.data, entry + 8);
                } else {
                    view.setUint32(entry + 8, dataAt, le);
                    out.set(e.data, dataAt);
                    dataAt += e.data.length + e.data.length % 2;
                }
            });
            view.setUint32(at + 2 + list.length * 12, 0, le);
        });
        return out;
    }

    function withExif(jpeg, tiff) {
        let length = tiff.length + 8;
        let head = new Uint8Array([0xFF, 0xE1, length >> 8, length & 0xFF, 0x45, 0x78, 0x69, 0x66, 0, 0]);
        // drop the canvas JFIF segment so the Exif segment comes right after SOI
        let rest = 2;
        if (jpeg[2] === 0xFF && jpeg[3] === 0xE0) {
            rest = 4 + (jpeg[4] << 8 | jpeg[5]);
        }
        return new Blob([jpeg.slice(0, 2), head, tiff, jpeg.slice(rest)], { type: "image/jpeg" });
    }

    // "now − N hours" with random minutes and seconds, so it is never a round time and never in the future
    function takenDate(hours) {
        let date = new Date(Date.now() - hours * 3600000);
        date.setMinutes(Math.floor(Math.random() * 60), Math.floor(Math.random() * 60), 0);
        return date;
    }

    // ---------- the final picture ----------

    let cache = null;

    // birthday date [day, month, year] → JPEG Blob; the same date is rendered once
    function render(date) {
        let key = date.join(".") + "|" + getTemplate() + "|" + getHours() + "|" + localStorage.getItem("revealPhoto");
        if (cache && cache.key === key) {
            return cache.promise;
        }
        let meta = getMeta();
        let promise = Promise.all([loadPhoto(), loadFonts()]).then(([stored]) => {
            if (!stored || !meta) {
                throw new Error("no photo");
            }
            return decode(stored.blob).then(image => {
                let canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                let g = canvas.getContext("2d");
                g.drawImage(image, 0, 0);
                drawOnSheet(g, fillTemplate(getTemplate(), date), cornersInPixels(meta, canvas.width, canvas.height), meta);
                return toBlob(canvas, 0.93).then(blob => blob.arrayBuffer()).then(buffer =>
                    withExif(new Uint8Array(buffer), buildExif(stored.exif, takenDate(getHours()), canvas.width, canvas.height)));
            });
        });
        promise.catch(_ => cache = null);
        cache = { key, promise };
        return promise;
    }

    return {
        hasPhoto, getMeta, setMeta, getStyle, loadFonts, getHours, getTemplate, loadPhoto, savePhoto, removePhoto, decode,
        fillTemplate, orderCorners, drawOnSheet, cornersInPixels, render
    };
})();
