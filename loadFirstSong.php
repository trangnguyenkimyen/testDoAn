<?php
    require_once ("config.php");
    $sql = "select * from song limit 1";
    $result = mysqli_query($conn, $sql);
    if(mysqli_num_rows($result) > 0)
    $row = mysqli_fetch_assoc($result);
    // Chuyển đối kết quả thành mảng trong file json
    echo (json_encode($row));    
    mysqli_close($conn);
?>