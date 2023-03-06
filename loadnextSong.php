<?php
    if(isset($_POST["idSong"])) {
        $idSong = $_POST["idSong"];    
        require_once ("config.php");

        $id = $idSong + 1;
        $sql = "select * from song where id = $id";
        $result = mysqli_query($conn, $sql);
        // Nếu kq = 0 thì phát bài đầu tiên
        if (mysqli_num_rows($result) == 0)
        {
            $sql = "select * from song limit 1";
            $result = mysqli_query($conn, $sql);
        }
            
        $row = mysqli_fetch_assoc($result);
        echo json_encode($row);       
        mysqli_close($conn);        
    }
?>