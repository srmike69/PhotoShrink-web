/* =========================================================
   REFERENCIAS DEL DOM
   ========================================================= */

const photoInput =
    document.getElementById("photoInput");

const emptyState =
    document.getElementById("emptyState");

const workspace =
    document.getElementById("workspace");

const photoGrid =
    document.getElementById("photoGrid");

const originalSizeElement =
    document.getElementById("originalSize");

const compressedSizeElement =
    document.getElementById("compressedSize");

const savingElement =
    document.getElementById("saving");

const photoCountElement =
    document.getElementById("photoCount");

const selectionText =
    document.getElementById("selectionText");

const changeSelection =
    document.getElementById("changeSelection");

const clearSelection =
    document.getElementById("clearSelection");

const bottomChangeSelection =
    document.getElementById("bottomChangeSelection");

const compressButton =
    document.getElementById("compressButton");

const progressSection =
    document.getElementById("progressSection");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const resultSection =
    document.getElementById("resultSection");

const resultText =
    document.getElementById("resultText");

const saveButton =
    document.getElementById("saveButton");

const targetContainer =
    document.getElementById("targetContainer");

const targetSize =
    document.getElementById("targetSize");

const targetOptions =
    document.querySelectorAll(
        ".target-option"
    );

const customTargetContainer =
    document.getElementById(
        "customTargetContainer"
    );

const targetDescription =
    document.getElementById(
        "targetDescription"
    );

const qualityCards =
    document.querySelectorAll(
        ".quality-card"
    );

const preserveMetadata =
    document.getElementById(
        "preserveMetadata"
    );

const preserveFormat =
    document.getElementById(
        "preserveFormat"
    );


/* =========================================================
   VARIABLES
   ========================================================= */

let selectedFiles = [];

let compressedFiles = [];

let selectedTargetMB = 1;


/* =========================================================
   SELECCIÓN DE FOTOS
   ========================================================= */

photoInput.addEventListener(
    "change",
    event => {

        const files =
            Array.from(
                event.target.files || []
            );


        if (
            files.length === 0
        ) {

            return;

        }


        selectedFiles =
            files;


        compressedFiles =
            [];


        resultSection.classList.add(
            "hidden"
        );


        progressSection.classList.add(
            "hidden"
        );


        progressBar.style.width =
            "0%";


        progressText.textContent =
            `0 / ${selectedFiles.length}`;


        renderSelectedPhotos();

        updateSummary();


        emptyState.classList.add(
            "hidden"
        );


        workspace.classList.remove(
            "hidden"
        );

    }
);


/* =========================================================
   MOSTRAR FOTOS
   ========================================================= */

function renderSelectedPhotos() {

    photoGrid.innerHTML =
        "";


    selectedFiles.forEach(
        (file, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "photo-item";


            const image =
                document.createElement(
                    "img"
                );


            image.alt =
                `Foto ${index + 1}`;


            image.loading =
                index < 20
                    ? "eager"
                    : "lazy";


            const objectURL =
                URL.createObjectURL(
                    file
                );


            image.src =
                objectURL;


            image.addEventListener(
                "load",
                () => {

                    URL.revokeObjectURL(
                        objectURL
                    );

                },
                {
                    once: true
                }
            );


            const number =
                document.createElement(
                    "span"
                );


            number.className =
                "photo-number";


            number.textContent =
                index + 1;


            item.appendChild(
                image
            );


            item.appendChild(
                number
            );


            photoGrid.appendChild(
                item
            );

        }
    );


    const count =
        selectedFiles.length;


    photoCountElement.textContent =
        `${count} ${
            count === 1
                ? "foto"
                : "fotos"
        }`;


    selectionText.textContent =
        `${count} ${
            count === 1
                ? "foto seleccionada"
                : "fotos seleccionadas"
        }`;

}


/* =========================================================
   RESUMEN
   ========================================================= */

