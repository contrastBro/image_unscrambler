function gobabygo() {
    /* 
        TODO: dont try this at home, very hardcore
        this part stops the reload, for debugging purposes/to compensate inefficient processing
    */
    for (let i = 1; i < 9999; i++) {
        window.clearTimeout(i);
    }
	
    let scrambled = document.getElementById("img36");   // original
    let unscrambled = document.createElement('canvas');
    unscrambled.width = scrambled.width;
    unscrambled.height = scrambled.height;
    let unscrambledCtx = unscrambled.getContext("2d");
    unscrambledCtx.drawImage(scrambled, 0, 0, unscrambled.width, unscrambled.height);

    let totalLines = unscrambled.height;
    let totalPixels = unscrambled.width;

    /* iterate through all lines */
    for (let currentLine = 0; currentLine < totalLines; currentLine++) {
        let tmp = [];
        let tmpPos = 0;
    
        /* iterate through all pixels each line */
        for (let currentPixel = 0; currentPixel < totalPixels; currentPixel++) {
            tmp.push(unscrambledCtx.getImageData(currentPixel, currentLine, 1, 1).data);

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
            let pixel = unscrambledCtx.createImageData(1, 1);
            let data  = pixel.data;
            data[0] = tmp[currentPixel][0]; // red
            data[1] = tmp[currentPixel][1]; // green
            data[2] = tmp[currentPixel][2]; // blue
            data[3] = tmp[currentPixel][3]; // opacity
            unscrambledCtx.putImageData( pixel, currentPixel, currentLine );   
        }
    }

    /* replace original with edited canvas */
    scrambled.src = unscrambled.toDataURL();
    
    /* 
        do the ocr magic, insert result and submit automatically
        
        ocr processing provided by: https://ocr.space/
        get your API key: https://ocr.space/OCRAPI and set it as request header "apikey".
    */
    unscrambled.toBlob(function(blob) {
        let xhr = new XMLHttpRequest();
        
        let formData = new FormData();
        formData.append("file", blob, "img.png");

        let xhr_data = [
            { key: "url", value: "" },
            //{ key: "file", value1: "", value2: "" },
            { key: "language", value: "eng" },
            { key: "isOverlayRequired", value: "true" },
            { key: "FileType", value: ".Auto" },
            { key: "IsCreateSearchablePDF", value: "false" },
            { key: "isSearchablePdfHideTextLayer", value: "true" },
            { key: "detectOrientation", value: "false" },
            { key: "isTable", value: "false" },
            { key: "scale", value: "true" },
            { key: "OCREngine", value: "1" },
            { key: "detectCheckbox", value: "false" },
            { key: "checkboxTemplate", value: "0" }
        ];
        xhr_data.forEach(data => {
            formData.append(data.key, data.value);
        });
    
        xhr.open('POST', 'https://api8.ocr.space/parse/image', true);
        xhr.setRequestHeader("apikey", "HERE GOES YOUR API KEY");   // <- API KEY HERE
        
        xhr.onload = function () {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                
                document.getElementById("pw").value = response.ParsedResults[0].TextOverlay.Lines[0].LineText;

                document.querySelectorAll('input[type=button]').forEach(inputElement => {
                    if (inputElement.value === "OK")
                    {
                        inputElement.click();
                        return;
                    }
                });
            }
        };
    
        xhr.send(formData);
    });    
}
