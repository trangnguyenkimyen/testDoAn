const idSong = document.querySelector("#idSong");
const audio = document.querySelector("audio");
const image = document.querySelector("img");
const nameSong = document.querySelector("#nameSong");
const nameArtist = document.querySelector("#nameArtist");

const play = document.querySelector("#play");
const pause = document.querySelector("#pause");
const prev = document.querySelector("#prev");
const replay = document.querySelector("#replay");

const volume = document.querySelector("#volume");
// const progress = document.querySelector("#progress");
const current_time = document.querySelector("#current-time");
const duration = document.querySelector("#duration");
// New
const progressBar = document.querySelector(".progressBar");
const progressHandle = document.querySelector(".progressHandle");
const progressBarWrapper = document.querySelector(".progressBarWrapper");

let isPlaying = false;
let isReplay = false;
// New
let isDragging = false; // Biến xác định xem có đang di chuyển không
let isInProgressBar = false; // Biến xác định xem có đang trong thanh progress không
let initialX = 0; // Vị trí ban đầu của sự kiện mouse click/tap
let fakeTime = 0;
let intervalUpdateTime;

// Load bài hát khi vừa mở form
$(function () {
    $(document).ready(function () {
        audio.src = "./mp3/";
        image.src = "./img/";
        $.ajax({
            url: "loadFirstSong.php",
            dataType: "json",
            success: function (response) {
                audio.src += response['mp3'];
                image.src += response['img'];
                nameSong.textContent = response['name'];
                nameArtist.textContent = response['artist'];
                idSong.textContent = response['id'];
            }
        });
    });
});

// Chuyển sang bài hát trc đó khi ấn nút prev
$(function () {
    $(document).ready(function () {
        $(prev).click(function () {
            audio.src = "./mp3/";
            image.src = "./img/";
            $.ajax({
                type: "POST",
                url: "loadprevSong.php",
                data: { "idSong": idSong.textContent },
                dataType: "json",
                success: function (response) {
                    audio.src += response['mp3'];
                    image.src += response['img'];
                    nameSong.textContent = response['name'];
                    nameArtist.textContent = response['artist'];
                    idSong.textContent = response['id'];
                }
            });
        });
    });
});

// Chuyển sang bài hát sau đó khi ấn nút next
$(function () {
    $(document).ready(function () {
        $(next).click(function () {
            audio.src = "./mp3/";
            image.src = "./img/";
            $.ajax({
                type: "POST",
                url: "loadnextSong.php",
                data: { "idSong": idSong.textContent },
                dataType: "json",
                success: function (response) {
                    audio.src += response['mp3'];
                    image.src += response['img'];
                    nameSong.textContent = response['name'];
                    nameArtist.textContent = response['artist'];
                    idSong.textContent = response['id'];
                }
            });
        });
    });
});

// Khi kết thúc bài hiện tại
audio.addEventListener('ended', function () {
    // Nếu nút replay không được bật thì play bài kế tiếp
    if (!isReplay) {
        $(document).ready(function () {
            audio.src = "./mp3/";
            image.src = "./img/";
            $.ajax({
                type: "POST",
                url: "loadnextSong.php",
                data: { "idSong": idSong.textContent },
                dataType: "json",
                success: function (response) {
                    audio.src += response['mp3'];
                    image.src += response['img'];
                    nameSong.textContent = response['name'];
                    nameArtist.textContent = response['artist'];
                    idSong.textContent = response['id'];
                }
            });
        });
    }
    else {
        replayPresentSong();
    }
});

// Xoay hình ảnh
const imageAnimate = image.animate([
    { transform: "rotate(360deg)" }
], {
    duration: 8000, // 8s
    iterations: Infinity
});
imageAnimate.pause();

// Hiển thị tổng thời lượng của một audio
const displayDuration = function () {
    let durationMinutes = Math.floor(audio.duration / 60);
    let durationSeconds = Math.floor(audio.duration % 60);

    if (durationMinutes < 10) durationMinutes = "0" + durationMinutes;
    if (durationSeconds < 10) durationSeconds = "0" + durationSeconds;

    duration.textContent = durationMinutes + ":" + durationSeconds;
};

// Update text content của id currentTime
const updateCurTimeBy = function (time) {
    let currentMinutes = Math.floor(time / 60);
    let currentSeconds = Math.floor(time % 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds };

    currentTime.textContent = currentMinutes + ":" + currentSeconds;
}

const updateTime = function () {
    // Update currentTime của audio
    updateCurTimeBy(audio.currentTime);

    // Update width của progressBar và left của progressHandle
    let progressPercent = audio.currentTime / audio.duration * 100;
    progressBar.style.width = progressPercent + "%";
    progressHandle.style.left = progressPercent + "%";
};

