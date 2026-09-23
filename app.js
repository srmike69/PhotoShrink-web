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

const targetUnit =
    document.getElementById("targetUnit");

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

const previewSection =
    document.getElementById(
        "previewSection"
    );

const previewButton =
    document.getElementById(
        "previewButton"
    );

const previewContent =
    document.getElementById(
        "previewContent"
    );

const previewOriginal =
    document.getElementById(
        "previewOriginal"
    );

const previewResult =
    document.getElementById(
        "previewResult"
    );

const previewOriginalSize =
    document.getElementById(
        "previewOriginalSize"
    );

const previewResultSize =
    document.getElementById(
        "previewResultSize"
    );

const previewQuality =
    document.getElementById(
        "previewQuality"
    );

const previewResolution =
    document.getElementById(
        "previewResolution"
    );


/* =========================================================
   VARIABLES
   ========================================================= */

let selectedFiles = [];

let compressedFiles = [];

let selectedTargetMB = 1;

let selectedTargetValue = 1;

let selectedTargetUnit = "MB";

let previewObjectURL = null;

let previewOriginalURL = null;

let easterEggClickCount = 0;

let easterEggClickTimer = null;

let easterEggResetTimer = null;

let easterEggMessageTimer = null;


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

    selectedTargetValue = 1;
    selectedTargetUnit = "MB";
    selectedTargetMB = 1;

    if (targetUnit) {
        targetUnit.value = "MB";
    }

    if (targetContainer) {
        targetContainer.classList.remove("hidden");
    }

    updateTargetDescription();
    showPreviewSection();

}


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


                    selectedTargetValue =
                        Number(
                            targetSize.value
                        ) || 1;


                    selectedTargetUnit =
                        targetUnit
                            ? targetUnit.value
                            : "MB";


                    targetSize.focus();

                } else {

                    customTargetContainer.classList.add(
                        "hidden"
                    );


                    selectedTargetValue =
                        Number(
                            size
                        );


                    selectedTargetUnit =
                        "MB";

                }


                selectedTargetMB =
                    selectedTargetUnit ===
                    "KB"
                        ? selectedTargetValue /
                            1024
                        : selectedTargetValue;


                updateTargetDescription();

                showPreviewSection();

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
        updateCustomTarget
    );

}


if (
    targetUnit
) {

    targetUnit.addEventListener(
        "change",
        updateCustomTarget
    );

}


function updateCustomTarget() {

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

        selectedTargetValue =
            value;

    }


    selectedTargetUnit =
        targetUnit
            ? targetUnit.value
            : "MB";


    selectedTargetMB =
        selectedTargetUnit ===
        "KB"
            ? selectedTargetValue /
                1024
            : selectedTargetValue;


    updateTargetDescription();

    hidePreviewResult();

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
            selectedTargetValue
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
        `Cada foto intentará mantenerse por debajo de ${
            formatTargetValue(
                value,
                selectedTargetUnit
            )
        } sin cambiar su resolución.`;

}


function formatTargetValue(
    value,
    unit
) {

    const decimals =
        Number.isInteger(
            value
        )
            ? 0
            : 2;


    return `${value
        .toFixed(
            decimals
        )
        .replace(
            /0+$/,
            ""
        )
        .replace(
            /\.$/,
            ""
        )
    } ${unit}`;

}


function getSelectedTargetBytes() {

    if (
        !Number.isFinite(
            selectedTargetValue
        ) ||
        selectedTargetValue <= 0
    ) {

        return null;

    }


    if (
        selectedTargetUnit ===
        "KB"
    ) {

        return Math.floor(
            selectedTargetValue *
            1024
        );

    }


    return Math.floor(
        selectedTargetValue *
        1024 *
        1024
    );

}


function showPreviewSection() {

    if (
        previewSection
    ) {

        previewSection.classList.remove(
            "hidden"
        );

    }

}