function updateSummary() {

    const totalBytes =
        selectedFiles.reduce(
            (
                total,
                file
            ) =>
                total +
                file.size,
            0
        );


    originalSizeElement.textContent =
        formatMB(
            totalBytes
        );


    compressedSizeElement.textContent =
        "0 MB";


    savingElement.textContent =
        "Ahorro: 0 %";

}


/* =========================================================
   CAMBIAR SELECCIÓN
   ========================================================= */

if (
    changeSelection
) {

    changeSelection.addEventListener(
        "click",
        () => {

            photoInput.click();

        }
    );

}


if (
    bottomChangeSelection
) {

    bottomChangeSelection.addEventListener(
        "click",
        () => {

            photoInput.click();

        }
    );

}


/* =========================================================
   QUITAR SELECCIÓN
   ========================================================= */

if (
    clearSelection
) {

    clearSelection.addEventListener(
        "click",
        () => {

            resetPhotoShrink();

        }
    );

}


/* =========================================================
   CONFIGURACIÓN INICIAL
   ========================================================= */

function initializeQualitySelection() {

    const balancedInput =
        document.querySelector(
            'input[name="quality"][value="balanced"]'
        );


    if (
        !balancedInput
    ) {

        return;

    }


    balancedInput.checked =
        true;


    qualityCards.forEach(
        card => {

            const input =
                card.querySelector(
                    "input"
                );


            if (
                input ===
                balancedInput
            ) {

                card.classList.add(
                    "selected"
                );

            } else {

                card.classList.remove(
                    "selected"
                );

            }

        }
    );


    if (
        targetContainer
    ) {

        targetContainer.classList.add(
            "hidden"
        );

    }


    updateTargetDescription();

}


/* =========================================================
   OPCIONES DE COMPRESIÓN
   ========================================================= */

qualityCards.forEach(
    card => {

        const input =
            card.querySelector(
                "input"
            );


        if (
            !input
        ) {

            return;

        }


        input.addEventListener(
            "change",
            () => {

                if (
                    !input.checked
                ) {

                    return;

                }


                qualityCards.forEach(
                    otherCard => {

                        otherCard.classList.remove(
                            "selected"
                        );

                    }
                );


                card.classList.add(
                    "selected"
                );


                if (
                    input.value ===
                    "target"
                ) {

                    targetContainer.classList.remove(
                        "hidden"
                    );


                    updateTargetDescription();

                } else {

                    targetContainer.classList.add(
                        "hidden"
                    );

                }

            }
        );

    }
);


/* =========================================================
   TAMAÑO OBJETIVO
   ========================================================= */

targetOptions.forEach(
    option => {

        option.addEventListener(
            "click",
            () => {

                targetOptions.forEach(
                    otherOption => {

                        otherOption.classList.remove(
                            "active"
                        );

                    }
                );


                option.classList.add(
                    "active"
                );


                const size =
                    option.dataset.size;


                if (
                    size ===
                    "custom"
                ) {

                    customTargetContainer.classList.remove(
                        "hidden"
                    );


                    targetSize.focus();


                    selectedTargetMB =
                        Number(
                            targetSize.value
                        ) || 1;

                } else {

                    customTargetContainer.classList.add(
                        "hidden"
                    );


                    selectedTargetMB =
                        Number(
                            size
                        );

                }


                updateTargetDescription();

            }
        );

    }
);


/* =========================================================
   TAMAÑO PERSONALIZADO
   ========================================================= */

if (
    targetSize
) {

    targetSize.addEventListener(
        "input",
        () => {

            const value =
                Number(
                    targetSize.value
                );


            if (
                Number.isFinite(
                    value
                ) &&
                value > 0
            ) {

                selectedTargetMB =
                    value;

            }


            updateTargetDescription();

        }
    );

}


/* =========================================================
   TEXTO TAMAÑO
   ========================================================= */

