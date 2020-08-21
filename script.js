function gobabygo() {
    /* 
        TODO: dont try this at home, very hardcore
        this part stops the reload, for debugging purposes
    */
   /*
    for (let i = 1; i < 9999; i++) {
        window.clearTimeout(i);
    }
    */

    /* 
        load image to canvas for analysis 
        inspired by: https://stackoverflow.com/a/8751659
    */
    let scrumbled = document.getElementById("img36");   // original
    let unscrumbled = document.createElement('canvas');
    unscrumbled.width = scrumbled.width;
    unscrumbled.height = scrumbled.height;
    let unscrumbledCtx = unscrumbled.getContext("2d");
    unscrumbledCtx.drawImage(scrumbled, 0, 0, unscrumbled.width, unscrumbled.height);

    let totalLines = unscrumbled.height;
    let totalPixels = unscrumbled.width;

    /* iterate through all lines */
    for (let currentLine = 0; currentLine < totalLines; currentLine++) {
        let tmp = [];
        let tmpPos = 0;
	
        /* iterate through all pixels each line */
        for (let currentPixel = 0; currentPixel < totalPixels; currentPixel++) {
            tmp.push(unscrumbledCtx.getImageData(currentPixel, currentLine, 1, 1).data);

            /* we're searching for #282828 or rgb(40,40,40) */
            if (tmp[currentPixel][0] === 40 && tmp[currentPixel][1] === 40 && tmp[currentPixel][2] === 40 && tmp[currentPixel][3] === 255) {
                //console.log("grey line found at position:", currentPixel);
                tmpPos = currentPixel;
            }
        }

        /* sort the extracted pixels */
        tmp = (tmp.slice(tmpPos)).concat(tmp.slice(0, tmpPos));

        /* 
            readjust the pixels in the line 
            inspired by: https://stackoverflow.com/a/4900656
        */
        for (let currentPixel = 0; currentPixel < totalPixels; currentPixel++) {
            let pixel = unscrumbledCtx.createImageData(1, 1);
            let data  = pixel.data;
            data[0] = tmp[currentPixel][0]; // red
            data[1] = tmp[currentPixel][1]; // green
            data[2] = tmp[currentPixel][2]; // blue
            data[3] = tmp[currentPixel][3]; // opacity
            unscrumbledCtx.putImageData( pixel, currentPixel, currentLine );   
        }
    }

    // replace original with edited canvas
    scrumbled.src = unscrumbled.toDataURL();
}