function hidePreviewResult() {

    if (
        previewContent
    ) {

        previewContent.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   BOTÓN COMPRIMIR
   ========================================================= */

compressButton.addEventListener(
    "click",
    async () => {

        if (
            selectedFiles.length ===
            0
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


        const selectedQuality = "target";

        const targetBytes =
            getSelectedTargetBytes();

        if (
            !targetBytes ||
            targetBytes <= 0
        ) {
            alert(
                "Introduce un tamaño objetivo válido."
            );

            compressButton.disabled = false;
            progressSection.classList.add("hidden");
            return;
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


                /*
                 * En modo objetivo NO se debe devolver
                 * una imagen que supere el objetivo.
                 */

                if (
                    selectedQuality ===
                    "target"
                ) {

                    alert(
                        error.message ||
                        `No se pudo comprimir "${file.name}" sin superar el tamaño objetivo.`
                    );

                    compressedButtonSafeReset();

                    return;

                }


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


function compressedButtonSafeReset() {

    compressButton.disabled =
        false;

    progressSection.classList.add(
        "hidden"
    );

    progressBar.style.width =
        "0%";

}


/* =========================================================
   COMPRESIÓN PRINCIPAL
   ========================================================= */

async function compressImage(
    file,
    qualityMode,
    targetBytes
) {

    if (
        !file.type.startsWith("image/") &&
        !isHeicFile(
            file
        )
    ) {

        return file;

    }


    const originalType =
        getImageMimeType(
            file
        );


    const image =
        await loadImage(
            file
        );


    /*
     * Para el modo Tamaño objetivo no obligamos a conservar
     * PNG/WebP/HEIC. El archivo final se codifica como JPEG,
     * igual que en el comportamiento de referencia de PhotoShrink.
     *
     * Esto permite reducciones muy grandes manteniendo exactamente
     * el ancho y el alto originales.
     */
    const outputType =
        "image/jpeg";


    /*
     * Extraemos todos los metadatos que podamos transportar al JPEG
     * final ANTES de dibujar la imagen en canvas, ya que canvas los elimina.
     */
    const originalMetadata =
        preserveMetadata &&
        preserveMetadata.checked
            ? await extractPortableMetadata(
                file,
                originalType
            )
            : [];


    return compressToTarget(
        image,
        file,
        targetBytes,
        originalMetadata,
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


    if (
        /\.avif$/i.test(
            file.name
        )
    ) {

        return "image/avif";

    }


    if (
        /\.gif$/i.test(
            file.name
        )
    ) {

        return "image/gif";

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
   DETECTAR TRANSPARENCIA
   ========================================================= */

function imageHasTransparency(
    image
) {

    const maxTestSize =
        512;


    const scale =
        Math.min(
            1,
            maxTestSize /
                Math.max(
                    image.naturalWidth,
                    image.naturalHeight
                )
        );


    const width =
        Math.max(
            1,
            Math.round(
                image.naturalWidth *
                scale
            )
        );


    const height =
        Math.max(
            1,
            Math.round(
                image.naturalHeight *
                scale
            )
        );


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        width;

    canvas.height =
        height;


    const context =
        canvas.getContext(
            "2d",
            {
                willReadFrequently:
                    true
            }
        );


    if (
        !context
    ) {

        return false;

    }


    context.clearRect(
        0,
        0,
        width,
        height
    );


    context.drawImage(
        image,
        0,
        0,
        width,
        height
    );


    try {

        const pixels =
            context.getImageData(
                0,
                0,
                width,
                height
            ).data;


        for (
            let index = 3;
            index < pixels.length;
            index += 4
        ) {

            if (
                pixels[index] <
                255
            ) {

                return true;

            }

        }

    } catch (
        error
    ) {

        console.warn(
            "No se pudo comprobar la transparencia:",
            error
        );

    }


    return false;

}


/* =========================================================
   COMPROBAR SOPORTE DE CODIFICACIÓN
   ========================================================= */

async function canEncodeImageType(
    type
) {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        2;

    canvas.height =
        2;


    const context =
        canvas.getContext(
            "2d"
        );


    if (
        !context
    ) {

        return false;

    }


    context.fillRect(
        0,
        0,
        2,
        2
    );


    try {

        const blob =
            await canvasToBlob(
                canvas,
                0.80,
                type
            );


        return (
            blob &&
            blob.type ===
                type
        );

    } catch (
        error
    ) {

        return false;

    }

}


/* =========================================================
   COMPRESIÓN A TAMAÑO OBJETIVO
   ========================================================= */

async function compressToTarget(
    image,
    originalFile,
    targetBytes,
    originalMetadata,
    outputType
) {

    if (
        !targetBytes ||
        targetBytes <= 0
    ) {

        throw new Error(
            "Tamaño objetivo inválido."
        );

    }


    if (
        originalFile.size <=
        targetBytes
    ) {

        const originalResult =
            new File(
                [originalFile],
                originalFile.name,
                {
                    type:
                        originalFile.type,
                    lastModified:
                        originalFile.lastModified
                }
            );


        originalResult.__photoShrinkQuality =
            100;

        originalResult.__photoShrinkWidth =
            image.naturalWidth;

        originalResult.__photoShrinkHeight =
            image.naturalHeight;


        return originalResult;

    }


    const originalWidth =
        image.naturalWidth;

    const originalHeight =
        image.naturalHeight;


    /*
     * Objetivo estricto:
     * 1) Intentamos mantener el 100 % de resolución.
     * 2) Si el encoder no puede llegar al tamaño solicitado,
     *    reducimos resolución de forma progresiva.
     * 3) Nunca devolvemos un archivo por encima del objetivo.
     *
     * Esta es la parte que se había eliminado y provocaba los errores.
     */
    async function createCandidate(
        scale,
        quality
    ) {

        const width =
            Math.max(
                1,
                Math.round(
                    originalWidth *
                    scale
                )
            );

        const height =
            Math.max(
                1,
                Math.round(
                    originalHeight *
                    scale
                )
            );


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            width;

        canvas.height =
            height;


        const context =
            canvas.getContext(
                "2d",
                {
                    alpha:
                        false
                }
            );


        if (
            !context
        ) {

            throw new Error(
                "No se pudo crear el canvas."
            );

        }


        context.fillStyle =
            "#ffffff";

        context.fillRect(
            0,
            0,
            width,
            height
        );


        context.imageSmoothingEnabled =
            true;

        context.imageSmoothingQuality =
            "high";


        context.drawImage(
            image,
            0,
            0,
            width,
            height
        );


        let blob =
            await canvasToBlob(
                canvas,
                quality,
                "image/jpeg"
            );


        if (
            preserveMetadata &&
            preserveMetadata.checked &&
            originalMetadata &&
            originalMetadata.length
        ) {

            blob =
                await insertMetadataIntoJpeg(
                    blob,
                    originalMetadata
                );

        }


        return {
            blob,
            width,
            height,
            quality,
            scale,
            outputType:
                "image/jpeg"
        };

    }


    async function bestAtScale(
        scale
    ) {

        const minimumQuality =
            0;

        const maximumQuality =
            1;


        const minimumCandidate =
            await createCandidate(
                scale,
                minimumQuality
            );


        if (
            minimumCandidate.blob.size >
            targetBytes
        ) {

            return null;

        }


        const maximumCandidate =
            await createCandidate(
                scale,
                maximumQuality
            );


        if (
            maximumCandidate.blob.size <=
            targetBytes
        ) {

            return maximumCandidate;

        }


        let best =
            minimumCandidate;

        let low =
            minimumQuality;

        let high =
            maximumQuality;


        for (
            let attempt = 0;
            attempt < 22;
            attempt++
        ) {

            const quality =
                (
                    low +
                    high
                ) /
                2;


            const candidate =
                await createCandidate(
                    scale,
                    quality
                );


            if (
                candidate.blob.size <=
                targetBytes
            ) {

                best =
                    candidate;

                low =
                    quality;

            } else {

                high =
                    quality;

            }

        }


        return best;

    }


    /*
     * Primero probamos resolución completa.
     */
    let best =
        await bestAtScale(
            1
        );


    if (
        !best
    ) {

        /*
         * Encontramos una escala que sí entra.
         * 1/256 garantiza que incluso objetivos muy pequeños tengan
         * una salida posible sin recurrir al antiguo mensaje de error.
         */
        let fittingScale =
            null;

        let scale =
            0.95;


        while (
            scale >=
            (1 / 256)
        ) {

            const candidate =
                await bestAtScale(
                    scale
                );


            if (
                candidate
            ) {

                best =
                    candidate;

                fittingScale =
                    scale;

                break;

            }


            scale *=
                0.85;

        }


        if (
            !best
        ) {

            /*
             * Último recurso: 1×1. Para cualquier objetivo razonable
             * de la interfaz esto cabe. Si ni esto entra, el objetivo
             * es menor que la sobrecarga mínima de un JPEG.
             */
            best =
                await bestAtScale(
                    Math.min(
                        1 / originalWidth,
                        1 / originalHeight
                    )
                );

        }


        if (
            best &&
            fittingScale !==
                null
        ) {

            /*
             * Ya sabemos que fittingScale entra y que una escala mayor
             * falló. Afinamos la resolución máxima posible.
             */
            let lowScale =
                fittingScale;

            let highScale =
                Math.min(
                    1,
                    fittingScale /
                    0.85
                );


            for (
                let attempt = 0;
                attempt < 14;
                attempt++
            ) {

                const middleScale =
                    (
                        lowScale +
                        highScale
                    ) /
                    2;


                const candidate =
                    await bestAtScale(
                        middleScale
                    );


                if (
                    candidate
                ) {

                    best =
                        candidate;

                    lowScale =
                        middleScale;

                } else {

                    highScale =
                        middleScale;

                }

            }

        }

    }


    if (
        !best ||
        best.blob.size >
            targetBytes
    ) {

        throw new Error(
            "El tamaño solicitado es menor que el tamaño mínimo que puede tener un archivo JPEG."
        );

    }


    return createCompressedTargetFile(
        best,
        originalFile,
        targetBytes,
        "image/jpeg"
    );

}


/* =========================================================
   CREAR ARCHIVO DE TAMAÑO OBJETIVO
   ========================================================= */

function createCompressedTargetFile(
    candidate,
    originalFile,
    targetBytes,
    outputType
) {

    if (
        candidate.blob.size >
        targetBytes
    ) {

        throw new Error(
            "El archivo final supera el tamaño objetivo."
        );

    }


    const file =
        createCompressedFile(
            candidate.blob,
            originalFile,
            outputType
        );


    file.__photoShrinkQuality =
        candidate.quality ===
            null
            ? null
            : Math.round(
                candidate.quality *
                100
            );


    file.__photoShrinkWidth =
        candidate.width;


    file.__photoShrinkHeight =
        candidate.height;


    file.__photoShrinkFormat =
        outputType;


    return file;

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
   METADATOS PORTABLES
   ========================================================= */

/*
 * Canvas elimina los metadatos. Estas funciones extraen los bloques
 * que pueden transportarse de forma válida a un JPEG final:
 *
 * JPEG: EXIF/XMP (APP1), ICC (APP2), IPTC/Photoshop (APP13), COM.
 * PNG:  eXIf -> APP1 EXIF.
 * WebP: EXIF -> APP1 EXIF.
 *
 * Los bloques que no tienen una representación JPEG válida no se
 * inventan ni se descartan silenciosamente como si se hubieran
 * conservado. El archivo final conserva todo lo que el formato JPEG
 * permite transportar de forma válida.
 */

async function extractPortableMetadata(
    file,
    originalType
) {

    try {

        const bytes =
            new Uint8Array(
                await file.arrayBuffer()
            );


        if (
            originalType ===
                "image/jpeg" ||
            originalType ===
                "image/jpg"
        ) {

            return extractJpegMetadataSegments(
                bytes
            );

        }


        if (
            originalType ===
            "image/png"
        ) {

            return extractPngPortableMetadata(
                bytes
            );

        }


        if (
            originalType ===
            "image/webp"
        ) {

            return extractWebpPortableMetadata(
                bytes
            );

        }


        if (
            originalType ===
                "image/heic" ||
            originalType ===
                "image/heif" ||
            isHeicFile(
                file
            )
        ) {

            return extractHeifPortableMetadata(
                bytes
            );

        }


        return [];

    } catch (
        error
    ) {

        console.warn(
            "No se pudieron extraer los metadatos:",
            error
        );


        return [];

    }

}


function extractHeifPortableMetadata(
    bytes
) {

    const segments =
        [];


    /*
     * HEIF es un contenedor ISO-BMFF. En una PWA sin backend no existe
     * una API web estándar que entregue todos sus items de metadatos.
     * Buscamos EXIF/XMP embebidos que puedan transportarse legalmente
     * al JPEG final.
     */
    const exifSignature =
        new Uint8Array([
            0x45,
            0x78,
            0x69,
            0x66,
            0x00,
            0x00
        ]);


    for (
        let i = 0;
        i <=
            bytes.length -
            exifSignature.length;
        i++
    ) {

        let matches =
            true;


        for (
            let j = 0;
            j <
                exifSignature.length;
            j++
        ) {

            if (
                bytes[i + j] !==
                exifSignature[j]
            ) {

                matches =
                    false;

                break;

            }

        }


        if (
            matches
        ) {

            /*
             * El tamaño exacto del item HEIF requiere interpretar iloc/iinf.
             * Para evitar fabricar un APP1 corrupto, solo conservamos EXIF
             * cuando podemos reconocer un TIFF válido inmediatamente después.
             */
            const tiffStart =
                i +
                6;


            const littleEndian =
                bytes[tiffStart] ===
                    0x49 &&
                bytes[tiffStart + 1] ===
                    0x49 &&
                bytes[tiffStart + 2] ===
                    0x2A &&
                bytes[tiffStart + 3] ===
                    0x00;


            const bigEndian =
                bytes[tiffStart] ===
                    0x4D &&
                bytes[tiffStart + 1] ===
                    0x4D &&
                bytes[tiffStart + 2] ===
                    0x00 &&
                bytes[tiffStart + 3] ===
                    0x2A;


            if (
                littleEndian ||
                bigEndian
            ) {

                /*
                 * APP1 admite como máximo 65533 bytes de payload.
                 * Copiamos hasta ese límite; insertMetadataIntoJpeg
                 * vuelve a validar el segmento.
                 */
                const end =
                    Math.min(
                        bytes.length,
                        i +
                            65531
                    );


                const payload =
                    bytes.slice(
                        i,
                        end
                    );


                const segment =
                    createJpegAppSegment(
                        0xE1,
                        payload
                    );


                if (
                    segment
                ) {

                    segments.push(
                        segment
                    );

                }

            }


            break;

        }

    }


    return segments;

}


function extractJpegMetadataSegments(
    bytes
) {

    const segments = [];


    if (
        bytes.length < 4 ||
        bytes[0] !== 0xFF ||
        bytes[1] !== 0xD8
    ) {

        return segments;

    }


    let offset =
        2;


    while (
        offset + 4 <=
        bytes.length
    ) {

        if (
            bytes[offset] !==
            0xFF
        ) {

            break;

        }


        const marker =
            bytes[
                offset + 1
            ];


        if (
            marker ===
                0xDA ||
            marker ===
                0xD9
        ) {

            break;

        }


        if (
            marker ===
                0xD8 ||
            marker ===
                0x01 ||
            (
                marker >=
                    0xD0 &&
                marker <=
                    0xD7
            )
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


        /*
         * APP1 = EXIF/XMP
         * APP2 = ICC
         * APP13 = IPTC/Photoshop
         * COM = comentario
         */
        if (
            marker ===
                0xE1 ||
            marker ===
                0xE2 ||
            marker ===
                0xED ||
            marker ===
                0xFE
        ) {

            segments.push(
                bytes.slice(
                    offset,
                    offset +
                        2 +
                        length
                )
            );

        }


        offset +=
            2 +
            length;

    }


    return segments;

}


function extractPngPortableMetadata(
    bytes
) {

    const segments = [];


    if (
        bytes.length < 8 ||
        bytes[0] !== 0x89 ||
        bytes[1] !== 0x50 ||
        bytes[2] !== 0x4E ||
        bytes[3] !== 0x47
    ) {

        return segments;

    }


    let offset =
        8;


    while (
        offset + 12 <=
        bytes.length
    ) {

        const length =
            (
                bytes[offset] *
                    0x1000000
            ) +
            (
                bytes[offset + 1] <<
                    16
            ) +
            (
                bytes[offset + 2] <<
                    8
            ) +
            bytes[offset + 3];


        const type =
            String.fromCharCode(
                bytes[offset + 4],
                bytes[offset + 5],
                bytes[offset + 6],
                bytes[offset + 7]
            );


        const dataStart =
            offset + 8;

        const dataEnd =
            dataStart +
            length;


        if (
            dataEnd + 4 >
            bytes.length
        ) {

            break;

        }


        if (
            type ===
            "eXIf"
        ) {

            const exifPayload =
                bytes.slice(
                    dataStart,
                    dataEnd
                );


            const prefix =
                new Uint8Array([
                    0x45,
                    0x78,
                    0x69,
                    0x66,
                    0x00,
                    0x00
                ]);


            const payload =
                new Uint8Array(
                    prefix.length +
                    exifPayload.length
                );


            payload.set(
                prefix,
                0
            );

            payload.set(
                exifPayload,
                prefix.length
            );


            const segment =
                createJpegAppSegment(
                    0xE1,
                    payload
                );


            if (
                segment
            ) {

                segments.push(
                    segment
                );

            }

        }


        offset =
            dataEnd + 4;


        if (
            type ===
            "IEND"
        ) {

            break;

        }

    }


    return segments;

}


function extractWebpPortableMetadata(
    bytes
) {

    const segments = [];


    if (
        bytes.length < 12 ||
        String.fromCharCode(
            ...bytes.slice(
                0,
                4
            )
        ) !==
            "RIFF" ||
        String.fromCharCode(
            ...bytes.slice(
                8,
                12
            )
        ) !==
            "WEBP"
    ) {

        return segments;

    }


    let offset =
        12;


    while (
        offset + 8 <=
        bytes.length
    ) {

        const type =
            String.fromCharCode(
                bytes[offset],
                bytes[offset + 1],
                bytes[offset + 2],
                bytes[offset + 3]
            );


        const length =
            bytes[offset + 4] |
            (
                bytes[offset + 5] <<
                8
            ) |
            (
                bytes[offset + 6] <<
                16
            ) |
            (
                bytes[offset + 7] <<
                24
            );


        const dataStart =
            offset + 8;

        const dataEnd =
            dataStart +
            length;


        if (
            dataEnd >
            bytes.length
        ) {

            break;

        }


        if (
            type ===
            "EXIF"
        ) {

            let exifPayload =
                bytes.slice(
                    dataStart,
                    dataEnd
                );


            const hasExifPrefix =
                exifPayload.length >= 6 &&
                exifPayload[0] === 0x45 &&
                exifPayload[1] === 0x78 &&
                exifPayload[2] === 0x69 &&
                exifPayload[3] === 0x66 &&
                exifPayload[4] === 0x00 &&
                exifPayload[5] === 0x00;


            if (
                !hasExifPrefix
            ) {

                const prefix =
                    new Uint8Array([
                        0x45,
                        0x78,
                        0x69,
                        0x66,
                        0x00,
                        0x00
                    ]);


                const combined =
                    new Uint8Array(
                        prefix.length +
                        exifPayload.length
                    );


                combined.set(
                    prefix,
                    0
                );

                combined.set(
                    exifPayload,
                    prefix.length
                );


                exifPayload =
                    combined;

            }


            const segment =
                createJpegAppSegment(
                    0xE1,
                    exifPayload
                );


            if (
                segment
            ) {

                segments.push(
                    segment
                );

            }

        }


        offset =
            dataEnd +
            (
                length %
                2
            );

    }


    return segments;

}


function createJpegAppSegment(
    marker,
    payload
) {

    /*
     * El campo length de JPEG es de 16 bits e incluye sus propios 2 bytes.
     */
    if (
        !payload ||
        payload.length + 2 >
            0xFFFF
    ) {

        return null;

    }


    const length =
        payload.length + 2;


    const segment =
        new Uint8Array(
            payload.length + 4
        );


    segment[0] =
        0xFF;

    segment[1] =
        marker;

    segment[2] =
        (
            length >>
            8
        ) &
        0xFF;

    segment[3] =
        length &
        0xFF;


    segment.set(
        payload,
        4
    );


    return segment;

}


/* =========================================================
   ORIENTACIÓN EXIF: evitar giro doble tras canvas
   ========================================================= */

function normalizeExifOrientationSegment(segment) {
    if (!segment || segment.length < 22 ||
        segment[0] !== 0xFF || segment[1] !== 0xE1) {
        return segment;
    }

    // APP1: marcador(2), longitud(2), "Exif\0\0"(6), TIFF.
    const exif = [0x45, 0x78, 0x69, 0x66, 0, 0];
    if (!exif.every((byte, i) => segment[4 + i] === byte)) {
        return segment;
    }

    const tiff = 10;
    const little = segment[tiff] === 0x49 && segment[tiff + 1] === 0x49;
    const big = segment[tiff] === 0x4D && segment[tiff + 1] === 0x4D;
    if (!little && !big) return segment;

    const read16 = pos => little
        ? segment[pos] | (segment[pos + 1] << 8)
        : (segment[pos] << 8) | segment[pos + 1];
    const read32 = pos => little
        ? ((segment[pos] | (segment[pos + 1] << 8) |
            (segment[pos + 2] << 16) | (segment[pos + 3] * 0x1000000)) >>> 0)
        : ((segment[pos] * 0x1000000 + (segment[pos + 1] << 16) +
            (segment[pos + 2] << 8) + segment[pos + 3]) >>> 0);

    if (read16(tiff + 2) !== 42) return segment;
    const ifd = tiff + read32(tiff + 4);
    if (ifd < tiff + 8 || ifd + 2 > segment.length) return segment;
    const count = read16(ifd);
    if (count > 1024 || ifd + 2 + count * 12 > segment.length) return segment;

    for (let i = 0; i < count; i++) {
        const entry = ifd + 2 + i * 12;
        // Tag 0x0112, SHORT (3), count 1, inline value at +8.
        if (read16(entry) === 0x0112 &&
            read16(entry + 2) === 3 && read32(entry + 4) === 1) {
            const normalized = segment.slice();
            if (little) {
                normalized[entry + 8] = 1;
                normalized[entry + 9] = 0;
            } else {
                normalized[entry + 8] = 0;
                normalized[entry + 9] = 1;
            }
            return normalized;
        }
    }
    return segment;
}


async function insertMetadataIntoJpeg(
    blob,
    segments
) {

    if (
        !segments ||
        !segments.length
    ) {

        return blob;

    }


    const jpeg =
        new Uint8Array(
            await blob.arrayBuffer()
        );


    if (
        jpeg.length < 2 ||
        jpeg[0] !==
            0xFF ||
        jpeg[1] !==
            0xD8
    ) {

        return blob;

    }


    /* Canvas exporta los píxeles con la orientación ya aplicada por
     * el navegador. Si copiamos Orientation=6/8 del original, Fotos
     * vuelve a girar el JPEG final. Normalizamos SOLO ese campo a 1;
     * fecha, GPS, cámara y demás EXIF permanecen intactos.
     */
    const uprightSegments =
        segments.map(normalizeExifOrientationSegment);


    const validSegments =
        uprightSegments.filter(
            segment =>
                segment &&
                segment.length >= 4
        );


    if (
        !validSegments.length
    ) {

        return blob;

    }


    const metadataLength =
        validSegments.reduce(
            (
                total,
                segment
            ) =>
                total +
                segment.length,
            0
        );


    const output =
        new Uint8Array(
            jpeg.length +
            metadataLength
        );


    output[0] =
        jpeg[0];

    output[1] =
        jpeg[1];


    let offset =
        2;


    for (
        const segment of
        validSegments
    ) {

        output.set(
            segment,
            offset
        );


        offset +=
            segment.length;

    }


    output.set(
        jpeg.slice(
            2
        ),
        offset
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

async function loadImage(
    file
) {

    /*
     * HEIC/HEIF necesita un decodificador real en navegador.
     * No dependemos de que Safari/Chrome sepan mostrarlo mediante <img>.
     */
    if (
        isHeicFile(
            file
        )
    ) {

        const convertedBlob =
            await decodeHeicForProcessing(
                file
            );


        return loadStandardImage(
            convertedBlob
        );

    }


    return loadStandardImage(
        file
    );

}


function loadStandardImage(
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
                            "No se pudo leer la imagen."
                        )
                    );

                };


            image.src =
                objectURL;

        }
    );

}


async function decodeHeicForProcessing(
    file
) {

    const decoder =
        window.HeicTo;


    if (
        !decoder
    ) {

        throw new Error(
            "No se pudo cargar el decodificador HEIC/HEIF. Comprueba la conexión y vuelve a abrir PhotoShrink."
        );

    }


    try {

        let converted;


        /*
         * heic-to IIFE expone la conversión como función global.
         * También aceptamos heicTo por compatibilidad con otras builds.
         */
        if (
            typeof decoder ===
            "function"
        ) {

            converted =
                await decoder({
                    blob:
                        file,
                    type:
                        "image/jpeg",
                    quality:
                        1
                });

        } else if (
            typeof decoder.heicTo ===
            "function"
        ) {

            converted =
                await decoder.heicTo({
                    blob:
                        file,
                    type:
                        "image/jpeg",
                    quality:
                        1
                });

        } else {

            throw new Error(
                "El decodificador HEIC/HEIF no expone una función compatible."
            );

        }


        if (
            Array.isArray(
                converted
            )
        ) {

            converted =
                converted[0];

        }


        if (
            !(converted instanceof Blob)
        ) {

            throw new Error(
                "La conversión HEIC/HEIF no devolvió una imagen válida."
            );

        }


        return converted;

    } catch (
        error
    ) {

        console.error(
            "Error decodificando HEIC/HEIF:",
            error
        );


        throw new Error(
            "No se pudo decodificar esta imagen HEIC/HEIF."
        );

    }

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

    if (
        previewObjectURL
    ) {

        URL.revokeObjectURL(
            previewObjectURL
        );

        previewObjectURL =
            null;

    }


    if (
        previewOriginalURL
    ) {

        URL.revokeObjectURL(
            previewOriginalURL
        );

        previewOriginalURL =
            null;

    }


    if (
        previewContent
    ) {

        previewContent.classList.add(
            "hidden"
        );

    }


    if (
        previewOriginal
    ) {

        previewOriginal.removeAttribute(
            "src"
        );

    }


    if (
        previewResult
    ) {

        previewResult.removeAttribute(
            "src"
        );

    }


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
   FORMATO BYTES
   ========================================================= */

function formatBytes(
    bytes
) {

    if (
        bytes <
        1024
    ) {

        return `${bytes} B`;

    }


    const kb =
        bytes /
        1024;


    if (
        kb <
        1024
    ) {

        return `${kb.toFixed(1)} KB`;

    }


    const mb =
        kb /
        1024;


    return `${mb.toFixed(2)} MB`;

}


/* =========================================================
   VISTA PREVIA
   ========================================================= */

if (
    previewButton
) {

    previewButton.addEventListener(
        "click",
        async () => {

            if (
                selectedFiles.length ===
                0
            ) {

                return;

            }


            const targetBytes =
                getSelectedTargetBytes();


            if (
                !targetBytes ||
                targetBytes <= 0
            ) {

                return;

            }


            previewButton.disabled =
                true;


            previewButton.textContent =
                "Generando...";


            try {
const originalFile =
    selectedFiles[0];


const image =
    await loadImage(
        originalFile
    );


const originalType =
    getImageMimeType(
        originalFile
    );


const originalMetadata =
    preserveMetadata &&
    preserveMetadata.checked
        ? await extractPortableMetadata(
            originalFile,
            originalType
        )
        : [];


const result =
    await compressToTarget(
        image,
        originalFile,
        targetBytes,
        originalMetadata,
        "image/jpeg"
    );


                if (
                    previewObjectURL
                ) {

                    URL.revokeObjectURL(
                        previewObjectURL
                    );

                }


                if (
                    previewOriginalURL
                ) {

                    URL.revokeObjectURL(
                        previewOriginalURL
                    );

                }


                previewObjectURL =
                    URL.createObjectURL(
                        result
                    );


                previewOriginalURL =
                    URL.createObjectURL(
                        originalFile
                    );


                previewOriginal.src =
                    previewOriginalURL;


                previewResult.src =
                    previewObjectURL;


                previewOriginalSize.textContent =
                    formatBytes(
                        originalFile.size
                    );


                previewResultSize.textContent =
                    formatBytes(
                        result.size
                    );


                if (
    result.__photoShrinkQuality === null
) {

    previewQuality.textContent =
        "Sin pérdida";

} else {

    previewQuality.textContent =
        `${
            result.__photoShrinkQuality ??
            100
        } %`;

}


                previewResolution.textContent =
                    `${
                        result.__photoShrinkWidth ||
                        image.naturalWidth
                    } × ${
                        result.__photoShrinkHeight ||
                        image.naturalHeight
                    }`;


                previewContent.classList.remove(
                    "hidden"
                );

            } catch (
                error
            ) {

                console.error(
                    "Error generando la vista previa:",
                    error
                );


                alert(
                    error.message ||
                    "No se pudo generar la vista previa."
                );

            } finally {

                previewButton.disabled =
                    false;


                previewButton.textContent =
                    "Previsualizar";

            }

        }
    );

}


/* =========================================================
   EASTER EGG
   ========================================================= */

function initializeEasterEgg() {

    const brandIcon =
        document.querySelector(
            ".brand-icon"
        );


    const brand =
        document.querySelector(
            ".brand"
        );


    if (
        !brandIcon ||
        !brand
    ) {

        return;

    }


    brandIcon.addEventListener(
        "click",
        () => {

            easterEggClickCount++;


            clearTimeout(
                easterEggClickTimer
            );


            easterEggClickTimer =
                setTimeout(
                    () => {

                        easterEggClickCount =
                            0;

                    },
                    2000
                );


            if (
                easterEggClickCount <
                5
            ) {

                return;

            }


            easterEggClickCount =
                0;


            activateEasterEgg(
                brandIcon,
                brand
            );

        }
    );

}


function activateEasterEgg(
    brandIcon,
    brand
) {

    clearTimeout(
        easterEggResetTimer
    );


    clearTimeout(
        easterEggMessageTimer
    );


    brandIcon.textContent =
        "M";


    brandIcon.classList.add(
        "easter-egg-active"
    );


    let message =
        brand.querySelector(
            ".easter-egg-message"
        );


    if (
        !message
    ) {

        message =
            document.createElement(
                "p"
            );


        message.className =
            "easter-egg-message";


        brand.appendChild(
            message
        );

    }


    message.textContent =
        "Si has encontrado esto, ya sabes el secreto: esta app la hice pensando en ti. Porque, de alguna manera, siempre termino dejando un pedacito de ti en las cosas que hago ❤️";


    message.classList.add(
        "visible"
    );


    easterEggMessageTimer =
        setTimeout(
            () => {

                message.classList.remove(
                    "visible"
                );

            },
            10000
        );


    easterEggResetTimer =
        setTimeout(
            () => {

                brandIcon.textContent =
                    "PS";


                brandIcon.classList.remove(
                    "easter-egg-active"
                );

            },
            20000
        );

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

initializeEasterEgg();