function updateTargetDescription() {

    if (
        !targetDescription
    ) {

        return;

    }


    const value =
        Number(
            selectedTargetMB
        );


    if (
        !Number.isFinite(
            value
        ) ||
        value <= 0
    ) {

        targetDescription.textContent =
            "Introduce un tamaño válido para cada foto.";

        return;

    }


    targetDescription.textContent =
        `Cada foto intentará mantenerse por debajo de ${formatTargetMB(value)}.`;

}


function formatTargetMB(
    value
) {

    if (
        Number.isInteger(
            value
        )
    ) {

        return `${value} MB`;

    }


    return `${value
        .toFixed(2)
        .replace(/0+$/, "")
        .replace(/\.$/, "")
    } MB`;

}


/* =========================================================
   BOTÓN COMPRIMIR
   ========================================================= */

compressButton.addEventListener(
    "click",
    async () => {

        if (
            selectedFiles.length === 0
        ) {

            return;

        }


        compressButton.disabled =
            true;


        resultSection.classList.add(
            "hidden"
        );


        progressSection.classList.remove(
            "hidden"
        );


        progressBar.style.width =
            "0%";


        progressText.textContent =
            `0 / ${selectedFiles.length}`;


        compressedFiles =
            [];


        const selectedQualityInput =
            document.querySelector(
                'input[name="quality"]:checked'
            );


        const selectedQuality =
            selectedQualityInput
                ? selectedQualityInput.value
                : "balanced";


        let targetBytes =
            null;


        if (
            selectedQuality ===
            "target"
        ) {

            if (
                !Number.isFinite(
                    selectedTargetMB
                ) ||
                selectedTargetMB <= 0
            ) {

                alert(
                    "Introduce un tamaño objetivo válido."
                );


                compressButton.disabled =
                    false;


                progressSection.classList.add(
                    "hidden"
                );


                return;

            }


            targetBytes =
                selectedTargetMB *
                1024 *
                1024;

        }


        const total =
            selectedFiles.length;


        for (
            let index = 0;
            index < total;
            index++
        ) {

            const file =
                selectedFiles[index];


            try {

                const compressed =
                    await compressImage(
                        file,
                        selectedQuality,
                        targetBytes
                    );


                compressedFiles.push(
                    compressed
                );

            } catch (
                error
            ) {

                console.error(
                    "Error comprimiendo:",
                    file.name,
                    error
                );


                compressedFiles.push(
                    file
                );

            }


            const progress =
                (
                    (index + 1) /
                    total
                ) *
                100;


            progressBar.style.width =
                `${progress}%`;


            progressText.textContent =
                `${index + 1} / ${total}`;


            await nextFrame();

        }


        showCompressionResult();


        compressButton.disabled =
            false;

    }
);


/* =========================================================
   COMPRESIÓN PRINCIPAL
   ========================================================= */

