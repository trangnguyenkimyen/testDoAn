<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="testcss.css">
    
    <style>
        
    </style>
</head>

<body>
    <?php
        require_once("config.php");

        if(isset($_GET["action"])) {
            $action = $_GET["action"];
            $id = $_GET["id"];
            $sql = "select * from song where id = $id";
            $result = mysqli_query($conn, $sql); 
            if (mysqli_num_rows($result) == 0 )                 
                $sql = "select * from song where id = 1";
        } else $sql = "select * from song where id = 1";

        $result = mysqli_query($conn, $sql);          
        if (mysqli_num_rows($result) > 0) {   
            $row = mysqli_fetch_assoc($result); 
        
    ?>
            <h1 id="nameSong" style="margin-bottom: 0;"><?php echo $row["name"]; ?></h1>
            <h2 id="nameArtist" style="margin: 10px 0 20px 0;font-weight: lighter; font-size: 17px;">- <?php echo $row["artist"]; ?> -</h2>

            <div id="cover">
                <img class="anime" src="img/<?php echo $row["img"]; ?>" alt="<?php echo $row["img"]; ?>">
            </div>

            <div id="content-audio">

                <audio autoplay="<?php if(isset($_GET["action"])) echo true; else echo false; ?>" preload="metadata" src="mp3/<?php echo $row["mp3"]; ?>"></audio>

                <div class="below-img">
                    <span id="current-time">00:00</span>
                    <input type="range" min=0 max=100 value=0 step="1" id="progress">
                    <span id="duration">00:00</span>
                </div>

                <div class="music-button">

                    <!-- shuffle button -->
                    <a href="?action=shuffle&id=<?php echo $row["id"]; ?>">
                        <svg id="shuffle" title="shuffle" xmlns="http://www.w3.org/2000/svg" width="48" height="48"
                            viewBox="0 0 24 24" style="fill: 'currentColor';transform: ;msFilter:;">
                            <path
                                d="M17 17h-1.559l-9.7-10.673A1 1 0 0 0 5.001 6H2v2h2.559l4.09 4.5-4.09 4.501H2v2h3.001a1 1 0 0 0 .74-.327L10 13.987l4.259 4.686a1 1 0 0 0 .74.327H17v3l5-4-5-4v3z">
                            </path>
                            <path d="M15.441 8H17v3l5-3.938L17 3v3h-2.001a1 1 0 0 0-.74.327l-3.368 3.707 1.48 1.346L15.441 8z">
                            </path>
                        </svg>
                    </a>
                    

                    <!-- rewind button -->
                    <a href="?action=prev&id=<?php echo $row["id"] - 1; ?>">
                        <svg id="prev" title="prev" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                            style="fill: 'currentColor';transform: ;msFilter:;">
                            <path d="m16 7-7 5 7 5zm-7 5V7H7v10h2z"></path>
                        </svg>
                    </a>
                    

                    <!-- play button -->
                    <svg id="play" title="play" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                        style="fill: 'currentColor';transform: ;msFilter:;">
                        <path d="M7 6v12l10-6z"></path>
                    </svg>

                    <!-- pause icon -->
                    <svg id="pause" class="hidden" title="pause" xmlns="http://www.w3.org/2000/svg" width="48" height="48"
                        viewBox="0 0 24 24">
                        <path d="M8 7h3v10H8zm5 0h3v10h-3z" />
                    </svg>

                    <!-- next button -->
                    <a href="?action=next&id=<?php echo $row["id"] + 1; ?>">
                        <svg id="next" title="next" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                            style="fill: 'currentColor';transform: ;msFilter:;">
                            <path d="M7 7v10l7-5zm9 10V7h-2v10z"></path>
                        </svg>
                    </a>
                    
                    <!-- replay button -->
                    <svg id="replay" title="replay" xmlns="http://www.w3.org/2000/svg" width="48" height="48"
                        viewBox="0 0 24 24" style="fill: 'currentColor';transform: ;msFilter:;">
                        <path
                            d="M19.89 10.105a8.696 8.696 0 0 0-.789-1.456l-1.658 1.119a6.606 6.606 0 0 1 .987 2.345 6.659 6.659 0 0 1 0 2.648 6.495 6.495 0 0 1-.384 1.231 6.404 6.404 0 0 1-.603 1.112 6.654 6.654 0 0 1-1.776 1.775 6.606 6.606 0 0 1-2.343.987 6.734 6.734 0 0 1-2.646 0 6.55 6.55 0 0 1-3.317-1.788 6.605 6.605 0 0 1-1.408-2.088 6.613 6.613 0 0 1-.382-1.23 6.627 6.627 0 0 1 .382-3.877A6.551 6.551 0 0 1 7.36 8.797 6.628 6.628 0 0 1 9.446 7.39c.395-.167.81-.296 1.23-.382.107-.022.216-.032.324-.049V10l5-4-5-4v2.938a8.805 8.805 0 0 0-.725.111 8.512 8.512 0 0 0-3.063 1.29A8.566 8.566 0 0 0 4.11 16.77a8.535 8.535 0 0 0 1.835 2.724 8.614 8.614 0 0 0 2.721 1.833 8.55 8.55 0 0 0 5.061.499 8.576 8.576 0 0 0 6.162-5.056c.22-.52.389-1.061.5-1.608a8.643 8.643 0 0 0 0-3.45 8.684 8.684 0 0 0-.499-1.607z">
                        </path>
                    </svg>

                    <!-- Volume -->
                    <div class="volume-container" style="position: absolute; right: 0;">
                        <!-- volume-mute button -->
                        <svg id="volume-mute" title="volume-mute" xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                            viewBox="0 0 24 24" style="fill: 'currentColor';transform: ;msFilter:;">
                            <path
                                d="m7.727 6.313-4.02-4.02-1.414 1.414 18 18 1.414-1.414-2.02-2.02A9.578 9.578 0 0 0 21.999 12c0-4.091-2.472-7.453-5.999-9v2c2.387 1.386 3.999 4.047 3.999 7a8.13 8.13 0 0 1-1.671 4.914l-1.286-1.286C17.644 14.536 18 13.19 18 12c0-1.771-.775-3.9-2-5v7.586l-2-2V2.132L7.727 6.313zM4 17h2.697L14 21.868v-3.747L3.102 7.223A1.995 1.995 0 0 0 2 9v6c0 1.103.897 2 2 2z">
                            </path>
                        </svg>

                        <input type="range" min=1 max=100 value=99 id="volume">

                        <!-- volume-full button -->
                        <svg id="volume-full" title="volume-full" xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                            viewBox="0 0 24 24" style="fill: 'currentColor';transform: ;msFilter:;">
                            <path
                                d="M16 21c3.527-1.547 5.999-4.909 5.999-9S19.527 4.547 16 3v2c2.387 1.386 3.999 4.047 3.999 7S18.387 17.614 16 19v2z">
                            </path>
                            <path
                                d="M16 7v10c1.225-1.1 2-3.229 2-5s-.775-3.9-2-5zM4 17h2.697L14 21.868V2.132L6.697 7H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2z">
                            </path>
                        </svg>

                    </div>

                </div> <!-- end of .music-button -->

            </div> <!--end of #content-audio -->
            
    <?php } ?>

    <?php mysqli_close($conn);?>

</body>

<script> 
    const audio = document.querySelector("audio");
    const image = document.querySelector("img");
    const nameSong = document.querySelector("#nameSong").textContent;
    const nameArtist = document.querySelector("#nameArtist").textContent;

    const play = document.querySelector("#play");
    const pause = document.querySelector("#pause");

    const volume = document.querySelector("#volume");
    const progress = document.querySelector("#progress");
    const current_time = document.querySelector("#current-time");
    const duration = document.querySelector("#duration");

    let isPlaying = false;

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
    
</script>

</html>