// Replay bài hát hiện tại
const replayPresentSong = function () {
    audio.currentTime = 0;
    audio.play();
};

// Cập nhật current time của audio khi click thanh progress
const clickProgressBar = function (e) {
    // e.preventDefault();
    let totalWidth = progressBarWrapper.offsetWidth;
    let offsetX = e.offsetX;
    let percent = offsetX / totalWidth * 100;

    // update thanh progress
    progressBar.style.width = percent + "%";
    progressHandle.style.left = percent + "%";

    // update currentTime của audio
    let currentTime = percent / 100 * audio.duration;

    updateCurTimeBy(currentTime);
    audio.currentTime = currentTime;
}

// Khi mousedown thanh progress
const mousedownProgressBar = function (e) {
    clearInterval(intervalUpdateTime);
    isDragging = true;
    // lưu lại vị trí ban đầu của sự kiện mouse click/tap khi bắt đầu di chuyển.
    initialX = e.clientX - e.offsetX;
    // console.log(initialX);        
};

// Khi mouseover thanh progress
const mousemoveProgressBar = function (e) {
    if (isDragging) {
        // Dừng cập nhật thanh progress và contentText của currentTime
        clearInterval(intervalUpdateTime);

        // Chặn hành vi mặc định của chuột khi sd tính năng "drag và drop"
        e.preventDefault();

        // tính toán giá trị mới của offsetX khi di chuyển
        let offsetX = e.clientX - initialX;
        let totalWidth = progressBarWrapper.offsetWidth;
        let percent = offsetX / totalWidth * 100;

        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;

        // update thanh progress
        progressBar.style.width = percent + '%';
        progressHandle.style.left = percent + '%';

        // update fakeTime và text content của id currentTime theo fakeTime   
        fakeTime = percent / 100 * audio.duration;
        updateCurTimeBy(fakeTime);
    }
};

// Sự kiện ghi lại vị trí con trỏ trên thanh progress khi sử dụng mobile
const touchmoveProgressBar = function (e) {
    if (isDragging) {
        clearInterval(intervalUpdateTime);
        // Chặn hành vi mặc định của chuột khi sd tính năng "drag và drop"
        e.preventDefault();
        // tính toán giá trị mới của offsetX khi di chuyển
        let offsetX = e.touches[0].pageX - progressBarWrapper.offsetLeft;
        let totalWidth = progressBarWrapper.offsetWidth;
        let percent = offsetX / totalWidth * 100;

        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;

        // update thanh progress
        progressBar.style.width = percent + '%';
        progressHandle.style.left = percent + '%';

        // update fakeTime và text content của id currentTime theo fakeTime   
        fakeTime = percent / 100 * audio.duration;
        updateCurTimeBy(fakeTime);
    }
};

// Khi mouseup thanh progress
const mouseupProgressBar = function (e) {
    isDragging = false;

    audio.currentTime = fakeTime;

    intervalUpdateTime = setInterval(updateTime, 500);
};

// Khi audio đã chạy
audio.onplay = function () {
    isPlaying = true;
    imageAnimate.play();

    // Ẩn nút pause                      
    pause.classList.add("display-button");
    pause.classList.remove("hidden");
    // Hiện nút play
    play.classList.add("hidden");
    play.classList.remove("display-button");

    intervalUpdateTime = setInterval(updateTime, 500);
};

// Khi audio đã tắt
audio.onpause = function () {
    isPlaying = false;
    imageAnimate.pause();

    // Hiện nút play                      
    play.classList.add("display-button");
    play.classList.remove("hidden");
    // Ẩn nút pause
    pause.classList.add("hidden");
    pause.classList.remove("display-button");

    clearInterval(intervalUpdateTime);
};

// Khi audio đã load xong duration
audio.onloadedmetadata = function () {
    displayDuration();
};

// Khi click nút play
play.onclick = function () {
    audio.play();
};

// Khi click nút pause
pause.onclick = function () {
    audio.pause();
};

// Khi thay đổi volume
volume.onchange = function () {
    audio.volume = volume.value / 100;
};

// Khi click nút replay
replay.onclick = function () {
    if (!isReplay) {
        isReplay = true;
        replay.style.fill = "lightpink";
    }
    else {
        isReplay = false;
        replay.style.fill = "white";
    }
};


progressBarWrapper.addEventListener("click", clickProgressBar);

progressBarWrapper.addEventListener("mousedown", mousedownProgressBar);
progressBarWrapper.addEventListener("touchstart", mousedownProgressBar);

progressBarWrapper.addEventListener("mousemove", mousemoveProgressBar);
progressBarWrapper.addEventListener("touchmove", touchmoveProgressBar);

progressBarWrapper.addEventListener("mouseup", mouseupProgressBar);
progressBarWrapper.addEventListener("touchend", mouseupProgressBar);
