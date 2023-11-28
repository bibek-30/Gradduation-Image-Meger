<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 3600");
header("Content-Type: application/json");
function createImageInstantly($img1, $img2, $newImg, $i_height, $i_width, $height, $width, $logo_left, $logo_top, $text_values, $geek_values)
{
    $x = $y = 1000;
    $targetFolder = '/gw/media/uploads/processed/';
    $targetPath = $_SERVER['DOCUMENT_ROOT'] . $targetFolder;
    
    $outputImage = imagecreatetruecolor($x, $y);
    $white = imagecolorallocate($outputImage, 255, 255, 255);
    imagefill($outputImage, 0, 0, $white);
    $first = imagecreatefrompng($img1);
    $second = imagecreatefrompng($img2);
    if (!$first || !$second) {
        die('Error loading one or more images.');
    }
    imagecopyresampled($outputImage, $first, 0, 0, 0, 0, $x, $y, $x, $y);
    imagecopyresampled($outputImage, $second, 0, 0, 0, 0, $x, $y, $x, $y);
    if ($newImg != null) {
        $third = imagecreatefrompng($newImg);
        if (!$third) {
            die('Error loading the third image.');
        }
        imagecopyresampled($outputImage, $third, $logo_left, $logo_top, 0, 0, $width, $height, $i_width, $i_height);
    }
    if ($text_values !== null) {
        // Loop through the array
        foreach ($text_values as $text_item) {
            $text = $text_item["text"];
            // $font = $text_item["font"];
            $size = $text_item["size"];
            $direction = $text_item["direction"];
            // $direction = "horizontal";
            $top = $text_item["top"];
            $left = $text_item["left"];
            stackText($outputImage, $text, $size, $direction, $top, $left);
        }
    }

    if ($geek_values !== null) {
        foreach ($geek_values as $geek_value) {
            $geektext = $geek_value['text'];
            $left = $geek_value['left'];
            $top = $geek_value['top'];
    
            // Call your function inside the loop
            stackGeekText($outputImage, $geektext, $left, $top);
        }
    }
    


    $filename = $targetPath . round(microtime(true)) . '.png';
    // Check if the directory exists
    if (!file_exists($targetPath)) {
        mkdir($targetPath, 0777, true);
    }
    imagepng($outputImage, $filename);
    imagedestroy($outputImage);
    // Return the URL of the stacked image
    return $filename;
}


function stackGeekText($outputImage, $geektext, $left, $top)
{
    global $font;
    $text_content = $geektext;
    $textColor = imagecolorallocate($outputImage, 0, 0, 0);
    $text_length = mb_strlen($text_content);

    $charHeight = 60; // Adjust the height between characters as needed

    for ($i = 0; $i < $text_length; $i++) {
        $char = mb_substr($text_content, $i, 1);
        
        $angle = 0;
        $x = $left;
        $y = $top + ($i * $charHeight);

        imagettftext($outputImage, 30, $angle, $x, $y+25, $textColor, $font, $char);
    }
}


// function stackText($outputImage, $text, $size, $direction, $top, $left)
// {
//     global $font;
//     $text_content = $text;
    
//     if (!isset($size)) {
//         die('Font size not defined.');
//     }
    
//     if (!file_exists($font)) {
//         die('Font file does not exist.');
//     }

//     $textColor = imagecolorallocate($outputImage, 0, 0, 0);

//     $text_length = mb_strlen($text_content);

//     for ($i = 0; $i < $text_length; $i++) {
//         $char = mb_substr($text_content, $i, 1);
        
//         $angle = ($direction === 'vertical') ?  0 : 0;
//         $x = ($direction === 'vertical') ? $left : $left + ($i * $size);
//         if ($size < 18){
//             $y = ($direction === 'vertical') ? $top + ($i * 40) : $top;
//         }else {
//             $y = ($direction === 'vertical') ? $top + ($i * 50) : $top;
//         }

//         imagettftext($outputImage, $size, $angle, $x, $y, $textColor, $font, $char);
//     }
// }


function stackText($outputImage, $text, $size, $direction, $top, $left, $fontWeight = 'bold')
{
    global $font;
    $text_content = $text;

    if (!isset($size)) {
        die('Font size not defined.');
    }

    if (!file_exists($font)) {
        die('Font file does not exist.');
    }

    $textColor = imagecolorallocate($outputImage, 0, 0, 0);

    $text_length = mb_strlen($text_content);

    for ($i = 0; $i < $text_length; $i++) {
        $char = mb_substr($text_content, $i, 1);

        $angle = ($direction === 'vertical') ?  0 : 0;

        // Draw the text with normal weight
        $x = ($direction === 'vertical') ? $left : $left + ($i * $size);
        $y = ($direction === 'vertical') ? $top + ($i * 50) : $top;
        imagettftext($outputImage, $size, $angle, $x, $y, $textColor, $font, $char);

        // If the font weight is set to 'bold', draw the text again with a slight offset
        if ($fontWeight === 'bold') {
            $x = ($direction === 'vertical') ? $left + 1 : $left + ($i * $size) + 1;
            $y = ($direction === 'vertical') ? $top + ($i * 50) + 1 : $top + 1;
            imagettftext($outputImage, $size, $angle, $x, $y, $textColor, $font, $char);
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $img1 = $_POST['file1'];
    $img2 = $_POST['file2'];
    $i_height = $_POST['i_height'];
    $i_width = $_POST['i_width'];
    $width = $_POST['width'];
    $height = $_POST['height'];
    $logo_left = $_POST['logo-left'];
    $logo_top = $_POST['logo-top'];
    $text_values_json = $_POST["text_values"];
    $text_values = json_decode($text_values_json, true);
    $geek_values_json = $_POST["geek_values"];
    $geek_values = json_decode($geek_values_json, true);

    $uploadDirectory = 'uploads/';
    $font = __DIR__ . '/arial.ttf';
    // Check if the 'file3' key is set in the $_FILES array
    if (isset($_FILES['file3'])) {
        // Perform file upload
        if (!file_exists($uploadDirectory)) {
            mkdir($uploadDirectory, 0777, true);
        }
        $targetFile = $uploadDirectory . uniqid() . '_' . basename($_FILES['file3']['name']);
        if (move_uploaded_file($_FILES['file3']['tmp_name'], $targetFile)) {
            $newImg = "file:///C:/xampp/htdocs/myproject/graduation-world/" . $targetFile;
            // Assuming $img1 and $img2 are defined somewhere
            $stackedImageUrl = createImageInstantly($img1, $img2, $newImg, $i_height, $i_width, $height, $width, $logo_left, $logo_top, $text_values,$geek_values);
            echo $stackedImageUrl;
        } else {
            echo 'Error uploading file.';
            // Handle the error if needed
        }
    } else {
        // Handle the case where 'file3' is not set
        // For example, perform an alternative action or do nothing
        $stackedImageUrl = createImageInstantly($img1, $img2, null, null, null, null, null, null, null, $text_values, $geek_values);
        echo $stackedImageUrl;
    }
}