async function compressImage(
    file,
    qualityMode,
    targetBytes
) {

    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        return file;

    }


    const originalType =
        getImageMimeType(
            file
        );


    const canKeepFormat =
        preserveFormat &&
        preserveFormat.checked &&
        (
            originalType ===
                "image/jpeg" ||
            originalType ===
                "image/png" ||
            originalType ===
                "image/webp"
        );


    if (
        preserveFormat &&
        preserveFormat.checked &&
        isHeicFile(
            file
        )
    ) {

        return file;

    }


    if (
        preserveFormat &&
        preserveFormat.checked &&
        !canKeepFormat
    ) {

        return file;

    }


    const image =
        await loadImage(
            file
        );


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        image.naturalWidth;


    canvas.height =
        image.naturalHeight;


    const context =
        canvas.getContext(
            "2d",
            {
                alpha:
                    originalType !==
                    "image/jpeg"
            }
        );


    if (
        originalType ===
        "image/jpeg"
    ) {

        context.fillStyle =
            "#ffffff";


        context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    }


    context.drawImage(
        image,
        0,
        0
    );


    const originalExif =
        preserveMetadata &&
        preserveMetadata.checked &&
        originalType ===
            "image/jpeg"
            ? await extractExifSegment(
                file
            )
            : null;


    const outputType =
        canKeepFormat
            ? originalType
            : "image/jpeg";


    if (
        qualityMode ===
        "target"
    ) {

        return compressToTarget(
            canvas,
            file,
            targetBytes,
            originalExif,
            outputType
        );

    }


    if (
        qualityMode ===
        "minus1mb"
    ) {

        const targetMinusOneMB =
            Math.max(
                100 *
                1024,
                file.size -
                (
                    1024 *
                    1024
                )
            );


        return compressToTarget(
            canvas,
            file,
            targetMinusOneMB,
            originalExif,
            outputType
        );

    }


    const quality =
        getQuality(
            qualityMode
        );


    let blob =
        await canvasToBlob(
            canvas,
            quality,
            outputType
        );


    if (
        blob.size >=
        file.size
    ) {

        return file;

    }


    if (
        preserveMetadata &&
        preserveMetadata.checked &&
        outputType ===
            "image/jpeg"
    ) {

        blob =
            await insertExifIntoJpeg(
                blob,
                originalExif
            );

    }


    return createCompressedFile(
        blob,
        file,
        outputType
    );

}


/* =========================================================
   DETECTAR HEIC / HEIF
   ========================================================= */

function isHeicFile(
    file
) {

    const type =
        (
            file.type ||
            ""
        ).toLowerCase();


    if (
        type ===
            "image/heic" ||
        type ===
            "image/heif"
    ) {

        return true;

    }


    return /\.(heic|heif)$/i.test(
        file.name
    );

}


/* =========================================================
   DETECTAR FORMATO
   ========================================================= */

function getImageMimeType(
    file
) {

    const type =
        (
            file.type ||
            ""
        ).toLowerCase();


    if (
        type ===
        "image/jpg"
    ) {

        return "image/jpeg";

    }


    if (
        type
    ) {

        return type;

    }


    if (
        /\.jpe?g$/i.test(
            file.name
        )
    ) {

        return "image/jpeg";

    }


    if (
        /\.png$/i.test(
            file.name
        )
    ) {

        return "image/png";

    }


    if (
        /\.webp$/i.test(
            file.name
        )
    ) {

        return "image/webp";

    }


    if (
        /\.(heic|heif)$/i.test(
            file.name
        )
    ) {

        return "image/heic";

    }


    return "image/jpeg";

}


/* =========================================================
   CALIDAD
   ========================================================= */

function getQuality(
    qualityMode
) {

    switch (
        qualityMode
    ) {

        case "maximum":

            return 0.92;


        case "balanced":

            return 0.80;


        default:

            return 0.80;

    }

}


/* =========================================================
   COMPRESIÓN A TAMAÑO
   ========================================================= */

async function compressToTarget(
    canvas,
    originalFile,
    targetBytes,
    originalExif,
    outputType
) {

    if (
        originalFile.size <=
        targetBytes
    ) {

        return originalFile;

    }


    if (
        outputType ===
        "image/png"
    ) {

        const pngBlob =
            await canvasToBlob(
                canvas,
                undefined,
                outputType
            );


        if (
            pngBlob.size >=
            originalFile.size
        ) {

            return originalFile;

        }


        if (
            pngBlob.size >
            targetBytes
        ) {

            return originalFile;

        }


        return createCompressedFile(
            pngBlob,
            originalFile,
            outputType
        );

    }


    let minimumQuality =
        0.10;


    let maximumQuality =
        1.00;


    let bestBlob =
        null;


    for (
        let attempt = 0;
        attempt < 12;
        attempt++
    ) {

        const quality =
            (
                minimumQuality +
                maximumQuality
            ) /
            2;


        const blob =
            await canvasToBlob(
                canvas,
                quality,
                outputType
            );


        if (
            blob.size <=
            targetBytes
        ) {

            bestBlob =
                blob;


            minimumQuality =
                quality;

        } else {

            maximumQuality =
                quality;

        }

    }


    if (
        !bestBlob
    ) {

        bestBlob =
            await canvasToBlob(
                canvas,
                0.10,
                outputType
            );

    }


    if (
        bestBlob.size >=
        originalFile.size
    ) {

        return originalFile;

    }


    if (
        preserveMetadata &&
        preserveMetadata.checked &&
        outputType ===
            "image/jpeg"
    ) {

        bestBlob =
            await insertExifIntoJpeg(
                bestBlob,
                originalExif
            );

    }


    if (
        bestBlob.size >=
        originalFile.size
    ) {

        return originalFile;

    }


    return createCompressedFile(
        bestBlob,
        originalFile,
        outputType
    );

}


