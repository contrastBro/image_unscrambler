# image_unscrambler
0xf.at level 36 solution

working solution for this hackit level:
https://www.0xf.at/play/36

hackit level generation source:
https://github.com/HaschekSolutions/0xf.at/blob/master/data/levels/hackit36.php

consumes https://ocr.space/OCRAPI OCR API

## known issues
- execution is rather slow **.getImageData(..)**, so make sure to block the global timer with setTimeout() ... or PR
