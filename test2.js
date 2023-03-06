const idSong = document.querySelector("#idSong");
const audio = document.querySelector("audio");
const image = document.querySelector("img");
const nameSong = document.querySelector("#nameSong");
const nameArtist = document.querySelector("#nameArtist");

const play = document.querySelector("#play");
const pause = document.querySelector("#pause");
const prev = document.querySelector("#prev");

const volume = document.querySelector("#volume");
const progress = document.querySelector("#progress");
const current_time = document.querySelector("#current-time");
const duration = document.querySelector("#duration");

let isPlaying = false;

// Load bài hát khi vừa mở form
$(function () {
    $(document).ready(function () {
        audio.src = "mp3/";
        image.src = "img/";
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
            audio.src = "mp3/";
            image.src = "img/";
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
            audio.src = "mp3/";
            image.src = "img/";
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

// Cập nhật thời gian hiện tại của audio
const updateCurrentTime = function () {
    if (audio.duration != NaN) {
        setInterval(() => {
            let percentProgress = 0;
            // Đổi thời gian hiện tại của audio sang % và gán cho progress
            percentProgress = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = percentProgress;

            let currentMinutes = Math.floor(audio.currentTime / 60);
            let currentSeconds = Math.floor(audio.currentTime % 60);

            if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes };
            if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds };

            current_time.textContent = currentMinutes + ":" + currentSeconds;
        }, 1000);
    }
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

    updateCurrentTime();
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

// Khi thay đổi progress
progress.onchange = function () {
    audio.currentTime = audio.duration * (progress.value / 100);
    audio.play();
};

// Khi thay đổi volume
volume.onchange = function () {
    audio.volume = volume.value / 100;
};

// Khi click nút replay
replay.onclick = function () {
    audio.currentTime = 0;
    audio.play();
};