/* =========================================================
   CANVAS → BLOB
   ========================================================= */

function canvasToBlob(
    canvas,
    quality,
    type
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            canvas.toBlob(
                blob => {

                    if (
                        blob
                    ) {

                        resolve(
                            blob
                        );

                    } else {

                        reject(
                            new Error(
                                "No se pudo generar la imagen."
                            )
                        );

                    }

                },
                type,
                quality
            );

        }
    );

}


/* =========================================================
   EXTRAER EXIF JPEG
   ========================================================= */

async function extractExifSegment(
    file
) {

    if (
        file.type !==
            "image/jpeg" &&
        file.type !==
            "image/jpg" &&
        !/\.jpe?g$/i.test(
            file.name
        )
    ) {

        return null;

    }


    try {

        const buffer =
            await file.arrayBuffer();


        const bytes =
            new Uint8Array(
                buffer
            );


        if (
            bytes[0] !==
                0xFF ||
            bytes[1] !==
                0xD8
        ) {

            return null;

        }


        let offset =
            2;


        while (
            offset + 4 <
            bytes.length
        ) {

            if (
                bytes[offset] !==
                0xFF
            ) {

                offset++;

                continue;

            }


            const marker =
                bytes[
                    offset + 1
                ];


            if (
                marker ===
                0xD9
            ) {

                break;

            }


            if (
                marker ===
                    0xD8 ||
                marker ===
                    0x01
            ) {

                offset +=
                    2;

                continue;

            }


            const length =
                (
                    bytes[
                        offset + 2
                    ] << 8
                ) |
                bytes[
                    offset + 3
                ];


            if (
                length < 2 ||
                offset +
                    2 +
                    length >
                    bytes.length
            ) {

                break;

            }


            if (
                marker ===
                0xE1
            ) {

                const exifStart =
                    offset + 4;


                const exifEnd =
                    offset +
                    2 +
                    length;


                if (
                    exifEnd >
                    exifStart + 6
                ) {

                    const header =
                        new TextDecoder(
                            "ascii"
                        ).decode(
                            bytes.slice(
                                exifStart,
                                exifStart + 6
                            )
                        );


                    if (
                        header ===
                        "Exif\u0000\u0000"
                    ) {

                        return bytes.slice(
                            offset,
                            exifEnd
                        );

                    }

                }

            }


            offset +=
                2 +
                length;

        }

    } catch (
        error
    ) {

        console.warn(
            "No se pudieron leer los EXIF:",
            error
        );

    }


    return null;

}


/* =========================================================
   INSERTAR EXIF EN JPEG
   ========================================================= */

async function insertExifIntoJpeg(
    blob,
    exifSegment
) {

    if (
        !exifSegment
    ) {

        return blob;

    }


    try {

        const newBuffer =
            await blob.arrayBuffer();


        const jpeg =
            new Uint8Array(
                newBuffer
            );


        if (
            jpeg[0] !==
                0xFF ||
            jpeg[1] !==
                0xD8
        ) {

            return blob;

        }


        const output =
            new Uint8Array(
                jpeg.length +
                exifSegment.length
            );


        output[0] =
            jpeg[0];


        output[1] =
            jpeg[1];


        output.set(
            exifSegment,
            2
        );


        output.set(
            jpeg.slice(2),
            2 +
            exifSegment.length
        );


        return new Blob(
            [
                output
            ],
            {
                type:
                    "image/jpeg"
            }
        );

    } catch (
        error
    ) {

        console.warn(
            "No se pudieron conservar los EXIF:",
            error
        );


        return blob;

    }

}


/* =========================================================
   CREAR ARCHIVO COMPRIMIDO
   ========================================================= */

function createCompressedFile(
    blob,
    originalFile,
    outputType
) {

    const extension =
        getExtensionForType(
            outputType
        );


    const baseName =
        originalFile.name.replace(
            /\.[^/.]+$/,
            ""
        );


    const newName =
        `${baseName}-compressed.${extension}`;


    return new File(
        [
            blob
        ],
        newName,
        {
            type:
                outputType,

            lastModified:
                originalFile.lastModified
        }
    );

}


/* =========================================================
   EXTENSIÓN
   ========================================================= */

function getExtensionForType(
    type
) {

    switch (
        type
    ) {

        case "image/png":

            return "png";


        case "image/webp":

            return "webp";


        case "image/jpeg":

        default:

            return "jpg";

    }

}


/* =========================================================
   CARGAR IMAGEN
   ========================================================= */

function loadImage(
    file
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const image =
                new Image();


            const objectURL =
                URL.createObjectURL(
                    file
                );


            image.onload =
                () => {

                    URL.revokeObjectURL(
                        objectURL
                    );


                    resolve(
                        image
                    );

                };


            image.onerror =
                () => {

                    URL.revokeObjectURL(
                        objectURL
                    );


                    reject(
                        new Error(
                            "No se pudo cargar la imagen."
                        )
                    );

                };


            image.src =
                objectURL;

        }
    );

}


/* =========================================================
   RESULTADO
   ========================================================= */

function showCompressionResult() {

    const originalBytes =
        selectedFiles.reduce(
            (
                total,
                file
            ) =>
                total +
                file.size,
            0
        );


    const compressedBytes =
        compressedFiles.reduce(
            (
                total,
                file
            ) =>
                total +
                file.size,
            0
        );


    const savedBytes =
        Math.max(
            0,
            originalBytes -
            compressedBytes
        );


    const savingPercentage =
        originalBytes > 0
            ? Math.round(
                (
                    savedBytes /
                    originalBytes
                ) *
                100
            )
            : 0;


    compressedSizeElement.textContent =
        formatMB(
            compressedBytes
        );


    savingElement.textContent =
        `Ahorro: ${savingPercentage} %`;


    resultText.textContent =
        `${formatMB(savedBytes)} ahorrados · ${compressedFiles.length} fotos listas.`;


    resultSection.classList.remove(
        "hidden"
    );

}


/* =========================================================
   GUARDAR
   ========================================================= */

saveButton.addEventListener(
    "click",
    async () => {

        if (
            compressedFiles.length ===
            0
        ) {

            return;

        }


        if (
            navigator.share &&
            navigator.canShare
        ) {

            try {

                if (
                    navigator.canShare({
                        files:
                            compressedFiles
                    })
                ) {

                    await navigator.share({

                        files:
                            compressedFiles,

                        title:
                            "PhotoShrink",

                        text:
                            "Fotos comprimidas"

                    });


                    resetPhotoShrink();


                    return;

                }

            } catch (
                error
            ) {

                if (
                    error.name ===
                    "AbortError"
                ) {

                    return;

                }


                console.error(
                    "Error al guardar las fotos:",
                    error
                );


                return;

            }

        }


        try {

            for (
                const file of
                compressedFiles
            ) {

                downloadFile(
                    file
                );


                await sleep(
                    100
                );

            }


            resetPhotoShrink();

        } catch (
            error
        ) {

            console.error(
                "Error al guardar las fotos:",
                error
            );

        }

    }
);


/* =========================================================
   REINICIAR PHOTOSHRINK
   ========================================================= */

function resetPhotoShrink() {

    selectedFiles =
        [];


    compressedFiles =
        [];


    photoGrid.innerHTML =
        "";


    originalSizeElement.textContent =
        "0 MB";


    compressedSizeElement.textContent =
        "0 MB";


    savingElement.textContent =
        "Ahorro: 0 %";


    photoCountElement.textContent =
        "0 fotos";


    selectionText.textContent =
        "0 fotos seleccionadas";


    progressSection.classList.add(
        "hidden"
    );


    resultSection.classList.add(
        "hidden"
    );


    progressBar.style.width =
        "0%";


    progressText.textContent =
        "0 / 0";


    workspace.classList.add(
        "hidden"
    );


    emptyState.classList.remove(
        "hidden"
    );


    photoInput.value =
        "";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   DESCARGA
   ========================================================= */

function downloadFile(
    file
) {

    const url =
        URL.createObjectURL(
            file
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        file.name;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );

}


/* =========================================================
   FORMATO MB
   ========================================================= */

function formatMB(
    bytes
) {

    if (
        bytes <= 0
    ) {

        return "0 MB";

    }


    const megabytes =
        bytes /
        (
            1024 *
            1024
        );


    if (
        megabytes <
        0.01
    ) {

        return "<0.01 MB";

    }


    return `${megabytes.toFixed(2)} MB`;

}


/* =========================================================
   UTILIDADES
   ========================================================= */

function sleep(
    milliseconds
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}


function nextFrame() {

    return new Promise(
        resolve => {

            requestAnimationFrame(
                () =>
                    resolve()
            );

        }
    );

}


/* =========================================================
   SERVICE WORKER
   ========================================================= */

if (
    "serviceWorker" in
    navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "./service-worker.js"
                )
                .catch(
                    error => {

                        console.error(
                            "No se pudo registrar el Service Worker:",
                            error
                        );

                    }
                );

        }
    );

}


/* =========================================================
   INICIO
   ========================================================= */

initializeQualitySelection();



/* =========================================================
   EASTER EGG
   ========================================================= */

(function initializeEasterEgg() {

    const brandIcon =
        document.querySelector(".brand-icon");

    if (!brandIcon) {
        return;
    }

    let taps = 0;
    let resetTimer = null;

    const message =
        document.createElement("div");

    message.textContent =
        "Hecho especialmente para ti ❤️";

    Object.assign(
        message.style,
        {
            position: "fixed",
            left: "50%",
            bottom: "32px",
            transform: "translate(-50%, 20px)",
            padding: "14px 20px",
            borderRadius: "999px",
            background: "rgba(28, 28, 30, 0.96)",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: "600",
            textAlign: "center",
            boxShadow: "0 10px 35px rgba(0, 0, 0, 0.30)",
            opacity: "0",
            pointerEvents: "none",
            transition:
                "opacity 0.25s ease, transform 0.25s ease",
            zIndex: "9999",
            whiteSpace: "nowrap"
        }
    );

    document.body.appendChild(message);

    function showMessage() {

        message.style.opacity = "1";

        message.style.transform =
            "translate(-50%, 0)";

        window.setTimeout(
            () => {

                message.style.opacity = "0";

                message.style.transform =
                    "translate(-50%, 20px)";

            },
            3000
        );

    }

    brandIcon.addEventListener(
        "click",
        () => {

            taps++;

            clearTimeout(resetTimer);

            if (taps >= 5) {

                taps = 0;

                showMessage();

                return;

            }

            resetTimer =
                setTimeout(
                    () => {

                        taps = 0;

                    },
                    1200
                );

        }
    );

})();